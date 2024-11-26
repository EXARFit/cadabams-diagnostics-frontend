import axios from 'axios';

const API_BASE_URL = 'https://cadabamsapi.exar.ai/api/v1/cms/component/pagetemplate';

export const fetchTestData = async (slug) => {
  try {
    // First, try to fetch as a lab test
    const labTestResponse = await axios.get(`${API_BASE_URL}/labtest/${slug}`);
    if (labTestResponse.data.data) {
      return { ...labTestResponse.data.data, templateName: 'labtest' };
    }
  } catch (error) {
    console.error('Error fetching lab test data:', error);
  }

  try {
    // If lab test fetch fails, try to fetch as a non-lab test
    const nonLabTestResponse = await axios.get(`${API_BASE_URL}/non-labtest/${slug}`);
    if (nonLabTestResponse.data.data) {
      return { ...nonLabTestResponse.data.data, templateName: 'non-labtest' };
    }
  } catch (error) {
    console.error('Error fetching non-lab test data:', error);
  }

  throw new Error('Failed to fetch test data');
};