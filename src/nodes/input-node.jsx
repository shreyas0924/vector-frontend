// inputNode.js

import { Position } from "reactflow";
import { BaseNode } from "../components/base-node";

export const InputNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      label="Input"
      inputFields={[
        {
          name: "inputName",
          label: "Name",
          type: "text",
          defaultValue: id.replace("customInput-", "input_"),
        },
        {
          name: "inputType",
          label: "Type",
          type: "select",
          defaultValue: "Text",
          options: ["Text", "File"],
        },
      ]}
      handleValues={[
        { id: `${id}-value`, type: "source", position: Position.Left },
      ]}
      
    />
  );
};
