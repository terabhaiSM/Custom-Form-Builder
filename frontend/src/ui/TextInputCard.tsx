import React from "react";
import { Field } from "../types"; // Import Field type

type TextInputCardProps = {
  field: Field;
  updateField: (id: string, updatedField: Partial<Field>) => void;
  removeField: (id: string) => void;
};

const TextInputCard: React.FC<TextInputCardProps> = ({ field, updateField, removeField }) => {
  return (
    <div className="field-card p-4 rounded shadow bg-white">
      <div className="flex flex-col space-y-2 mb-2">
        {/* Input for the Label */}
        <input
          type="text"
          id="label"
          value={field.label || ""}
          onChange={(e) => updateField(field.id, { label: e.target.value })}
          className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none"
          placeholder="Label"
        />
        {/* Input for the Value */}
        <input
          type="text"
          id="value"
          value={field.value || ""}
          onChange={(e) => updateField(field.id, { value: e.target.value })}
          className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none"
          placeholder="Enter text"
        />
      </div>
      <button
        onClick={() => removeField(field.id)}
        className="text-red-500 hover:underline"
      >
        Remove
      </button>
    </div>
  );
};

export default TextInputCard;
