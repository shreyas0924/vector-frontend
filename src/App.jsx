import { PipelineToolbar } from "./components/navbar";
import { PipelineUI } from "./ui/pipeline-ui";
import { SubmitButton } from "./components/submit-button";

function App() {
  return (
    <div>
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
    </div>
  );
}

export default App;
