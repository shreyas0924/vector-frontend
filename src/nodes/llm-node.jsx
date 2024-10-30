// llmNode.js

import { Position } from "reactflow";
import { BaseNode } from "../components/base-node";

export const LLMNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      description={"This is an LLM"}
      label="LLM"
      handleValues={[
        {
          id: `${id}-value`,
          type: "target",
          position: Position.Left,
          style: { top: `${300 / 3}%` },
        },
        {
          id: `${id}-prompt`,
          type: "target",
          position: Position.Left,
          style: { top: `${200 / 3}%` },
        },
        {
          id: `${id}-response`,
          type: "source",
          position: Position.Right,
          style: { top: `${200 / 3}%` },
        },
      ]}
    />
  );
};
