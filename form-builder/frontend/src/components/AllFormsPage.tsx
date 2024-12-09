import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AllFormsPage: React.FC = () => {
  const [forms, setForms] = useState<any[]>([]); // State to hold all forms
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all forms
    const fetchForms = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5001/api/forms");
        setForms(response.data);
      } catch (err) {
        console.error("Error fetching forms:", err);
        setError("Failed to load forms. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Forms</h1>
        <button
          onClick={() => navigate("/forms")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Create New Form
        </button>
      </div>

      {forms.length === 0 ? (
        <p>No forms have been created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map((form) => (
            <div key={form.id} className="p-4 border rounded shadow hover:shadow-lg transition">
              <h2 className="text-lg font-semibold mb-2">{form.title}</h2>
              <p className="text-gray-600 mb-4">{form.description}</p>
              <div className="flex justify-between">
                <button
                  onClick={() => navigate(`/form/${form.id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Open Form
                </button>
                <button
                  onClick={() => navigate(`/form/${form.id}/submissions`)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  View Submissions
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllFormsPage;