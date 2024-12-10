import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FormBuilderPage from "./components/FormBuilderPage";
import FormPage from "./components/FormPage";
import ShareFormPage from "./components/ShareFormPage";
import FormSubmissionsPage from "./components/FormSubmissionsPage";
import AllFormsPage from "./components/AllFormsPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Route for the form builder page */}
        <Route path="/" element={<AllFormsPage />} />
        <Route path="/forms" element={<FormBuilderPage />} />
        <Route path="/forms/edit/:id" element={<FormBuilderPage />} />

        {/* Correct dynamic route for displaying form */}
        <Route path="/form/:id" element={<FormPage />} />
        <Route path="/share/:uuid" element={<ShareFormPage />} />
        <Route path="/form/:id/submissions" element={<FormSubmissionsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
