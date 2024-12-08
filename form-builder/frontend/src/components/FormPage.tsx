import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const FormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Access the dynamic ID parameter from the URL
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    // Fetch form data by ID from localStorage or backend
    const storedForm = JSON.parse(localStorage.getItem(id || "") || "{}");
    setForm(storedForm);
  }, [id]);

  // Ensure that the form data is loaded
  if (!form) return <div>Loading...</div>;

  // Handle the change in selected dropdown value
  const handleDropdownChange = (fieldId: string, selectedValue: string) => {
    const updatedFields = form.fields.map((field: any) => {
      if (field.id === fieldId && field.type === "dropdown") {
        return {
          ...field,
          value: selectedValue, // Update the selected value of the dropdown
        };
      }
      return field;
    });
    setForm({ ...form, fields: updatedFields });
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
      <p className="text-lg mb-6">{form.description}</p>

      <div className="space-y-4">
        {form.fields.map((field: any, index: number) => (
          <div key={field.id} className="mb-4">
            <label className="block mb-2">{field.label}</label>

            {/* Render different input types based on field type */}
            {field.type === "text" || field.type === "number" ? (
              <input
                type={field.type}
                value={field.value || ""}
                readOnly
                className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
              />
            ) : field.type === "dropdown" ? (
              <select
                value={field.value || ""}
                onChange={(e) => handleDropdownChange(field.id, e.target.value)} // Handle the change in dropdown
                className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
              >
                {field.options.map((option: any, idx: number) => (
                  <option key={idx} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === "checkbox" || field.type === "radio" ? (
              field.options.map((option: any, idx: number) => (
                <div key={idx} className="flex items-center mb-2">
                  <input
                    type={field.type === "checkbox" ? "checkbox" : "radio"}
                    checked={option.checked}
                    disabled
                    className="mr-2"
                  />
                  <label>{option.label}</label>
                </div>
              ))
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormPage;