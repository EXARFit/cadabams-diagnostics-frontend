import axios from 'axios';
const API_BASE_URL = 'https://cadabamsapi.exar.ai/api/v1/cms/component/pagetemplate';

export const fetchTestData = async (slug) => {
  try {
    // First, try to fetch as a lab test
    const labTestResponse = await axios.get(`${API_BASE_URL}/labtest/${slug}`);
    if (labTestResponse.data.data) {
      // Only return published tests
      if (labTestResponse.data.data.pageState === 'publish') {
        return { ...labTestResponse.data.data, templateName: 'labtest' };
      } else {
        // If the test is in draft state, throw an error
        throw new Error('Test is in draft state');
      }
    }
  } catch (error) {
    // Only log error, we'll try non-lab test next
    console.error('Error fetching lab test data:', error);
  }

  try {
    // If lab test fetch fails, try to fetch as a non-lab test
    const nonLabTestResponse = await axios.get(`${API_BASE_URL}/non-labtest/${slug}`);
    if (nonLabTestResponse.data.data) {
      // Only return published tests
      if (nonLabTestResponse.data.data.pageState === 'publish') {
        return { ...nonLabTestResponse.data.data, templateName: 'non-labtest' };
      } else {
        // If the test is in draft state, throw an error
        throw new Error('Test is in draft state');
      }
    }
  } catch (error) {
    console.error('Error fetching non-lab test data:', error);
  }
  
  // If we get here, either no test was found or it was in draft state
  throw new Error('Failed to fetch test data or test is in draft state');
};
