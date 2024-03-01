import ReactFlow, {
  Controls,
  OnConnectEnd,
  OnConnectStart,
  Panel,
  useReactFlow,
  useStoreApi,
  Node,
  Background,
  MiniMap,
} from "reactflow";
import { shallow } from "zustand/shallow";

// we have to import the React Flow styles for it to work
import "reactflow/dist/style.css";
import useStore, { RFStore } from "./store";
import MindMapNode from "./MindMapNode";
import MindMapEdge from "./MindMapEdge";
import { useCallback, useMemo, useRef } from "react";

const selector = (state: RFStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
});

const nodeTypes = {
  mindmap: MindMapNode,
};

const edgeTypes = {
  mindmap: MindMapEdge,
};

function Flow() {
  const reactFlow = useReactFlow();
  const { nodes, edges, onEdgesChange, onNodesChange, addChildNode } = useStore(
    selector,
    shallow
  );
  const store = useStoreApi();

  const getChildNodePosition = useCallback(
    (event: MouseEvent, parentNode?: Node) => {
      const { domNode } = store.getState();
      if (
        !domNode ||
        !parentNode?.positionAbsolute ||
        !parentNode?.width ||
        !parentNode?.height
      ) {
        return;
      }

      const panePosition = reactFlow.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      return {
        x:
          panePosition.x - parentNode.positionAbsolute.x - parentNode.width / 2,
        y:
          panePosition.y -
          parentNode.positionAbsolute.y -
          parentNode.height / 2,
      };
    },
    [reactFlow, store]
  );

  const connectingNodeId = useRef<string | null>(null);
  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);
  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const { nodeInternals } = store.getState();
      const targetIsPane = (event.target as Element).classList.contains(
        "react-flow__pane"
      );

      if (targetIsPane && connectingNodeId.current) {
        const parentNode = nodeInternals.get(connectingNodeId.current);
        const childNodePosition = getChildNodePosition(
          event as MouseEvent, // TODO: fix types
          parentNode
        );

        if (parentNode && childNodePosition) {
          addChildNode(parentNode, childNodePosition);
        }
      }
    },
    [addChildNode, getChildNodePosition, store]
  );

  const output = useMemo(
    () => ({
      nodes: nodes.map((node) => ({
        nodeId: node.id,
        data: {
          label: node.data.label,
        },
      })),
      edges: edges.map((edge) => ({
        sourceId: edge.source,
        targetId: edge.target,
      })),
    }),
    [nodes, edges]
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <p
        style={{
          margin: "10px",
        }}
      >
        {JSON.stringify(output)}
      </p>
      <div
        style={{
          width: "calc(100% - 20px)",
          height: "90%",
          border: "1px solid black",
          borderRadius: "5px",
          margin: "10px",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
        >
          <Controls showInteractive={false} />
          <Panel position="top-left">React Flow Mind Map</Panel>
          <Background />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}

export default Flow;
