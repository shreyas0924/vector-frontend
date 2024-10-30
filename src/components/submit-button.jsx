import { useState } from "react";
import { useStore } from "../zustand/store";

export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/pipelines/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nodes, edges }),
      });

      const result = await response.json();

      alert(`Pipeline Analysis Results:
        Number of Nodes: ${result.num_nodes}
        Number of Edges: ${result.num_edges}
        Is DAG: ${result.is_dag}`);
    } catch (error) {
      alert("Error analyzing pipeline: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {console.log(nodes)}
      {isLoading ? (
        <div>
          <div className="loader"></div>
          <div className="loader-text">Loading...</div>
        </div>
      ) : null}
      <button onClick={handleSubmit} type="submit" disabled={isLoading}>
        Submit
      </button>
    </div>
  );
};
