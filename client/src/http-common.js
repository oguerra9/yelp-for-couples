import axios from "axios";

export default axios.create({
    baseURL: 'https://travel-advisor.p.rapidapi.com/',
    headers: {
      'X-RapidAPI-Key': '4341755dc2msh4208947d6e70d72p170865jsnd1b8b18bb70a',
      'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
    }
  });