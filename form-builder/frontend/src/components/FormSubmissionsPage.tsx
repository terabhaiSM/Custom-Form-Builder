import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const FormSubmissionsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Form ID from URL
  const [submissions, setSubmissions] = useState<any[]>([]); // Submissions state
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    // Fetch submissions for the form
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5001/api/forms/${id}/submissions`);
        setSubmissions(response.data);
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError("Failed to fetch submissions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Submissions for Form</h1>

      {submissions.length === 0 ? (
        <p>No submissions found for this form.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Submitted At</th>
                <th className="px-4 py-2 border">Responses</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border text-center">{index + 1}</td>
                  <td className="px-4 py-2 border text-center">
                    {new Date(submission.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">
                    {Object.entries(submission.responses).map(([field, response], idx) => (
                      <div key={idx} className="mb-2">
                        <strong>{field}:</strong> {JSON.stringify(response)}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FormSubmissionsPage;