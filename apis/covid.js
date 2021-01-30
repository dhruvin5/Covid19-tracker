var axios = require('axios');
const allCountries = require('../models/allCountries');
module.exports={
stateWise:()=>axios( {
  method: 'get',
  url: 'https://api.covid19india.org/state_district_wise.json',
  headers: { }
}),
countryData:()=>axios( {
    method: 'get',
    url: 'https://api.covid19india.org/data.json',
    headers: { }
  }),
allCountriesData:()=>axios({
    method: 'get',
    url: 'https://api.covid19api.com/summary',
    headers: { }
  
})
}
