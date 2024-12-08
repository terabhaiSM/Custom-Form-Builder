import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DropdownCard from "../ui/DropdownCard";
import CheckboxCard from "../ui/CheckboxCard";
import TextInputCard from "../ui/TextInputCard";
import NumberInputCard from "../ui/NumberInputCard";
import RadioButtonCard from "../ui/RadioButtonCard";
import { Field } from "../types"; // Import the Field type

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
      className={`p-4 rounded shadow bg-white ${
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
      ) : null}
    </div>
  );
};

// Main FormBuilderPage
const FormBuilderPage: React.FC = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    fields: [] as Field[],
  });
  const [availableFields] = useState([
    { id: "dropdown", type: "dropdown", label: "Dropdown", options: [] },
    { id: "checkbox", type: "checkbox", label: "Checkbox", options: [{ label: "Option 1", checked: false }, { label: "Option 2", checked: false }] },
    { id: "text", type: "text", label: "Text Input", value: "" },
    { id: "number", type: "number", label: "Number Input", value: "" },
    { id: "radio", type: "radio", label: "Radio Button", options: [{ label: "Option 1", checked: false }, { label: "Option 2", checked: false }] },
  ]); // Available fields in the left panel
  const navigate = useNavigate();

  // Handling adding new fields
  const addField = (type: "dropdown" | "checkbox" | "text" | "number" | "radio") => {
    const newField: Field = {
      id: Date.now().toString(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      options: type === "dropdown" 
        ? [{ label: "Option 1", checked: false }]
        : type === "checkbox"
        ? [{ label: "Option 1", checked: false }, { label: "Option 2", checked: false }]
        : type === "radio"
        ? [{ label: "Option 1", checked: false }, { label: "Option 2", checked: false }]
        : undefined,
      value: type === "text" || type === "number" ? "" : undefined,
    };
    setForm((prevForm) => ({
      ...prevForm,
      fields: [...prevForm.fields, newField],
    }));
  };

  // Moving fields
  const moveField = (dragIndex: number, hoverIndex: number) => {
    const reorderedFields = [...form.fields];
    const [movedField] = reorderedFields.splice(dragIndex, 1);
    reorderedFields.splice(hoverIndex, 0, movedField);
    setForm((prevForm) => ({
      ...prevForm,
      fields: reorderedFields,
    }));
  };

  // Update field values
  const updateField = (id: string, updatedField: Partial<Field>) => {
    setForm((prevForm) => ({
      ...prevForm,
      fields: prevForm.fields.map((field) => (field.id === id ? { ...field, ...updatedField } : field)),
    }));
  };

  // Adding options for dropdown or checkbox fields
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

  // Handling option change for dropdown and checkbox fields
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

  // Handling checkbox toggle for checkbox fields
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

  // Removing a field
  const removeField = (id: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      fields: prevForm.fields.filter((field) => field.id !== id),
    }));
  };
  // Handle form creation and redirect
  const createForm = () => {
    const newFormId = Date.now().toString();
    // Store the form in localStorage
    const newForm = { ...form, id: newFormId };
    localStorage.setItem(newFormId, JSON.stringify(newForm)); // Save form to localStorage
    // Redirect to the form page
    navigate(`/form/${newFormId}`);
  };

  return (
    <DndProvider backend={HTML5Backend}>    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6">
        <div className="flex flex-col space-y-6">
          {/* Form Title and Description */}
          <div className="mb-4">
            <div className="mb-2">
              <label htmlFor="formTitle" className="text-lg font-semibold">
                Form Title:
              </label>
              <input
                id="formTitle"
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
                placeholder="Enter form title"
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="formDescription"
                className="text-lg font-semibold"
              >
                Form Description:
              </label>
              <input
                id="formDescription"
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
                placeholder="Enter form description"
              />
            </div>
          </div>

          {/* Left Panel for available field types */}
          <div className="flex space-x-6">
            <div className="w-1/4 bg-gray-50 p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">Available Fields</h3>
              <div className="space-y-2">
                {availableFields.map((field) => (
                  <div
                    key={field.id}
                    className="field-item p-3 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
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

              {/* Right Panel for the form fields */}
              <div className="w-3/4 bg-gray-50 p-4 rounded shadow">
                <h3>Form Fields</h3>
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
          </div>

          {/* Create Form Button */}
          <button
            onClick={createForm}
            className="w-full bg-blue-500 text-white py-2 rounded shadow hover:bg-blue-600 transition duration-200"
          >
            Create Form
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

export default FormBuilderPage;