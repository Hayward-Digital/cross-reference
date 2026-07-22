const BASE_URL = "https://commerce.hayward-pool-assets.com/haywardProducts";

export const fetchAPI = async (data, searchCriteria = 'searchCriteria=[]') => {
    const response = await fetch(`${BASE_URL}?path=crossreference-${data}/search&${searchCriteria}`);
    if (!response.ok) return [];
    return response.json();
};