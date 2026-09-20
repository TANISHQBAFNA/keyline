import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import type { GraphNode } from "@/core/model";
import { createSimulation, type SimulationNode } from "@/core/layout/force";
import { useGraphStore } from "@/state/graphStore";
import { useAtlas } from "@/state/selectors";

/**
 * The whole-file view.
 *
 * React Flow renders the focused levels, where every node is an information-
 * dense card. That approach stops scaling somewhere around a thousand DOM
 * nodes, and at file scale the useful signal is shape and clustering rather
 * than per-node detail — so the atlas is drawn on a 2D canvas instead.
 */

interface Viewport {
  x: number;
  y: number;
  scale: number;
}

const LABEL_BUDGET = 44;

export function AtlasCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const viewportRef = useRef<Viewport>({ x: 0, y: 0, scale: 1 });
  const dragRef = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const hoverRef = useRef<string | null>(null);

  const index = useGraphStore((state) => state.index);
  const selectedIds = useGraphStore((state) => state.selectedIds);
  const focusNode = useGraphStore((state) => state.focusNode);
  const setMode = useGraphStore((state) => state.setMode);
  const hiddenCommunities = useGraphStore((state) => state.atlas.hiddenCommunities);

  const atlas = useAtlas();
  const [layoutDone, setLayoutDone] = useState(false);
  const [hoverLabel, setHoverLabel] = useState<{ node: GraphNode; x: number; y: number } | null>(
    null,
  );

  const hidden = useMemo(() => new Set(hiddenCommunities), [hiddenCommunities]);
  const selected = useMemo(() => new Set(selectedIds), [selectedIds]);

  const simulation = useMemo(() => {
    if (!atlas) return undefined;
    const degree = new Map<string, number>();
    for (const edge of atlas.projection.edges) {
      degree.set(edge.source, (degree.get(edge.source) ?? 0) + 1);
      degree.set(edge.target, (degree.get(edge.target) ?? 0) + 1);
    }
    const simNodes = atlas.projection.nodes.map((node) => {
      const nodeDegree = degree.get(node.id) ?? 0;
      return {
        id: node.id,
        degree: nodeDegree,
        community: atlas.communities.byNode.get(node.id) ?? -1,
        radius: 2.6 + Math.min(7, Math.sqrt(nodeDegree) * 1.5),
      };
    });
    return createSimulation(simNodes, atlas.projection.edges, {
      width: 1800,
      height: 1300,
      iterations: 340,
      seed: 7,
    });
  }, [atlas]);

  const nodeById = useMemo(() => {
    const map = new Map<string, GraphNode>();
    for (const node of atlas?.projection.nodes ?? []) map.set(node.id, node);
    return map;
  }, [atlas]);

  const colorOf = useCallback(
    (nodeId: string): string => {
      const community = atlas?.communities.byNode.get(nodeId);
      if (community === undefined) return "#6b7280";
      return atlas?.communities.communities[community]?.color ?? "#6b7280";
    },
    [atlas],
  );

  /** Fit the settled layout into the viewport. */
  const fit = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !simulation) return;
    const visible = simulation.nodes.filter((node) => !hidden.has(nodeCommunity(node)));
    const points = visible.length ? visible : simulation.nodes;
    if (!points.length) return;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const node of points) {
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
      maxX = Math.max(maxX, node.x);
      maxY = Math.max(maxY, node.y);
    }

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const padding = 60;
    const scale = Math.min(
      (width - padding * 2) / Math.max(1, maxX - minX),
      (height - padding * 2) / Math.max(1, maxY - minY),
      2.2,
    );
    viewportRef.current = {
      scale,
      x: width / 2 - ((minX + maxX) / 2) * scale,
      y: height / 2 - ((minY + maxY) / 2) * scale,
    };
  }, [simulation, hidden]);

  function nodeCommunity(node: SimulationNode): number {
    return node.community;
  }

  /* --------------------------------------------------------------- draw */

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !simulation || !atlas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
      canvas.width = width * ratio;
      canvas.height = height * ratio;
    }

    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);

    const { x: panX, y: panY, scale } = viewportRef.current;
    context.save();
    context.translate(panX, panY);
    context.scale(scale, scale);

    const isVisible = (node: SimulationNode | undefined): node is SimulationNode =>
      Boolean(node) && !hidden.has(node!.community);

    const hovered = hoverRef.current;
    const highlighted = new Set<string>();
    if (hovered) {
      highlighted.add(hovered);
      for (const edge of atlas.projection.edges) {
        if (edge.source === hovered) highlighted.add(edge.target);
        if (edge.target === hovered) highlighted.add(edge.source);
      }
    }

    // Edges first, dimmed, so nodes always read on top.
    context.lineWidth = 0.6 / scale;
    for (const edge of atlas.projection.edges) {
      const a = simulation.byId.get(edge.source);
      const b = simulation.byId.get(edge.target);
      if (!isVisible(a) || !isVisible(b)) continue;

      const touched = hovered ? highlighted.has(edge.source) && highlighted.has(edge.target) : false;
      context.globalAlpha = hovered ? (touched ? 0.75 : 0.05) : 0.16;
      context.strokeStyle = touched ? "#e6ebf5" : colorOf(edge.source);
      context.lineWidth = (touched ? 1.3 : 0.6 + Math.min(1.6, edge.weight * 0.25)) / scale;
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.stroke();
    }

    // Nodes.
    context.globalAlpha = 1;
    for (const node of simulation.nodes) {
      if (!isVisible(node)) continue;
      const dim = hovered ? !highlighted.has(node.id) : false;
      context.globalAlpha = dim ? 0.18 : 1;
      context.fillStyle = colorOf(node.id);
      context.beginPath();
      context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      context.fill();

      if (selected.has(node.id)) {
        context.globalAlpha = 1;
        context.strokeStyle = "#ffffff";
        context.lineWidth = 2 / scale;
        context.beginPath();
        context.arc(node.x, node.y, node.radius + 3 / scale, 0, Math.PI * 2);
        context.stroke();
      }
    }

    // Labels for the biggest hubs only — everything else is noise at this zoom.
    const ranked = [...simulation.nodes]
      .filter(isVisible)
      .sort((a, b) => b.degree - a.degree)
      .slice(0, LABEL_BUDGET);

    context.globalAlpha = 1;
    context.font = `${Math.max(9, 11 / scale)}px ui-sans-serif, system-ui, sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "top";
    for (const node of ranked) {
      const graphNode = nodeById.get(node.id);
      if (!graphNode) continue;
      const dim = hovered ? !highlighted.has(node.id) : false;
      context.globalAlpha = dim ? 0.15 : 0.92;
      context.fillStyle = "#c9d2e3";
      const label = graphNode.name.length > 26 ? `${graphNode.name.slice(0, 25)}…` : graphNode.name;
      context.fillText(label, node.x, node.y + node.radius + 3 / scale);
    }

    context.restore();
  }, [simulation, atlas, hidden, selected, colorOf, nodeById]);

  /* ------------------------------------------------------- animation loop */

  // The loop must depend on the simulation alone. Depending on `draw`/`fit`
  // would restart it every time an unrelated callback identity changed —
  // hover, selection, a community toggle — and it would never finish.
  const drawRef = useRef(draw);
  drawRef.current = draw;
  const fitRef = useRef(fit);
  fitRef.current = fit;

  useEffect(() => {
    if (!simulation) return;
    let cancelled = false;

    /**
     * Small graphs settle synchronously — a few hundred iterations over a few
     * hundred nodes is a handful of milliseconds, and an animated reveal is not
     * worth making correctness depend on frame cadence. (requestAnimationFrame
     * is paused outright in a background tab, which would otherwise leave the
     * layout permanently unfinished.)
     *
     * Above the threshold the same work is spread over frames with a fixed time
     * budget each, so the UI stays responsive while a big file settles.
     */
    const SYNCHRONOUS_NODE_LIMIT = 700;
    const FRAME_BUDGET_MS = 12;

    setLayoutDone(false);

    if (simulation.nodes.length <= SYNCHRONOUS_NODE_LIMIT) {
      simulation.run();
      fitRef.current();
      drawRef.current();
      setLayoutDone(true);
      return;
    }

    const loop = () => {
      if (cancelled) return;
      const started = performance.now();
      let temperature = 1;

      while (temperature > 0 && performance.now() - started < FRAME_BUDGET_MS) {
        temperature = simulation.tick();
      }

      fitRef.current();
      drawRef.current();

      if (temperature > 0) {
        frameRef.current = requestAnimationFrame(loop);
      } else {
        frameRef.current = null;
        setLayoutDone(true);
      }
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => {
      cancelled = true;
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [simulation]);

  // Redraw on interaction-only changes (hover, selection, community toggles).
  useEffect(() => {
    if (frameRef.current === null) draw();
  }, [draw, hidden, selected, layoutDone]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => draw());
    observer.observe(container);
    return () => observer.disconnect();
  }, [draw]);

  /* ------------------------------------------------------------ pointer */

  const toWorld = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const { x, y, scale } = viewportRef.current;
    return {
      x: (clientX - rect.left - x) / scale,
      y: (clientY - rect.top - y) / scale,
    };
  };

  const hitTest = (clientX: number, clientY: number): SimulationNode | undefined => {
    if (!simulation) return undefined;
    const world = toWorld(clientX, clientY);
    const tolerance = 6 / viewportRef.current.scale;
    let best: SimulationNode | undefined;
    let bestDistance = Infinity;
    for (const node of simulation.nodes) {
      if (hidden.has(node.community)) continue;
      const distance = Math.hypot(node.x - world.x, node.y - world.y);
      if (distance <= node.radius + tolerance && distance < bestDistance) {
        best = node;
        bestDistance = distance;
      }
    }
    return best;
  };

  const handlePointerDown = (event: ReactPointerEvent) => {
    dragRef.current = { x: event.clientX, y: event.clientY, moved: false };
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent) => {
    pointerRef.current = { x: event.clientX, y: event.clientY };

    if (dragRef.current) {
      const dx = event.clientX - dragRef.current.x;
      const dy = event.clientY - dragRef.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 2) dragRef.current.moved = true;
      viewportRef.current.x += dx;
      viewportRef.current.y += dy;
      dragRef.current.x = event.clientX;
      dragRef.current.y = event.clientY;
      draw();
      return;
    }

    const hit = hitTest(event.clientX, event.clientY);
    const nextHover = hit?.id ?? null;
    if (nextHover !== hoverRef.current) {
      hoverRef.current = nextHover;
      const graphNode = hit ? nodeById.get(hit.id) : undefined;
      const rect = canvasRef.current?.getBoundingClientRect();
      setHoverLabel(
        graphNode && rect
          ? { node: graphNode, x: event.clientX - rect.left, y: event.clientY - rect.top }
          : null,
      );
      draw();
    } else if (hit && hoverLabel) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setHoverLabel({
          node: hoverLabel.node,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    }
  };

  const handlePointerUp = (event: ReactPointerEvent) => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (drag?.moved) return;

    const hit = hitTest(event.clientX, event.clientY);
    if (hit) useGraphStore.setState({ selectedIds: [hit.id] });
    else useGraphStore.getState().clearSelection();
    draw();
  };

  const handleDoubleClick = (event: ReactMouseEvent) => {
    const hit = hitTest(event.clientX, event.clientY);
    if (!hit) return;
    focusNode(hit.id);
    setMode("explorer");
  };

  const handleWheel = (event: ReactWheelEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
    const current = viewportRef.current;
    const factor = Math.exp(-event.deltaY * 0.0016);
    const scale = Math.min(6, Math.max(0.05, current.scale * factor));
    viewportRef.current = {
      scale,
      x: pointerX - ((pointerX - current.x) / current.scale) * scale,
      y: pointerY - ((pointerY - current.y) / current.scale) * scale,
    };
    draw();
  };

  if (!index || !atlas) {
    return <div className="canvas-empty">Load a file to see its atlas.</div>;
  }

  return (
    <div className="atlas" ref={containerRef}>
      <canvas
        ref={canvasRef}
        className="atlas__canvas"
        role="img"
        aria-label="File atlas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => {
          dragRef.current = null;
          hoverRef.current = null;
          setHoverLabel(null);
          draw();
        }}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
      />

      {hoverLabel && (
        <div className="atlas__tooltip" style={{ left: hoverLabel.x + 14, top: hoverLabel.y + 14 }}>
          <strong>{hoverLabel.node.name}</strong>
          <span>{hoverLabel.node.type.replace(/_/g, " ").toLowerCase()}</span>
          {atlas.usage.get(hoverLabel.node.id) ? (
            <span className="atlas__tooltip-uses">
              {atlas.usage.get(hoverLabel.node.id)} placements
            </span>
          ) : null}
        </div>
      )}

      <div className="atlas__hud">
        <span>
          {atlas.projection.stats.nodes} nodes · {atlas.projection.stats.edges} edges ·{" "}
          {atlas.communities.communities.length} communities
        </span>
        {atlas.projection.stats.collapsedInstances > 0 && (
          <span className="atlas__hud-note">
            {atlas.projection.stats.collapsedInstances} instances folded into their components
          </span>
        )}
        <span className="atlas__hud-note">Q {atlas.communities.modularity.toFixed(3)}</span>
        <button type="button" onClick={() => { fit(); draw(); }}>
          Fit
        </button>
      </div>

      {!layoutDone && <div className="atlas__progress">laying out…</div>}
    </div>
  );
}
