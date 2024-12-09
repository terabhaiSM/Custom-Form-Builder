import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; // Import Axios for API calls

const FormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Access the dynamic ID parameter from the URL
  const [form, setForm] = useState<any>(null); // Form state
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    // Fetch form data from the backend
    const fetchForm = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get(`http://localhost:5001/api/forms/${id}`); // API call
        setForm(response.data); // Set the form data
      } catch (err) {
        console.error("Error fetching form:", err);
        setError("Failed to load form. Please try again.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchForm(); // Call the function
  }, [id]);

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

  // Handle text input change
  const handleTextInputChange = (fieldId: string, value: string) => {
    const updatedFields = form.fields.map((field: any) => {
      if (field.id === fieldId && field.type === "text") {
        return { ...field, value: value };
      }
      return field;
    });
    setForm({ ...form, fields: updatedFields });
  };

  // Handle number input change
  const handleNumberInputChange = (fieldId: string, value: string) => {
    const updatedFields = form.fields.map((field: any) => {
      if (field.id === fieldId && field.type === "number") {
        return { ...field, value: value };
      }
      return field;
    });
    setForm({ ...form, fields: updatedFields });
  };

  // Handle checkbox selection (toggle checked state)
  const handleCheckboxToggle = (fieldId: string, index: number) => {
    const updatedFields = form.fields.map((field: any) => {
      if (field.id === fieldId && field.type === "checkbox") {
        const updatedOptions = [...field.options];
        updatedOptions[index].checked = !updatedOptions[index].checked; // Toggle checked state
        return { ...field, options: updatedOptions };
      }
      return field;
    });
    setForm({ ...form, fields: updatedFields });
  };

  // Handle radio button selection (only one radio button should be selected)
  const handleRadioButtonChange = (fieldId: string, selectedValue: string) => {
    const updatedFields = form.fields.map((field: any) => {
      if (field.id === fieldId && field.type === "radio") {
        const updatedOptions = field.options.map((option: any) => ({
          ...option,
          checked: option.label === selectedValue, // Only check the selected radio button
        }));
        return { ...field, options: updatedOptions };
      }
      return field;
    });
    setForm({ ...form, fields: updatedFields });
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>{error}</div>; // Show error message
  }

  return (
    <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
      <p className="text-lg mb-6">{form.description}</p>

      <div className="space-y-4">
        {form.fields.map((field: any, index: number) => (
          <div key={field.id} className="mb-4">
            <label className="block mb-2">{field.label}</label>

            {/* Render different input types based on field type */}
            {field.type === "text" ? (
              <input
                type="text"
                value={field.value || ""}
                onChange={(e) => handleTextInputChange(field.id, e.target.value)} // Handle text input change
                className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
              />
            ) : field.type === "number" ? (
              <input
                type="number"
                value={field.value || ""}
                onChange={(e) => handleNumberInputChange(field.id, e.target.value)} // Handle number input change
                className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
              />
            ) : field.type === "dropdown" ? (
              <select
                value={field.value || ""}
                onChange={(e) => handleDropdownChange(field.id, e.target.value)} // Handle dropdown value change
                className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
              >
                {field.options.map((option: any, idx: number) => (
                  <option key={idx} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === "checkbox" ? (
              field.options.map((option: any, idx: number) => (
                <div key={idx} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={option.checked}
                    onChange={() => handleCheckboxToggle(field.id, idx)} // Toggle checkbox state
                    className="mr-2"
                  />
                  <label>{option.label}</label>
                </div>
              ))
            ) : field.type === "radio" ? (
              field.options.map((option: any, idx: number) => (
                <div key={idx} className="flex items-center mb-2">
                  <input
                    type="radio"
                    checked={option.checked}
                    onChange={() => handleRadioButtonChange(field.id, option.label)} // Handle radio button change
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