const BASE_URL = "/rest/V1/";
const HEADERS = {
  Authorization: "Bearer 3ci73owhvsyvefa3qu5nti1vevqi16d0",
};

export const fetchAPI = async (data, searchCriteria = 'searchCriteria=[]') => {
    const response = await fetch(`${BASE_URL}crossreference-${data}/search?${searchCriteria}`, { headers: HEADERS }, { 
        headers: {
            Authorization: "Bearer 3ci73owhvsyvefa3qu5nti1vevqi16d0",
          },
          mode: 'no-cors',
     });
    if (!response.ok) return [];
    return response.json();
};