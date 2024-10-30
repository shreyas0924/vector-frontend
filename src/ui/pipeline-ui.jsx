import { useState, useRef, useCallback } from "react";

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

// Generate nodeTypes directly from INITIAL_NODES

const nodeTypes = INITIAL_NODES.reduce((acc, node) => {
  acc[node.type] = createNodeComponent(node.config);

  return acc;
}, {});

const selector = (state) => ({
  nodes: state.nodes,

  edges: state.edges,

  getNodeID: state.getNodeID,

  addNode: state.addNode,

  onNodesChange: state.onNodesChange,

  onEdgesChange: state.onEdgesChange,

  onConnect: state.onConnect,
});

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

  const getInitNodeData = (nodeID, type) => {
    const nodeConfig = INITIAL_NODES.find((node) => node.type === type)?.config;

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

  // Custom onConnect function with validation and metadata addition

  // const onConnect = useCallback(

  //   (params) => {

  //     const { source, target } = params;

  //     // Prevent duplicate connections

  //     const existingEdge = edges.find(

  //       (edge) => edge.source === source && edge.target === target

  //     );

  //     if (existingEdge) {

  //       console.log("Duplicate connection prevented");

  //       return;

  //     }

  //     // Find the node types of source and target for validation

  //     const sourceNode = nodes.find((node) => node.id === source.split("-")[0]);

  //     const targetNode = nodes.find((node) => node.id === target.split("-")[0]);

  //     // Example validation logic: only allow InputNode to connect to OutputNode

  //     if (

  //       sourceNode?.type === "input-node" &&

  //       targetNode?.type === "output-node"

  //     ) {

  //       // Customize edge with additional data and styling

  //       const newEdge = {

  //         ...params,

  //         animated: true,

  //         style: { stroke: "red", strokeWidth: 2 },

  //         data: { label: `${source} to ${target}`, timestamp: Date.now() },

  //       };

  //       addEdge(newEdge, edges);

  //     } else {

  //       console.warn(

  //         "Invalid connection: only InputNode to OutputNode allowed"

  //       );

  //     }

  //   },

  //   [edges, nodes]

  // );

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
