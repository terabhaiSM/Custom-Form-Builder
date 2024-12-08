// Define the basic structure of options for both dropdown and checkbox fields
export type Option = {
    label: string;
    checked?: boolean; // Only used for checkboxes
  };
  
  // Define the structure for a field
  export type Field = {
    id: string;
    type: "dropdown" | "checkbox" | "text" | "number"; // Add text and number types
    label: string;
    options?: Option[]; // options for dropdown and checkbox
    value?: string | number; // For text and number fields, store the value
  };