import { useEffect, useState, useRef, useCallback } from "react";
import ReactFlow, { Controls, Background, MiniMap, addEdge } from "reactflow";
import { shallow } from "zustand/shallow";
import "reactflow/dist/style.css";
import { INITIAL_NODES } from "../data/initial-state";
import { BaseNode } from "../components/base-node";
import { useStore } from "../zustand/store";

const gridSize = 20;
const proOptions = { hideAttribution: true };

// Create wrapped BaseNode components with their specific configurations
const createNodeComponent = (config) => {
  return ({ id, data, ...rest }) => {
    const nodeConfig = {
      ...config,
      inputFields:
        config.inputFields?.map((field) => ({
          ...field,
          defaultValue:
            typeof field.defaultValue === "function"
              ? field.defaultValue(id)
              : field.defaultValue,
        })) || [],
      handleValues: config.handleValues?.(id) || [],
    };

    return <BaseNode id={id} data={data} {...nodeConfig} {...rest} />;
  };
};

// Extract the state selector for efficiency
const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  customNodes: state.customNodes,
});
const nodeTypes = [...INITIAL_NODES].reduce((acc, node) => {
  acc[node.type] = createNodeComponent(node.config);
  return acc;
}, {});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  // Dynamic nodeTypes based on customNodes state

  const getInitNodeData = (nodeID, type) => {
    const nodeConfig = [...INITIAL_NODES].find(
      (node) => node.type === type
    )?.config;

    const initialData = {
      id: nodeID,
      nodeType: type,
      resizable: nodeConfig?.resizable ?? true,
    };

    if (nodeConfig?.inputFields) {
      nodeConfig.inputFields.forEach((field) => {
        initialData[field.name] =
          typeof field.defaultValue === "function"
            ? field.defaultValue(nodeID)
            : field.defaultValue;
      });
    }

    return initialData;
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData("application/reactflow")) {
        const appData = JSON.parse(
          event.dataTransfer.getData("application/reactflow")
        );
        const type = appData?.nodeType;
        if (typeof type === "undefined" || !type) return;
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });
        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };
        addNode(newNode);
      }
    },
    [reactFlowInstance]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div ref={reactFlowWrapper} style={{ width: "100vw", height: "80vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType="smoothstep"
      >
        <Background color="#aaa" gap={gridSize} variant="dots" />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};
