// // outputNode.js

// import { Position } from "reactflow";
// import { BaseNode } from "../components/base-node";

// export const OutputNode = ({ id, data }) => {
//   return (
//     <BaseNode
//       id={id}
//       data={data}
//       label="Output"
//       inputFields={[
//         {
//           name: "outputName",
//           label: "Name",
//           type: "text",
//           defaultValue: id.replace("customOutput-", "output_"),
//         },
//         {
//           name: "outputType",
//           label: "Type",
//           type: "select",
//           defaultValue: "Text",
//           options: ["Text", "File"],
//         },
//       ]}
//       handleValues={[
//         {
//           id: `${id}-value`,
//           type: "target",
//           position: Position.Left,
//         },
//       ]}
//     />
//   );
// };
