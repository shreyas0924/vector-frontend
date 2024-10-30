import { useState } from "react";
import { Handle, NodeResizeControl, NodeResizer } from "reactflow";

function ResizeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="#ff0071"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ position: "absolute", right: 5, bottom: 5 }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="16 20 20 20 20 16" />
      <line x1="14" y1="14" x2="20" y2="20" />
      <polyline points="8 4 4 4 4 8" />
      <line x1="4" y1="4" x2="10" y2="10" />
    </svg>
  );
}

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

  const controlStyle = {
    background: "transparent",
    border: "none",
  };

  return (
    <div className="rounded-lg p-6 border-[3px] border-[#A7AAD5] shadow-xl text-gray-800 w-full resizable-node">
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
                className="w-full min-h-full mt-1 rounded-lg p-2 -mx-1 bg-transparent border border-gray-300 resize-none"
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
      {resizable && <NodeResizer minWidth={100} minHeight={30} isVisible={false} />}
    </div>
  );
};
