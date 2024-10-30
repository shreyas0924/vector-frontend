import { Position } from "reactflow";

export const INITIAL_NODES = [
  {
    type: "customInput",
    config: {
      label: "Input",
      inputFields: [
        {
          name: "inputName",
          label: "Name",
          type: "text",
          defaultValue: (id) => id.replace("customInput-", "input_"),
        },
        {
          name: "inputType",
          label: "Type",
          type: "select",
          defaultValue: "Text",
          options: ["Text", "File"],
        },
      ],

      handleValues: (id) => [
        { id: `${id}-value`, type: "source", position: Position.Left },
      ],
      resizable: true,
    },
  },

  {
    type: "customOutput",
    config: {
      label: "Output",
      inputFields: [
        {
          name: "outputName",
          label: "Name",
          type: "text",
          defaultValue: (id) => id.replace("customOutput-", "output_"),
        },
        {
          name: "outputType",
          label: "Type",
          type: "select",
          defaultValue: "Text",
          options: ["Text", "File"],
        },
      ],
      handleValues: (id) => [
        {
          id: `${id}-value`,
          type: "target",
          position: Position.Left,
        },
      ],
      resizable: true,
    },
  },
  {
    type: "llm",
    config: {
      label: "LLM",
      description: "This is an LLM",
      handleValues: (id) => [
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
      ],
      resizable: false,
    },
  },
  {
    type: "text",
    config: {
      label: "Text",
      inputFields: [
        {
          name: "content",
          label: "Content",
          type: "textarea",
          defaultValue: "{{input}}",
        },
      ],
      handleValues: (id, variables = []) => [
        { id: `${id}-input`, type: "target", position: Position.Top },
        { id: `${id}-output`, type: "source", position: Position.Bottom },
        ...variables.map((varName) => ({
          id: `${id}-${varName}`,
          type: "target",
          position: Position.Left,
        })),
      ],
      resizable: true,
    },
  },
];
