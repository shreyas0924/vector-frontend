import { useState } from "react";
import { Handle, NodeResizer } from "reactflow";

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

  const handleInputChange = (name, value) => {
    setFieldValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="rounded-lg p-6 border-[2px] border-[#A7AAD5] shadow-xl text-gray-800 w-full resizable-node">
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
                className="w-full mt-1 rounded-lg p-2 -mx-1 bg-transparent border border-gray-300 resize-none"
                rows={Math.max(2, fieldValues[field.name].split("\n").length)}
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
      {resizable && <NodeResizer minWidth={100} minHeight={30} />}
    </div>
  );
};
