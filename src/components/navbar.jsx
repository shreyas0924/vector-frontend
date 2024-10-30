import { useState } from "react";
import { INITIAL_NODES } from "../data/initial-state";
import { DraggableNode } from "../flow/draggable-node";
import { useStore } from "../zustand/store";
import { Position } from "reactflow";

export const PipelineToolbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nodeConfig, setNodeConfig] = useState({
    type: "",
    config: {
      label: "",
      description: "",
      inputFields: [],
      handleValues: [],
    },
  });

  // const nodes = useStore((state) => state.nodes);
  const customNodes = useStore((state) => state.customNodes);
  const addCustomNodes = useStore((state) => state.addCustomNode);

  const [inputFields, setInputFields] = useState([]);
  const [handles, setHandles] = useState([]);

  const handleAddInputField = () => {
    setInputFields([
      ...inputFields,
      { name: "", label: "", type: "text", defaultValue: "" },
    ]);
  };

  const handleAddHandle = () => {
    setHandles([...handles, { id: "", type: "source", position: "Left" }]);
  };

  const handleInputFieldChange = (index, field, value) => {
    const newInputFields = [...inputFields];
    newInputFields[index][field] = value;
    setInputFields(newInputFields);
  };

  const handleHandleChange = (index, field, value) => {
    const newHandles = [...handles];
    newHandles[index][field] = value;
    setHandles(newHandles);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newNode = {
      type: nodeConfig.type,
      config: {
        ...nodeConfig.config,
        inputFields: inputFields,
        handleValues: (id) =>
          handles.map((handle) => ({
            id: `${id}-${handle.id}`,
            type: handle.type,
            position: Position[handle.position],
          })),
        resizable: true,
      },
    };
    addCustomNodes(newNode);
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: "10px" }}>
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "start",
          gap: "10px",
        }}
      >
        {[...INITIAL_NODES, ...customNodes].map((node) => (
          <DraggableNode
            key={node.config.label}
            type={node.type}
            label={node.config.label}
          />
        ))}
        <button onClick={() => setIsModalOpen(true)}>Create a Node</button>
      </div>

      {console.log("Custom NOdes", customNodes)}
      {console.log("Initial NOdes", INITIAL_NODES)}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create Custom Node</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  placeholder="Node Type"
                  value={nodeConfig.type}
                  onChange={(e) =>
                    setNodeConfig({
                      ...nodeConfig,
                      type: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <input
                  placeholder="Label"
                  value={nodeConfig.config.label}
                  onChange={(e) =>
                    setNodeConfig({
                      ...nodeConfig,
                      config: { ...nodeConfig.config, label: e.target.value },
                    })
                  }
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Description"
                  value={nodeConfig.config.description}
                  onChange={(e) =>
                    setNodeConfig({
                      ...nodeConfig,
                      config: {
                        ...nodeConfig.config,
                        description: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div className="form-section">
                <h3>Input Fields</h3>
                {inputFields.map((field, index) => (
                  <div key={index} className="input-field-group">
                    <input
                      placeholder="Field Name"
                      value={field.name}
                      onChange={(e) =>
                        handleInputFieldChange(index, "name", e.target.value)
                      }
                    />
                    <input
                      placeholder="Field Label"
                      value={field.label}
                      onChange={(e) =>
                        handleInputFieldChange(index, "label", e.target.value)
                      }
                    />
                    <select
                      value={field.type}
                      onChange={(e) =>
                        handleInputFieldChange(index, "type", e.target.value)
                      }
                    >
                      <option value="text">Text</option>
                      <option value="textarea">Textarea</option>
                      <option value="select">Select</option>
                    </select>
                  </div>
                ))}
                <button type="button" onClick={handleAddInputField}>
                  Add Input Field
                </button>
              </div>

              <div className="form-section">
                <h3>Handles</h3>
                {handles.map((handle, index) => (
                  <div key={index} className="handle-group">
                    <input
                      placeholder="Handle ID"
                      value={handle.id}
                      onChange={(e) =>
                        handleHandleChange(index, "id", e.target.value)
                      }
                    />
                    <select
                      value={handle.type}
                      onChange={(e) =>
                        handleHandleChange(index, "type", e.target.value)
                      }
                    >
                      <option value="source">Source</option>
                      <option value="target">Target</option>
                    </select>
                    <select
                      value={handle.position}
                      onChange={(e) =>
                        handleHandleChange(index, "position", e.target.value)
                      }
                    >
                      <option value="Left">Left</option>
                      <option value="Right">Right</option>
                      <option value="Top">Top</option>
                      <option value="Bottom">Bottom</option>
                    </select>
                  </div>
                ))}
                <button type="button" onClick={handleAddHandle}>
                  Add Handle
                </button>
              </div>

              <div className="form-actions">
                <button type="submit">Create Node</button>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
