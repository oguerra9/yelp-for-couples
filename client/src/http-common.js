import axios from "axios";

export default axios.create({
    baseURL: 'https://travel-advisor.p.rapidapi.com/',
    headers: {
      'X-RapidAPI-Key': '8bd94b1fd1msha94f5193faa330fp1e5d6bjsn52affb54635b',
      'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
    }
  });