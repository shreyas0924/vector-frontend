import { create } from "zustand";

import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from "reactflow";

export const useStore = create((set, get) => ({
  nodes: [],

  edges: [],

  nodeIDs: {}, // Store node IDs based on type

  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };

    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }

    newIDs[type] += 1;

    set({ nodeIDs: newIDs });

    return `${type}-${newIDs[type]}`;
  },

  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    const { source, target, sourceHandle, targetHandle } = connection;

    // Validate the connection if needed

    // For example, check if the source and target types are compatible

    const newEdge = {
      id: `${source}-${sourceHandle}-${target}-${targetHandle}`, // Unique ID for the edge

      source,

      target,

      sourceHandle,

      targetHandle,

      type: "smoothstep",

      animated: true,

      markerEnd: { type: MarkerType.Arrow, height: "20px", width: "20px" },
    };

    // Add the new edge to the current edges

    set({
      edges: addEdge(newEdge, get().edges),
    });
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, [fieldName]: fieldValue };
        }

        return node;
      }),
    });
  },
}));
