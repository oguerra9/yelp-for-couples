import http from '../http-common.js';
import axios from 'axios';

export async function getGeoId(locationName) {
    const options = {
        params: {
            query: locationName
        }
    };

    try {
        const response = await http.get('/locations/search', options);
        console.log(response);
        let lat = response.data.data[0].result_object.latitude;
        let lon = response.data.data[0].result_object.longitude;
        let locationData = [];
        locationData['coords'] = [lat, lon];
        return locationData;
    } catch (error) {
        console.error(error);
    }    
}

export function getCustomFilterOptions(optionArr, fieldName) {
    let existingValues = [];
    let existingKeys = [];

    optionArr.forEach((option) => {
        if (option.hasOwnProperty(fieldName)) {
            let fieldValue = option[fieldName];
            if (Array.isArray(fieldValue) && fieldValue.length > 0) {
                fieldValue.forEach((value) => {
                    if (!existingKeys.includes(value.key)) {
                        existingValues.push(value);
                        existingKeys.push(value.key);
                    }
                })
            } else if (!Array.isArray(fieldValue)) {
                if (!existingValues.includes(fieldValue)) {
                    existingValues.push(fieldValue);
                }
            }
        }
    })

    return existingValues;
}


export async function getRestaurantOptions(locationCoords, cuisineTypeId) {
    let restaurantList = await getRestaurantData(locationCoords, cuisineTypeId);

    return restaurantList;
}

export async function getNearbyRestaurants(locationCoords) {
    let restaurantList = await getRestaurantData(locationCoords, '');

    return restaurantList;
}

export async function getRestaurantData(locationCoords, cuisineTypeId) {

    let maxDistance = '10';
    let distanceUnits = 'mi';

    if (localStorage.hasOwnProperty('maxDistance') && localStorage.getItem('maxDistance') != '') {
        maxDistance = localStorage.getItem('maxDistance');
    } 

    if (localStorage.hasOwnProperty('distanceUnits') && localStorage.getItem('distanceUnits') != '') {
        distanceUnits = localStorage.getItem('distanceUnits');
    } 


    console.log(`max distance = ${maxDistance}`);
    console.log(`distanceUnits = ${distanceUnits}`);

    // console.log(`locationCoords = ${locationCoords}`);

    // console.log(`cuisineTypeId = ${cuisineTypeId}`);
    // console.log(locationCoords[0]);
    // console.log(locationCoords[1]);

    let options = {};

    if (cuisineTypeId === '') {
        options = {
            params: {
                latitude: locationCoords[0],
                longitude: locationCoords[1],
                limit: '30',
                currency: 'USD',
                distance: maxDistance,
                open_now: 'false',
                lunit: distanceUnits,
                lang: 'en_US'
            }
        };
    } else {
        options = {
            params: {
                latitude: locationCoords[0],
                longitude: locationCoords[1],
                limit: '30',
                currency: 'USD',
                combined_food: cuisineTypeId,
                distance: maxDistance,
                open_now: 'false',
                lunit: distanceUnits,
                lang: 'en_US'
            }
        };
    }

    try {
        const response = await http.get('/restaurants/list-by-latlng', options);
        console.log(response);
        return filterOutAds(response.data.data);
    } catch (error) {
        console.error(error);
    }

}


export async function reverseGeocode(coords) {
    const options = {
        method: 'GET',
        url: 'https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse',
        params: {
          lat: coords[0],
          lon: coords[1],
          'accept-language': 'en',
        },
        headers: {
            'X-RapidAPI-Key': '8bd94b1fd1msha94f5193faa330fp1e5d6bjsn52affb54635b',
            'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com'
        }
      };
      
      try {
          const response = await axios.request(options);
          console.log(response.data);
          return `${response.data.address.city}, ${response.data.address.state}`;
      } catch (error) {
          console.error(error);
      }
}

export function filterOutAds(restaurantData) {
    let adFreeArr = [];

    restaurantData.forEach((restaurant) => {
        if (restaurant.location_id != '29006') {
            adFreeArr.push(restaurant);
        }
    })

    return adFreeArr;
}
