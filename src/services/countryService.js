const axios = require("axios");

const getCountryData = async (countryName) => {
  const response = await axios.get(
    `https://restcountries.com/v3.1/name/${countryName}`
  );
  if (!response.data || response.data.length === 0) {
    throw new Error("No data found for the specified country");
  }
  const countryData = response.data[0];
  return {
    name: countryData.name.common,
    currency: Object.values(countryData.currencies)[0],
    capital: countryData.capital?.[0] || "N/A",
    languages: Object.values(countryData.languages),
    flag: countryData.flags.png,
  };
};

module.exports = { getCountryData };
