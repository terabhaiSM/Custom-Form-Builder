import React from "react";
import { Field } from "../types";

type DropdownCardProps = {
  field: Field;
  updateField: (id: string, updatedField: Partial<Field>) => void;
    removeField: (id: string) => void
  handleAddOption: (fieldId: string) => void;
  handleOptionChange: (fieldId: string, index: number, value: string) => void;
};

const DropdownCard: React.FC<DropdownCardProps> = ({
  field,
  updateField,
  removeField,
  handleAddOption,
  handleOptionChange,
}) => {
  return (
    <div className="field-card p-4 rounded shadow bg-white">
      <div className="flex justify-between items-center mb-2">
        <input
          type="text"
          value={field.label}
          onChange={(e) => updateField(field.id, { label: e.target.value })}
          className="w-3/4 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
          placeholder="Field Label"
        />
        <button
        onClick={() => removeField(field.id)}
        className="text-red-500 hover:underline"
      > Remove </button>
      </div>
      <div className="space-y-2">
        {field.options.map((option, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <input
              type="text"
              value={option.label} // Use `option.label` to display the correct value
              onChange={(e) => handleOptionChange(field.id, idx, e.target.value)}
              className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none"
            />
            <button
              onClick={() => {
                const newOptions = field.options.filter((_, optIdx) => optIdx !== idx);
                updateField(field.id, { options: newOptions });
              }}
              className="text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => handleAddOption(field.id)}
          className="text-blue-500 hover:underline"
        >
          Add Option
        </button>
      </div>
    </div>
  );
};

export default DropdownCard;