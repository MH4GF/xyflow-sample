import { Handle, NodeProps, Position } from "reactflow";
import useStore from "../store";

export type NodeData = {
  label: string;
};

// TODO: id使ってなさそう
function MindMapNode({ id, data }: NodeProps<NodeData>) {
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);

  return (
    <>
      <input
        defaultValue={data.label}
        onChange={(evt) => updateNodeLabel(id, evt.target.value)}
      />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

export default MindMapNode;
