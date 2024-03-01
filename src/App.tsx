import ReactFlow, { Controls, Panel } from "reactflow";

// we have to import the React Flow styles for it to work
import "reactflow/dist/style.css";

function Flow() {
  return (
    <ReactFlow>
      <Controls showInteractive={false} />
      <Panel position="top-left">React Flow Mind Map</Panel>
    </ReactFlow>
  );
}

export default Flow;
