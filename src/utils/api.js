const BASE_URL = "/rest/V1/";
const HEADERS = {
  Authorization: "Bearer 3ci73owhvsyvefa3qu5nti1vevqi16d0",
};

/**
 * Fetch data from the API with a given endpoint.
 * @param {string} endpoint - The API endpoint to fetch.
 * @returns {Promise<any>} - The JSON data from the response.
 */
const fetchAPI = async (endpoint) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, { headers: HEADERS });
  if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return response.json();
};

/**
 * Load all required data (categories, manufacturers, series) in one call.
 * @returns {Promise<object>} - The preloaded data.
 */
const loadAllData = async () => {
  try {
    const [categories, manufacturers,series] = await Promise.all([
      fetchAPI("crossreference-categories/search?searchCriteria=[]"),
      fetchAPI("crossreference-manufacturers/search?searchCriteria=[]"),
      fetchAPI("crossreference-series/search?searchCriteria=[]"),
    ]);

    return {
      categories: categories.items || [],
      manufacturers: manufacturers.items || [],
      series: series.items || [],
    };
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
};

// Export the reusable functions and preloaded data
export { fetchAPI, loadAllData };
export const dataPromise = loadAllData();