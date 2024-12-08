import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import FormBuilderPage from "./components/FormBuilderPage";

const App = () => (
  <DndProvider backend={HTML5Backend}>
    <FormBuilderPage />
  </DndProvider>
);

export default App;