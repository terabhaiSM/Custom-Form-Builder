import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ShareFormPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>(); // Access the form UUID from the URL
  const [form, setForm] = useState<any>(null); // Form state
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    // Fetch form data by UUID from the backend
    const fetchForm = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get(`http://localhost:5001/api/forms/share/${uuid}`); // API call
        setForm(response.data); // Set the form data
      } catch (err) {
        console.error("Error fetching form by UUID:", err);
        setError("Failed to load form. Please try again.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchForm();
  }, [uuid]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
      <p className="text-lg mb-6">{form.description}</p>

      <div className="space-y-4">
        {form.fields.map((field: any, index: number) => (
          <div key={field.id} className="mb-4">
            <label className="block mb-2">{field.label}</label>

            {/* Render different input types based on field type */}
            {field.type === "text" && (
              <input
                type="text"
                className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
                placeholder={field.label}
              />
            )}
            {field.type === "number" && (
              <input
                type="number"
                className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
                placeholder={field.label}
              />
            )}
            {field.type === "dropdown" && (
              <select className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none">
                {field.options.map((option: any, idx: number) => (
                  <option key={idx} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            {field.type === "checkbox" &&
              field.options.map((option: any, idx: number) => (
                <div key={idx} className="flex items-center mb-2">
                  <input type="checkbox" className="mr-2" />
                  <label>{option.label}</label>
                </div>
              ))}
            {field.type === "radio" &&
              field.options.map((option: any, idx: number) => (
                <div key={idx} className="flex items-center mb-2">
                  <input type="radio" name={`radio-${field.id}`} className="mr-2" />
                  <label>{option.label}</label>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShareFormPage;