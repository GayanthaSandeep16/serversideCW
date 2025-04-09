const axios = require('axios');
const https = require('https');

// This function fetches country data from the REST Countries API
const getCountryData = async (countryName) => {
  console.log(`Fetching data for: ${countryName}`);
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${countryName}`, {
      timeout: 5000, 
      httpsAgent: new https.Agent({
        rejectUnauthorized: true, 
        minVersion: 'TLSv1.2',    
        keepAlive: true,         
      }),
    });
    console.log('API response received');
    if (!response.data || response.data.length === 0) {
      throw new Error('Country not found');
    }
    const countryData = response.data[0];
    return {
      name: countryData.name.common,
      currency: Object.values(countryData.currencies)[0],
      capital: countryData.capital?.[0] || 'N/A',
      languages: Object.values(countryData.languages),
      flag: countryData.flags.png,
    };
  } catch (error) {
    console.error('API call failed:', error.message);
    throw error;
  }
};

module.exports = { getCountryData };