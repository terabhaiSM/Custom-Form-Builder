import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DropdownCard from "../ui/DropdownCard";
import CheckboxCard from "../ui/CheckboxCard";
import TextInputCard from "../ui/TextInputCard";
import NumberInputCard from "../ui/NumberInputCard";
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
      className={`p-4 rounded shadow bg-white ${isDragging ? "opacity-50" : ""}`}
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
      ) : null}
    </div>
  );
};

const FormBuilderPage: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [availableFields] = useState([
    { id: "dropdown", type: "dropdown", label: "Dropdown", options: [] },
    { id: "checkbox", type: "checkbox", label: "Checkbox", options: [{ label: "Option 1", checked: false }, { label: "Option 2", checked: false }] },
    { id: "text", type: "text", label: "Text Input", value: "" },
    { id: "number", type: "number", label: "Number Input", value: "" },
  ]); // Available fields in the left panel

  const addField = (type: "dropdown" | "checkbox" | "text" | "number") => {
    const newField: Field = {
      id: Date.now().toString(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      options: type === "dropdown" 
        ? [{ label: "Option 1", checked: false }]
        : type === "checkbox"
        ? [{ label: "Option 1", checked: false }, { label: "Option 2", checked: false }]
        : undefined,
      value: type === "text" || type === "number" ? "" : undefined,
    };
    setFields([...fields, newField]);
  };

  const moveField = (dragIndex: number, hoverIndex: number) => {
    const reorderedFields = [...fields];
    const [movedField] = reorderedFields.splice(dragIndex, 1);
    reorderedFields.splice(hoverIndex, 0, movedField);
    setFields(reorderedFields);
  };

  const updateField = (id: string, updatedField: Partial<Field>) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, ...updatedField } : field)));
  };

  const handleAddOption = (fieldId: string) => {
    const updatedFields = fields.map((field) => {
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
    setFields(updatedFields);
  };

  const handleOptionChange = (fieldId: string, index: number, value: string) => {
    const updatedFields = fields.map((field) => {
      if (field.id === fieldId && "options" in field) {
        const updatedOptions = [...field.options];
        updatedOptions[index].label = value;
        return { ...field, options: updatedOptions };
      }
      return field;
    });
    setFields(updatedFields);
  };

  const handleOptionToggle = (fieldId: string, index: number) => {
    const updatedFields = fields.map((field) => {
      if (field.id === fieldId && "options" in field) {
        const updatedOptions = [...field.options];
        updatedOptions[index].checked = !updatedOptions[index].checked;
        return { ...field, options: updatedOptions };
      }
      return field;
    });
    setFields(updatedFields);
  };

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
              <h3 className="text-lg font-semibold mb-4">Available Fields</h3>
              <div className="space-y-2">
                {availableFields.map((field) => (
                  <div
                    key={field.id}
                    className="field-item p-3 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                    onClick={() => addField(field.type as "dropdown" | "checkbox" | "text" | "number")}
                  >
                    {field.label}
                  </div>
                ))}
              </div>
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
                  handleOptionToggle={handleOptionToggle}
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