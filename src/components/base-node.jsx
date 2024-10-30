// import { useState } from "react";

// import { Handle, NodeResizeControl, NodeResizer } from "reactflow";

// export const BaseNode = ({

//   id,

//   data,

//   label,

//   handleValues,

//   inputFields,

//   description,

//   resizable,

// }) => {

//   const [fieldValues, setFieldValues] = useState(

//     inputFields?.reduce(

//       (acc, field) => ({

//         ...acc,

//         [field.name]: data?.[field.name] || field.defaultValue,

//       }),

//       {}

//     )

//   );

//   const handleInputChange = (name, value) => {

//     setFieldValues((prev) => ({ ...prev, [name]: value }));

//   };

//   return (

//     <div className="rounded-lg p-6 border-[3px] border-[#A7AAD5] shadow-xl text-gray-800 max-w-[350px] resizable-node">

//       <div className="flex flex-col gap-2 border-b border-[#5E3A9D] pb-4 mb-4">

//         <span className="text-lg font-semibold">{label}</span>

//         <span className="text-sm text-gray-800">{description}</span>

//       </div>

//       <div className="flex flex-col gap-4">

//         {inputFields?.map((field) => (

//           <div key={field.name} className="flex flex-col gap-y-1 w-full">

//             <label className="text-sm">{field.label}:</label>

//             {field.type === "select" ? (

//               <select

//                 className="w-full mt-1 rounded-lg p-2 -mx-1 bg-transparent border border-gray-300"

//                 value={fieldValues[field.name]}

//                 onChange={(e) => handleInputChange(field.name, e.target.value)}

//               >

//                 {field.options.map((option) => (

//                   <option key={option} value={option}>

//                     {option}

//                   </option>

//                 ))}

//               </select>

//             ) : field.type === "textarea" ? (

//               <textarea

//                 className="min-w-[80%] mt-1 rounded-lg p-2 -mx-1 bg-transparent border border-gray-300 resize-none"

//                 rows={Math.max(2, fieldValues[field.name].split("\n").length)}

//                 style={{

//                   minWidth: "200px",

//                   maxWidth: "350px",

//                   width: `${Math.min(

//                     300,

//                     fieldValues[field.name].length * 4

//                   )}px`,

//                 }}

//                 value={fieldValues[field.name]}

//                 onChange={(e) => handleInputChange(field.name, e.target.value)}

//               />

//             ) : (

//               <input

//                 type={field.type}

//                 className="w-full h-full mt-1 rounded-lg p-2 -mx-1 bg-transparent border border-gray-300"

//                 value={fieldValues[field.name]}

//                 onChange={(e) => handleInputChange(field.name, e.target.value)}

//               />

//             )}

//           </div>

//         ))}

//       </div>

//       {handleValues?.map((value) => (

//         <Handle

//           key={value.id}

//           id={`${id}-${value.id}`}

//           type={value.type}

//           position={value.position}

//           style={{

//             background: "#ffffff",

//             border: "2px solid #6B48CC",

//             width: 12,

//             height: 12,

//             borderRadius: "50%",

//             ...value.style,

//           }}

//         />

//       ))}

//       {resizable && (

//         <NodeResizer minWidth={100} minHeight={30} isVisible={false} />

//       )}

//     </div>

//   );

// };

import { useState, useEffect } from "react";

import { Handle, NodeResizer, Position } from "reactflow";

export const BaseNode = ({
  id,

  data,

  label,

  handleValues,

  inputFields,

  description,

  resizable,
}) => {
  const [fieldValues, setFieldValues] = useState(
    inputFields?.reduce(
      (acc, field) => ({
        ...acc,

        [field.name]: data?.[field.name] || field.defaultValue,
      }),

      {}
    )
  );

  const [dynamicHandles, setDynamicHandles] = useState([]);

  // Function to extract variables from text content

  const extractVariables = (content) => {
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

    const variables = new Set();

    let match;

    while ((match = regex.exec(content)) !== null) {
      variables.add(match[1]);
    }

    return Array.from(variables);
  };

  // Update dynamic handles when text content changes

  useEffect(() => {
    if (inputFields?.some((field) => field.type === "textarea")) {
      const textContent = fieldValues["content"] || "";

      const variables = extractVariables(textContent);

      const newHandles = variables.map((variable, index) => ({
        id: `${id}-${variable}`,

        type: "source",

        position: Position.Left,

        style: {
          top: `${((index + 1) * 100) / (variables.length + 1)}%`,

          background: "#ffffff",

          border: "2px solid #6B48CC",

          width: 12,

          height: 12,

          borderRadius: "50%",
        },
      }));

      setDynamicHandles(newHandles);
    }
  }, [fieldValues["content"], inputFields, id]);

  const handleInputChange = (name, value) => {
    setFieldValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="rounded-lg p-6 border-[3px] border-[#A7AAD5] shadow-xl text-gray-800 max-w-[350px] relative">
      <div className="flex flex-col gap-2 border-b border-[#5E3A9D] pb-4 mb-4">
        <span className="text-lg font-semibold">{label}</span>
        <span className="text-sm text-gray-800">{description}</span>
      </div>

      <div className="flex flex-col gap-4">
        {inputFields?.map((field) => (
          <div key={field.name} className="flex flex-col gap-y-1 w-full">
            <label className="text-sm">{field.label}:</label>

            {field.type === "select" ? (
              <select
                className="w-full mt-1 rounded-lg p-2 -mx-1 bg-transparent border border-gray-300"
                value={fieldValues[field.name]}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
              >
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                className="min-w-[80%] mt-1 rounded-lg p-2 -mx-1 bg-transparent border border-gray-300 resize-none"
                rows={Math.max(
                  2,

                  (fieldValues[field.name] || "").split("\n").length
                )}
                style={{
                  minWidth: "200px",

                  maxWidth: "350px",

                  width: `${Math.min(
                    300,

                    (fieldValues[field.name] || "").length * 4
                  )}px`,
                }}
                value={fieldValues[field.name]}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
              />
            ) : (
              <input
                type={field.type}
                className="w-full h-full mt-1 rounded-lg p-2 -mx-1 bg-transparent border border-gray-300"
                value={fieldValues[field.name]}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Static handles from props */}

      {handleValues?.map((value) => (
        <Handle
          key={value.id}
          id={`${id}-${value.id}`}
          type={value.type}
          position={value.position}
          style={{
            background: "#ffffff",

            border: "2px solid #6B48CC",

            width: 12,

            height: 12,

            borderRadius: "50%",

            ...value.style,
          }}
        />
      ))}

      {/* Dynamic handles from variables */}

      {dynamicHandles.map((handle) => (
        <Handle
          key={handle.id}
          id={handle.id}
          type={handle.type}
          position={handle.position}
          style={{
            background: "#ffffff",

            border: "2px solid #6B48CC",

            width: 12,

            height: 12,

            borderRadius: "50%",

            ...handle.style,
          }}
        />
      ))}

      {resizable && (
        <NodeResizer minWidth={100} minHeight={30} isVisible={false} />
      )}
    </div>
  );
};

export default BaseNode;
