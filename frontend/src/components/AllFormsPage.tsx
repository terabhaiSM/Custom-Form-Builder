import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HiOutlineClipboardCopy, HiPencilAlt, HiTrash } from "react-icons/hi"; // Import Trash Icon from React Icons
import Loader from "./Loader/Loader";

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
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/forms`, {
                    validateStatus: (status) => status < 500,
                });
                console.log(response.data);
                if (response.status === 404) {
                    setForms([]);
                } else {
                    setForms(response.data);
                }
            } catch (err) {
                console.error("Error fetching forms:", err);
                setError("Failed to load forms. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchForms();
    }, []);

    if (loading) return <Loader />; // Show loader while fetching forms
    if (error) return <div>{error}</div>;

    // Function to copy the shareable link to clipboard
    const handleCopyLink = (uuid: string) => {
        const shareableLink = `${process.env.REACT_APP_BASE_URL}/share/${uuid}`;
        navigator.clipboard
            .writeText(shareableLink)
            .then(() => alert("Shareable link copied to clipboard!"))
            .catch((err) => alert("Failed to copy link!"));
    };

    // Function to delete a form
    const handleDeleteForm = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this form?")) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/forms/${id}`);
                setForms(forms.filter((form) => form.id !== id));
                alert("Form deleted successfully!");
            } catch (err) {
                console.error("Error deleting form:", err);
                alert("Failed to delete form. Please try again.");
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto bg-white shadow rounded-lg p-6 mt-12">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">All Forms</h1>
                <button
                    onClick={() => navigate("/forms")}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Create New Form
                </button>
            </div>

            {forms.length === 0 ? (
                <p>No forms have been created yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {forms.map((form) => (
                        <div
                            key={form.id}
                            className="p-6 border rounded-lg shadow-lg hover:shadow-xl transition-all bg-white"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center space-x-2">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        {form.title}
                                    </h2>
                                    <button
                                        onClick={() => handleCopyLink(form.uuid)}
                                        className="text-gray-500 hover:text-gray-700 p-2 rounded-full"
                                        title="Copy shareable link"
                                    >
                                        <HiOutlineClipboardCopy size={20} />
                                    </button>
                                    <button
                                        onClick={() => navigate(`/forms/edit/${form.id}`)} // Navigate to the edit page
                                        className="text-gray-500 hover:text-gray-700 p-2 rounded-full"
                                        title="Edit form"
                                    >
                                        <HiPencilAlt size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteForm(form.id)} // Delete form
                                        className="text-gray-500 hover:text-gray-700 p-2 rounded-full"
                                        title="Delete form"
                                    >
                                        <HiTrash size={20} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">{form.description}</p>
                            <div className="flex justify-between space-x-2">
                                <button
                                    onClick={() => navigate(`/form/${form.id}`)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 flex-1"
                                >
                                    Open Form
                                </button>
                                <button
                                    onClick={() => navigate(`/form/${form.id}/submissions`)}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 flex-1"
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
