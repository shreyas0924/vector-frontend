// // textNode.js

// import { Position } from "reactflow";
// import { BaseNode } from "../components/base-node";

// export const TextNode = ({ id, data }) => {
//   return (
//     <BaseNode
//       id={id}
//       data={data}
//       label="Text"
//       inputFields={[
//         {
//           name: "text",
//           label: "Text",
//           type: "textarea",
//           defaultValue: "{{input}}",
//         },
//       ]}
//       handleValues={[
//         {
//           id: `${id}-output`,
//           type: "source",
//           position: Position.Right,
//         },
//       ]}
//       resizable={true}
//     />
//   );
// };
