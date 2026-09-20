import { memo } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { GraphNode } from "@/core/model";
import { visualForType } from "@/ui/nodeVisuals";

export type DesignNodeData = {
  node: GraphNode;
  isFocus: boolean;
  isSelected: boolean;
  isExpanded: boolean;
  childCount: number;
  badges: string[];
};

export type DesignFlowNode = Node<DesignNodeData, "design">;

function DesignNodeComponent({ data }: NodeProps<DesignFlowNode>) {
  const { node, isFocus, isSelected, isExpanded, childCount, badges } = data;
  const visual = visualForType(node.type);

  const classes = [
    "design-node",
    `shape-${visual.shape}`,
    `cat-${node.type}`,
    isFocus ? "is-focus" : "",
    isSelected ? "is-selected" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} title={`${node.name} — ${visual.label}`}>
      <Handle type="target" position={Position.Left} />
      <span className="design-node__glyph" aria-hidden="true">
        {visual.glyph}
      </span>
      <span className="design-node__body">
        <span className="design-node__name">{node.name}</span>
        <span className="design-node__meta">
          <span className="design-node__type">{visual.label}</span>
          {node.isRemote && <span className="chip chip--remote">library</span>}
          {badges.map((badge) => (
            <span className="chip" key={badge}>
              {badge}
            </span>
          ))}
        </span>
      </span>
      {childCount > 0 && (
        <span className="design-node__children" aria-label={`${childCount} children`}>
          {isExpanded ? "−" : "+"}
          {childCount}
        </span>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export const DesignNode = memo(DesignNodeComponent);
