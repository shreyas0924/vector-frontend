// submit.js

import { useStore } from "../zustand/store";

export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes);
  
  const handleSubmit = () => {
    console.log("All nodes:", nodes);
    nodes.forEach((node, index) => {
      console.log(`Node ${index}:`, node);
    });
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      {console.log(nodes)}
      <button 
        onClick={handleSubmit}
        type="submit"
      >
        Submit
      </button>
    </div>
  );
};
