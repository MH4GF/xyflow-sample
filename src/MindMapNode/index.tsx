import { Handle, NodeProps, Position } from "reactflow";
import useStore from "../store";

export type NodeData = {
  label: string;
};

function MindMapNode({ id, data }: NodeProps<NodeData>) {
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);

  return (
    <>
      <div style={{ margin: "10px" }}>
        <input
          style={{ borderWidth: "1px" , borderRadius: "2px", padding: "10px" }}
          defaultValue={data.label}
          onChange={(evt) => updateNodeLabel(id, evt.target.value)}
        />
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </>
  );
}

export default MindMapNode;
