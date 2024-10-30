import { INITIAL_NODES, nodeConfigs } from "../data/initial-state";

import { DraggableNode } from "../flow/draggable-node";

export const PipelineToolbar = () => {
  return (
    <div style={{ padding: "10px" }}>
      <div
        style={{
          marginTop: "20px",

          display: "flex",

          flexWrap: "wrap",

          gap: "10px",
        }}
      >
        {/* <DraggableNode type="customInput" label="Input" />
<DraggableNode type="llm" label="LLM" />
<DraggableNode type="customOutput" label="Output" />
<DraggableNode type="text" label="Text" /> */}

        {INITIAL_NODES.map((node) => (
          <DraggableNode
            key={node.type}
            type={node.type}
            label={node.config.label}
          />
        ))}
      </div>
    </div>
  );
};
