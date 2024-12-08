export type Field =
  | TextInputField
  | NumberInputField
  | DatePickerField
  | CheckboxField
  | DropdownField
  | RadioButtonField;

export interface BaseField {
  id: string;           // Unique identifier for each field
  label: string;        // Field label
  placeholder?: string; // Optional placeholder text
  required: boolean;    // Whether the field is required or not
  defaultValue?: string; // Optional default value
  type: string;         // Type of the field (Text, Number, etc.)
}

export interface TextInputField extends BaseField {
  type: 'text';
  maxLength?: number;  // Optional: max length for the text input
}

export interface NumberInputField extends BaseField {
  type: 'number';
  min?: number;        // Optional: minimum value
  max?: number;        // Optional: maximum value
}

export interface DatePickerField extends BaseField {
  type: 'date';
}

export interface CheckboxField extends BaseField {
  type: 'checkbox';
  options: string[];    // Options for checkboxes
}

export interface DropdownField extends BaseField {
  type: 'dropdown';
  options: string[];    // Options for dropdown
}

export interface RadioButtonField extends BaseField {
  type: 'radio';
  options: string[];    // Options for radio buttons
}

