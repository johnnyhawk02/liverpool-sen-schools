// Import the updated schools data
import updatedSchools from './updated_schools';

// Export the same type definition to maintain backward compatibility
export type School = {
  name: string;
  phone: string[];
  url: string;
  summary_bold_info?: string;
  summary_description?: string;
  address_summary?: string;
  email?: string;
};

// Export the updated schools as default
export default updatedSchools; 