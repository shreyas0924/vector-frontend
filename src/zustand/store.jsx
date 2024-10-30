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
  customNodes: [],

  addCustomNode: (nodeConfig) => {
    set((state) => ({
      customNodes: [...state.customNodes, nodeConfig],
    }));
  },
  // getNodeID: (type) => {
  //   const newIDs = { ...get().nodeIDs };

  //   if (newIDs[type] === undefined) {
  //     newIDs[type] = 0;
  //   }

  //   newIDs[type] += 1;

  //   set({ nodeIDs: newIDs });

  //   return `${type}-${newIDs[type]}`;
  // },
  getNodeID: (type) => {
    set((state) => {
      const newID = (state.nodeIDs[type] || 0) + 1;
      return { nodeIDs: { ...state.nodeIDs, [type]: newID } };
    });
    return `${type}-${get().nodeIDs[type]}`;
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

    const newEdge = {
      id: `${source}-${sourceHandle}-${target}-${targetHandle}`,
      source,
      target,
      sourceHandle,
      targetHandle,
      type: "smoothstep",
      animated: true,
      markerEnd: { type: MarkerType.Arrow, height: "20px", width: "20px" },
    };

    // Check if this edge already exists
    const edgeExists = get().edges.some(
      (edge) =>
        edge.source === source &&
        edge.target === target &&
        edge.sourceHandle === sourceHandle &&
        edge.targetHandle === targetHandle
    );

    if (!edgeExists) {
      set({
        edges: addEdge(newEdge, get().edges),
      });
    }
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
  //  updateEdgeField: (nodeId, fieldName, fieldValue) => {
  //   set({
  //     nodes: get().nodes.map((node) => {
  //       if (node.id === nodeId) {
  //         node.data = { ...node.data, [fieldName]: fieldValue };
  //       }

  //       return node;
  //     }),
  //   });
  // },
}));
