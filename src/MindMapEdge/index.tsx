import { BaseEdge, EdgeProps, getStraightPath } from "reactflow";

function MindMapEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  ...props
}: EdgeProps) {
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  return <BaseEdge path={edgePath} {...props} />;
}

export default MindMapEdge;
