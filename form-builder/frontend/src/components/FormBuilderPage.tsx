import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DropdownCard from "../ui/DropdownCard";

// Define the field type for TypeScript
type Field = {
  id: string;
  type: "dropdown";
  label: string;
  options: string[];
};

const ItemType = "FIELD"; // Define a constant for item type

// FieldCard component for rendering individual fields
const FieldCard: React.FC<{
  field: Field;
  index: number;
  moveField: (dragIndex: number, hoverIndex: number) => void;
  updateField: (id: string, updatedField: Partial<Field>) => void;
  removeField: (id: string) => void;
  handleAddOption: (fieldId: string) => void;
  handleOptionChange: (fieldId: string, index: number, value: string) => void;
}> = ({ field, index, moveField, updateField, removeField, handleAddOption, handleOptionChange }) => {
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
      className={`p-4 rounded shadow bg-white ${isDragging ? "opacity-50" : ""}`}
      style={{ marginBottom: "8px", cursor: "move" }}
    >
      {/* For dropdown, render DropdownCard */}
      {field.type === "dropdown" ? (
        <DropdownCard
          field={field}
          updateField={updateField}
          handleAddOption={handleAddOption}
          handleOptionChange={handleOptionChange}
        />
      ) : (
        <div>
          <p>{field.label}</p>
          {/* Other input types handling */}
        </div>
      )}
    </div>
  );
};

const FormBuilderPage: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [availableFields] = useState([
    { id: "dropdown", type: "dropdown", label: "Dropdown", options: [] },
  ]); // Available fields in the left panel

  // Function to add a new field to the form (dragged from the left panel)
  const addField = (type: "dropdown") => {
    const newField: Field = {
      id: Date.now().toString(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      options: type === "dropdown" ? ["Option 1", "Option 2"] : [],
    };
    setFields([...fields, newField]);
  };

  // Function to move the field in the right panel (reorder fields)
  const moveField = (dragIndex: number, hoverIndex: number) => {
    const reorderedFields = [...fields];
    const [movedField] = reorderedFields.splice(dragIndex, 1);
    reorderedFields.splice(hoverIndex, 0, movedField);
    setFields(reorderedFields);
  };

  // Function to update field properties (label, options, etc.)
  const updateField = (id: string, updatedField: Partial<Field>) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, ...updatedField } : field)));
  };

  // Add new option to the dropdown field
  const handleAddOption = (fieldId: string) => {
    const updatedFields = fields.map((field) => {
      if (field.id === fieldId && "options" in field) {
        return { ...field, options: [...field.options, "New Option"] };
      }
      return field;
    });
    setFields(updatedFields);
  };

  // Handle option change (value change inside dropdown options)
  const handleOptionChange = (
    fieldId: string,
    index: number,
    value: string
  ) => {
    const updatedFields = fields.map((field) => {
      if (field.id === fieldId && "options" in field) {
        const updatedOptions = [...field.options];
        updatedOptions[index] = value;
        return { ...field, options: updatedOptions };
      }
      return field;
    });
    setFields(updatedFields);
  };

  // Remove field
  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6">
          <div className="flex space-x-6">
            {/* Left Panel for available field types */}
            <div className="w-1/4 bg-gray-50 p-4 rounded shadow">
              <h3>Available Fields</h3>
              {availableFields.map((field) => (
                <div
                  key={field.id}
                  className="field-item p-2 cursor-pointer bg-blue-200 rounded"
                  onClick={() => addField(field.type as "dropdown")}
                >
                  {field.label}
                </div>
              ))}
            </div>

            {/* Right Panel for the form fields */}
            <div className="w-3/4 bg-gray-50 p-4 rounded shadow">
              <h3>Form Fields</h3>
              {fields.map((field, index) => (
                <FieldCard
                  key={field.id}
                  field={field}
                  index={index}
                  moveField={moveField}
                  updateField={updateField}
                  removeField={removeField}
                  handleAddOption={handleAddOption}
                  handleOptionChange={handleOptionChange}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default FormBuilderPage;