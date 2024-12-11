import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader/Loader";
import { useNavigate } from "react-router-dom";

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
  const [formData, setFormData] = useState<FormData | null>({
    formTitle: "",
    formDescription: "",
    submissions: [],
  }); // Form data state
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch submissions for the form
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/forms/${id}/submissions`,
          { validateStatus: (status) => status < 500 }
        );
        setFormData(response.data);
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError("Failed to fetch submissions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [id]);

  const exportToCSV = () => {
    if (!formData || formData.submissions.length === 0) {
      alert("No submissions available to export.");
      return;
    }
  
    // Define CSV headers
    const csvHeaders = ["Submission ID", "Submitted At", "Question", "Answer", "Type"];
    
    // Generate CSV rows
    const csvRows = formData.submissions.flatMap((submission) =>
      submission.responses.map((response) => {
        const formattedDate = new Date(submission.submittedAt).toLocaleString();
        return `"${submission.submissionId}","${formattedDate}","${response.question}","${response.answer}","${response.type}"`;
      })
    );
  
    // Combine headers and rows
    const csvContent = [csvHeaders.join(","), ...csvRows].join("\n");
  
    // Create a downloadable CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${formData.formTitle}_submissions.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="text-center text-lg mt-10 text-red-500">{error}</div>
    );

  return (
    <>
      <button
        onClick={() => {
          navigate("/home");
        }}
        className="bg-blue-500 mt-4 ml-10 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        &lt;
      </button>
      <div className="max-w-7xl mx-auto bg-gray-100 shadow rounded-lg p-8 mt-4">
        {/* Form Title and Description */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {formData?.formTitle}
          </h1>
          <p className="text-lg text-gray-600">{formData?.formDescription}</p>
        </header>

        <div className="flex justify-end mb-4">
          <button
            onClick={exportToCSV}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Export to CSV
          </button>
        </div>

        {/* Submissions Section */}
        {formData != null && formData?.submissions.length === 0 ? (
          <p className="text-center text-gray-600">
            No submissions found for this form.
          </p>
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
                              ?.filter(
                                (option) => option.label === response.answer
                              )
                              .map((option, i) => (
                                <li
                                  key={i}
                                  className="font-bold text-black-900"
                                >
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
    </>
  );
};

export default FormSubmissionsPage;