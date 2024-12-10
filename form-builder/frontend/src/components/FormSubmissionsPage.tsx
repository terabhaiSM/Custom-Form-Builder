import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Response {
  question: string;
  type: string;
  options: { label: string; checked: boolean }[] | null;
  answer: string;
}

interface Submission {
  submissionId: string;
  submittedAt: string;
  responses: Response[];
}

interface FormData {
  formTitle: string;
  formDescription: string;
  submissions: Submission[];
}

const FormSubmissionsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Form ID from URL
  const [formData, setFormData] = useState<FormData | null>(null); // Form data state
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    // Fetch submissions for the form
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5001/api/forms/${id}/submissions`,
          { validateStatus: (status) => status < 500 }
        );
        if (response.status === 404) {
          setFormData(null);
        } else {
          setFormData(response.data);
        }
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError("Failed to fetch submissions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [id]);

  if (loading) return <div className="text-center text-lg mt-10">Loading...</div>;
  if (error) return <div className="text-center text-lg mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto bg-gray-100 shadow rounded-lg p-8 mt-12">
      {/* Form Title and Description */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{formData?.formTitle}</h1>
        <p className="text-lg text-gray-600">{formData?.formDescription}</p>
      </header>

      {/* Submissions Section */}
      {formData?.submissions.length === 0 ? (
        <p className="text-center text-gray-600">No submissions found for this form.</p>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Submissions ({formData.submissions.length})
          </h2>
          <div className="space-y-6">
            {formData.submissions.map((submission, index) => (
              <div
                key={submission.submissionId}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Submission #{index + 1}
                  </h3>
                  <span className="text-gray-500 text-sm">
                    {new Date(submission.submittedAt).toLocaleString()}
                  </span>
                </div>
                <div className="space-y-4">
                  {submission.responses.map((response, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded border">
                      <h4 className="font-medium text-gray-700 mb-2">
                        {response.question}
                      </h4>
                      {response.type === "checkbox" ||
                      response.type === "radio" ? (
                        <ul className="list-disc list-inside text-gray-600">
                          {response.options
                          ?.filter((option) => option.label === response.answer)
                          .map((option, i) => (
                            <li key={i} className="font-bold text-black-900">
                            {option.label}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600">{response.answer}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FormSubmissionsPage;