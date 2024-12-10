import React from "react";
import { Field } from "../types";

interface DateInputCardProps {
  field: Field;
  updateField: (id: string, updatedField: Partial<Field>) => void;
  removeField: (id: string) => void;
}

const DateInputCard: React.FC<DateInputCardProps> = ({ field, updateField, removeField }) => {
  return (
    <div className="p-4 border rounded shadow bg-white">
      <input
          type="text"
          value={field.label}
          onChange={(e) => updateField(field.id, { label: e.target.value })}
          className="w-3/4 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
          placeholder="Field Label"
        />
      <input
        type="date"
        value={field.value || ""}
        onChange={(e) =>
          updateField(field.id, { value: e.target.value })
        }
        className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
      />
      <button
        onClick={() => removeField(field.id)}
        className="mt-2 text-red-500 hover:underline"
      >
        Remove
      </button>
    </div>
  );
};

export default DateInputCard;