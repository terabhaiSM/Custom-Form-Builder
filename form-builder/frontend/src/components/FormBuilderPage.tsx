import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DropdownCard from "../ui/DropdownCard";
import CheckboxCard from "../ui/CheckboxCard";
import TextInputCard from "../ui/TextInputCard";
import NumberInputCard from "../ui/NumberInputCard";
import RadioButtonCard from "../ui/RadioButtonCard";
import { Field } from "../types"; // Import the Field type
import axios from "axios";
import DateInputCard from "../ui/DateInputCard";

const ItemType = "FIELD"; // Define a constant for item type

const FieldCard: React.FC<{
  field: Field;
  index: number;
  moveField: (dragIndex: number, hoverIndex: number) => void;
  updateField: (id: string, updatedField: Partial<Field>) => void;
  removeField: (id: string) => void;
  handleAddOption: (fieldId: string) => void;
  handleOptionChange: (fieldId: string, index: number, value: string) => void;
  handleOptionToggle: (fieldId: string, index: number) => void;
}> = ({
  field,
  index,
  moveField,
  updateField,
  removeField,
  handleAddOption,
  handleOptionChange,
  handleOptionToggle,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item: { index: number }) => {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveField(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`p-4 rounded-lg shadow-lg bg-white transition-transform transform ${
        isDragging ? "opacity-50" : ""
      }`}
      style={{ marginBottom: "8px", cursor: "move" }}
    >
      {/* Render the respective card based on field type */}
      {field.type === "dropdown" ? (
        <DropdownCard
          field={field}
          updateField={updateField}
          removeField={removeField}
          handleAddOption={handleAddOption}
          handleOptionChange={handleOptionChange}
        />
      ) : field.type === "checkbox" ? (
        <CheckboxCard
          field={field}
          updateField={updateField}
          removeField={removeField}
          handleAddOption={handleAddOption}
          handleOptionChange={handleOptionChange}
          handleOptionToggle={handleOptionToggle}
        />
      ) : field.type === "text" ? (
        <TextInputCard field={field} updateField={updateField} removeField={removeField} />
      ) : field.type === "number" ? (
        <NumberInputCard field={field} updateField={updateField} removeField={removeField} />
      ) : field.type === "radio" ? (
        <RadioButtonCard
          field={field}
          updateField={updateField}
          removeField={removeField}
          handleAddOption={handleAddOption}
          handleOptionChange={handleOptionChange}
          handleOptionToggle={handleOptionToggle}
        />
      ) : field.type === "date" ? (
        <DateInputCard field={field} updateField={updateField} removeField={removeField} />
      ) : null}
    </div>
  );
};

const FormBuilderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Retrieve ID for editing
  const [form, setForm] = useState({
    title: "",
    description: "",
    fields: [] as Field[],
  });
 const [loading, setLoading] = useState(true);
 const [availableFields] = useState([
  { id: "dropdown", type: "dropdown", label: "Dropdown", options: [] },
  { id: "checkbox", type: "checkbox", label: "Checkbox", options: [{ label: "Option 1", checked: false }, { label: "Option 2", checked: false }] },
  { id: "text", type: "text", label: "Text Input", value: "" },
  { id: "number", type: "number", label: "Number Input", value: "" },
  { id: "radio", type: "radio", label: "Radio Button", options: [{ label: "Option 1", checked: false }, { label: "Option 2", checked: false }] },
  { id: "date", type: "date", label: "Date", value: "" }, // Add the date field here
]);// Available fields in the left panel
  const navigate = useNavigate();

  // Fetch existing form if editing
  useEffect(() => {
    const fetchForm = async () => {
      if (!id) {
        setLoading(false);
        return; // No ID, it's a new form creation
      }

      try {
        const response = await axios.get(`http://localhost:5001/api/forms/${id}`);
        const formData = response.data;
        setForm({
          title: formData.title,
          description: formData.description,
          fields: formData.fields.map((field: any) => ({
            ...field,
            options: field.options || [], // Ensure options exist
          })),
        });
      } catch (error) {
        console.error("Error fetching form:", error);
        alert("Failed to fetch form for editing.");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  // Handle form saving (Create or Update)
  const saveForm = async () => {
    try {
      if (id) {
        // Update existing form
        await axios.put(`http://localhost:5001/api/forms/${id}`, form);
        alert("Form updated successfully!");
        navigate(`/form/${id}`);
      } else {
        // Create a new form
        const response = await axios.post("http://localhost:5001/api/forms", form);
        const newFormId = response.data.id;
        alert(`Form created successfully!`);
        navigate(`/form/${newFormId}`);
      }
    } catch (error) {
      console.error("Error saving form:", error);
      alert("Failed to save form. Please try again.");
    }
  };

  const addField = (type: "dropdown" | "checkbox" | "text" | "number" | "radio") => {
    const newField: Field = {
      id: Date.now().toString(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      options: type === "dropdown" 
        ? [{ label: "Option 1", checked: false }]
        : type === "checkbox" || type === "radio"
        ? [{ label: "Option 1", checked: false }, { label: "Option 2", checked: false }]
        : undefined,
      value: type === "text" || type === "number" ? "" : undefined,
    };
    setForm((prevForm) => ({
      ...prevForm,
      fields: [...prevForm.fields, newField],
    }));
  };

  const moveField = (dragIndex: number, hoverIndex: number) => {
    const reorderedFields = [...form.fields];
    const [movedField] = reorderedFields.splice(dragIndex, 1);
    reorderedFields.splice(hoverIndex, 0, movedField);
    setForm((prevForm) => ({
      ...prevForm,
      fields: reorderedFields,
    }));
  };

  const updateField = (id: string, updatedField: Partial<Field>) => {
    setForm((prevForm) => ({
      ...prevForm,
      fields: prevForm.fields.map((field) => (field.id === id ? { ...field, ...updatedField } : field)),
    }));
  };

  const handleAddOption = (fieldId: string) => {
    const updatedFields = form.fields.map((field) => {
      if (field.id === fieldId && "options" in field) {
        return {
          ...field,
          options: [
            ...field.options,
            { label: `Option ${field.options.length + 1}`, checked: false },
          ],
        };
      }
      return field;
    });
    setForm((prevForm) => ({
      ...prevForm,
      fields: updatedFields,
    }));
  };

  const handleOptionChange = (fieldId: string, index: number, value: string) => {
    const updatedFields = form.fields.map((field) => {
      if (field.id === fieldId && "options" in field) {
        const updatedOptions = [...field.options];
        updatedOptions[index].label = value;
        return { ...field, options: updatedOptions };
      }
      return field;
    });
    setForm((prevForm) => ({
      ...prevForm,
      fields: updatedFields,
    }));
  };

  const handleOptionToggle = (fieldId: string, index: number) => {
    const updatedFields = form.fields.map((field) => {
      if (field.id === fieldId && "options" in field) {
        const updatedOptions = [...field.options];
        updatedOptions[index].checked = !updatedOptions[index].checked;
        return { ...field, options: updatedOptions };
      }
      return field;
    });
    setForm((prevForm) => ({
      ...prevForm,
      fields: updatedFields,
    }));
  };

  const removeField = (id: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      fields: prevForm.fields.filter((field) => field.id !== id),
    }));
  };
  // Handle form creation and redirect
  // const createForm = () => {
  //   const newFormId = Date.now().toString();
  //   // Store the form in localStorage
  //   const newForm = { ...form, id: newFormId };
  //   console.log(newForm);
  //   localStorage.setItem(newFormId, JSON.stringify(newForm)); // Save form to localStorage
  //   // Redirect to the form page
  //   navigate(`/form/${newFormId}`);
  // };

  const createForm = async () => {
    try {
      // Send the form data to the backend
      const response = await axios.post("http://localhost:5001/api/forms", form);
  
      // Get the new form UUID from the response
      const newFormId = response.data.id;
      const formUuid = response.data.uuid;
  
      // Show the shareable link
      alert(`Form created! Shareable link: http://localhost:3000/share/${formUuid}`);
  
      // Navigate to the form page using the new form ID
      navigate(`/form/${newFormId}`);
    } catch (error) {
      console.error("Error creating form:", error);
      alert("Failed to create form. Please try again.");
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-8">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {id ? "Edit Form" : "Create a New Form"}
            </h1>
            <p className="text-lg text-gray-600">Drag and drop fields to customize your form.</p>
          </div>

          {/* Form Title and Description */}
          <div className="mb-6">
            <label htmlFor="formTitle" className="text-xl font-semibold text-gray-700">
              Form Title:
            </label>
            <input
              id="formTitle"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none mb-4"
              placeholder="Enter form title"
            />
            <label htmlFor="formDescription" className="text-xl font-semibold text-gray-700">
              Form Description:
            </label>
            <input
              id="formDescription"
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              placeholder="Enter form description"
            />
          </div>

          {/* Drag-and-Drop Area */}
          <div className="flex space-x-6">
            {/* Left Panel */}
            <div className="w-1/4 bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Available Fields</h3>
              <div className="space-y-2">
                {availableFields.map((field) => (
                  <div
                    key={field.id}
                    className="p-3 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                    onClick={() =>
                      addField(
                        field.type as
                          | "dropdown"
                          | "checkbox"
                          | "text"
                          | "number"
                          | "radio"
                      )
                    }
                  >
                    {field.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="w-3/4 bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Form Fields</h3>
              {form.fields.map((field, index) => (
                <FieldCard
                  key={field.id}
                  field={field}
                  index={index}
                  moveField={moveField}
                  updateField={updateField}
                  removeField={removeField}
                  handleAddOption={handleAddOption}
                  handleOptionChange={handleOptionChange}
                  handleOptionToggle={handleOptionToggle}
                />
              ))}
            </div>
          </div>

          {/* Save Form Button */}
          <button
            onClick={saveForm}
            className="w-full bg-blue-500 text-white py-3 rounded-lg shadow hover:bg-blue-600 transition mt-6"
          >
            {id ? "Save Changes" : "Create Form"}
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

export default FormBuilderPage;