import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader/Loader";

const ShareFormPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [form, setForm] = useState<any>(null);
  const [responses, setResponses] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/forms/share/${uuid}`
        );
        setForm(response.data);
      } catch (err) {
        setError("Failed to load form. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [uuid]);

  const handleInputChange = (fieldId: string, value: any) => {
    setResponses({ ...responses, [fieldId]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/forms/${form.id}/submissions`,
        { responses }
      );
      alert("Form submitted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    }
  };

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
      <p className="text-lg mb-6">{form.description}</p>

      <div className="space-y-4">
        {form.fields.map((field: any) => (
          <div key={field.id} className="mb-4">
            <label className="block mb-2">{field.label}</label>

            {field.type === "text" && (
              <input
                type="text"
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
              />
            )}
            {field.type === "number" && (
              <input
                type="number"
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
              />
            )}
            {field.type === "dropdown" && (
              <select
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
              >
                <option value="" disabled selected>
                  Select your option
                </option>
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
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleInputChange(field.id, {
                        ...responses[field.id],
                        [option.label]: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <label>{option.label}</label>
                </div>
              ))}
            {field.type === "radio" &&
              field.options.map((option: any, idx: number) => (
                <div key={idx} className="flex items-center mb-2">
                  <input
                    type="radio"
                    name={field.id}
                    onChange={() => handleInputChange(field.id, option.label)}
                    className="mr-2"
                  />
                  <label>{option.label}</label>
                </div>
              ))}
            {field.type === "date" && (
              <input
                type="date"
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
              />
            )}
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
      >
        Submit
      </button>
    </div>
  );
};

export default ShareFormPage;
