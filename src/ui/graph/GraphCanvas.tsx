import { useCallback, useEffect, useMemo, type MouseEvent } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
} from "@xyflow/react";
import { useGraphStore } from "@/state/graphStore";
import { useSubgraph } from "@/state/selectors";
import { colorForType, EDGE_VISUALS } from "@/ui/nodeVisuals";
import { DesignNode, type DesignFlowNode } from "./nodes/DesignNode";
import { hierarchicalLayout, radialLayout } from "./layout/layouts";

const nodeTypes = { design: DesignNode };

export function GraphCanvas() {
  const index = useGraphStore((state) => state.index);
  const focusId = useGraphStore((state) => state.focusId);
  const selectedIds = useGraphStore((state) => state.selectedIds);
  const expandedIds = useGraphStore((state) => state.expandedIds);
  const viewMode = useGraphStore((state) => state.viewMode);
  const focusNode = useGraphStore((state) => state.focusNode);
  const toggleExpanded = useGraphStore((state) => state.toggleExpanded);
  const toggleSelected = useGraphStore((state) => state.toggleSelected);

  const subgraph = useSubgraph();
  const { fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<DesignFlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const selected = useMemo(() => new Set(selectedIds), [selectedIds]);
  const expanded = useMemo(() => new Set(expandedIds), [expandedIds]);

  useEffect(() => {
    if (!subgraph || !index) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const flowNodes: DesignFlowNode[] = subgraph.nodes.map((node) => {
      const badges: string[] = [];
      if (node.isInstance && !node.mainComponentId) badges.push("unresolved");
      if (node.type === "COMPONENT_SET") {
        const variants = index.getVariantsOf(node.id).length;
        if (variants) badges.push(`${variants} variants`);
      }
      if (node.isMainComponent) {
        const instances = index.getAllInstancesOf(node.id).length;
        badges.push(instances ? `${instances} uses` : "unused");
      }
      if (node.metadata?.["identity"] === "inferred-from-name") badges.push("name-matched");
      return {
        id: node.id,
        type: "design",
        position: { x: 0, y: 0 },
        data: {
          node,
          isFocus: node.id === focusId,
          isSelected: selected.has(node.id),
          isExpanded: expanded.has(node.id),
          childCount: index.getChildIds(node.id).length,
          badges,
        },
      };
    });

    const flowEdges: Edge[] = subgraph.edges.map((edge) => {
      const visual = EDGE_VISUALS[edge.type];
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: "smoothstep",
        animated: visual.animated,
        label: edge.type === "CONTAINS" ? undefined : (edge.label ?? visual.label),
        labelShowBg: true,
        style: {
          stroke: visual.stroke,
          strokeWidth: edge.type === "CONTAINS" ? 1.5 : 1.25,
          strokeDasharray: visual.dashed ? "5 4" : undefined,
        },
        markerEnd: { type: MarkerType.ArrowClosed, color: visual.stroke, width: 14, height: 14 },
        data: { edgeType: edge.type },
      };
    });

    const laidOut =
      viewMode === "dependency" || viewMode === "usage"
        ? radialLayout(flowNodes, flowEdges, focusId ?? flowNodes[0]?.id ?? "")
        : hierarchicalLayout(flowNodes, flowEdges, "LR");

    setNodes(laidOut);
    setEdges(flowEdges);
  }, [subgraph, index, focusId, selected, expanded, viewMode, setNodes, setEdges]);

  // Re-fit when the *subgraph* changes, not when `nodes` changes — otherwise
  // dragging a node would yank the viewport back on every mouse move.
  useEffect(() => {
    if (!subgraph?.nodes.length) return;
    const timer = window.setTimeout(() => {
      void fitView({ duration: 320, padding: 0.18, maxZoom: 1.1 });
    }, 60);
    return () => window.clearTimeout(timer);
  }, [subgraph, fitView]);

  const handleNodeClick = useCallback(
    (event: MouseEvent, node: DesignFlowNode) => {
      if (event.metaKey || event.ctrlKey) {
        toggleSelected(node.id);
        return;
      }
      if (event.shiftKey) {
        focusNode(node.id);
        return;
      }
      useGraphStore.setState({ selectedIds: [node.id] });
    },
    [focusNode, toggleSelected],
  );

  const handleNodeDoubleClick = useCallback(
    (_event: MouseEvent, node: DesignFlowNode) => {
      toggleExpanded(node.id);
    },
    [toggleExpanded],
  );

  if (!subgraph) {
    return <div className="canvas-empty">Load a file to explore its graph.</div>;
  }

  return (
    <div className="app__canvas-host" role="application" aria-label="Explorer graph">
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={handleNodeClick}
      onNodeDoubleClick={handleNodeDoubleClick}
      onPaneClick={() => useGraphStore.getState().clearSelection()}
      proOptions={{ hideAttribution: false }}
      minZoom={0.05}
      maxZoom={2}
      fitView
    >
      <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="var(--grid-dot)" />
      <Controls showInteractive={false} />
      <MiniMap
        pannable
        zoomable
        nodeColor={(node) => colorForType((node.data as DesignFlowNode["data"]).node.type)}
        maskColor="var(--minimap-mask)"
      />
    </ReactFlow>
    </div>
  );
}
