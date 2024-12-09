import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FormBuilderPage from "./components/FormBuilderPage";
import FormPage from "./components/FormPage";
import ShareFormPage from "./components/ShareFormPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Route for the form builder page */}
        <Route path="/" element={<FormBuilderPage />} />

        {/* Correct dynamic route for displaying form */}
        <Route path="/form/:id" element={<FormPage />} />
        <Route path="/share/:uuid" element={<ShareFormPage />} />
      </Routes>
    </Router>
  );
};

export default App;