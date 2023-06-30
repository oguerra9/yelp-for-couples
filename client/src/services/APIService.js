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
        let locationData = {};
        locationData['locationId'] = response.data.data[0].result_object.location_id;
        locationData['coords'] = [lat, lon];
        return locationData;
    } catch (error) {
        console.error(error);
    }    
}

export async function getFilterOptions(locationId) {
    let filterOptions = await getFilterData(locationId).then((response) => {
        let filterNames = findFilterNames(response);
        let filters = {};
        filterNames.forEach((name) => {
            filters[name] = findFilter(response, name);
        })
        //let filter = findFilter(response, filterName);
        //let options = findFilterOptions(filter);
        //return options;
        console.log('filter');
        console.log(filters);
        return filters;
    });
    console.log('filter options');
    console.log(filterOptions);
    return filterOptions;

}



export async function getFilterData(locationId) {
    const options = {
        method: 'POST',
        url: 'https://travel-advisor.p.rapidapi.com/restaurant-filters/v2/list',
        params: {
            currency: 'USD',
            units: 'mi',
            lang: 'en_US'
        },
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': '652c01dd3emsh0215dfe5dc848f6p1d45d6jsn43f4c72bc42e',
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
        },
        data: {
            geoId: parseInt(locationId),
            filters: [
                {
                    id: 'distance',
                    value: ['0', '3']
                }
            ]
        }
    };
    
    try {
        const response = await axios.request(options);
        console.log('filter data response');
        console.log(response.data.data);
        let filterDataArr = response.data.data.AppPresentation_queryAppListV2[0].filters.availableFilterGroups[0].filters;
            
        return filterDataArr;

    } catch (error) {
        console.error(error);
    }
}

function findFilterNames(filterData) {
    let filterNames = [];

    for (let i = 0; i < filterData.length; i++) {
        filterNames.push(filterData[i].name);
    }

    return filterNames;
}


function findFilter(filterData, searchFilter) {

    let filterIndex = 0;

    for (filterIndex = 0; filterIndex < filterData.length; filterIndex++) {
        if (filterData[filterIndex].name === searchFilter) {
            break;
        }
    }

    let filterValues = filterData[filterIndex].values;
    //let simpleValues = findFilterOptions(filterValues);
    return filterValues;
}

export function findFilterOptions(optionsArr) {
    console.log('finding filter options');
    console.log(optionsArr);
    let optionList = [];

    optionsArr.forEach((option) => {
        let optionObj = {};
        let optionName = '';

        if ((option.object).hasOwnProperty('tag')) {
            optionName = option.object.tag.localizedName;

        } else {
            optionName = option.object.text;
        }
        optionObj['name'] = optionName;
        optionObj['value'] = option.value;
        optionList.push(optionObj);
    })
    console.log('option list');
    console.log(optionList);
    return optionList;
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

// export async function getRestaurantOptions(locationId, cuisineTypeId) {
    // let restaurantList = await getRestaurantData(locationId, cuisineTypeId).then((response) => {
    //     let restaurantArr = parseRestaurantData(response);

    //     return restaurantArr;
    // });
// }
export async function getRestaurantOptions(locationCoords, cuisineTypeId) {
    let restaurantList = await getRestaurantData(locationCoords, cuisineTypeId);

    return restaurantList;
}

export async function getNearbyRestaurants(locationCoords) {
    let restaurantList = await getRestaurantData(locationCoords, '');

    return restaurantList;
}

export async function getRestaurantData(locationCoords, cuisineTypeId) {
    console.log(`locationCoords = ${locationCoords}`);

    console.log(`cuisineTypeId = ${cuisineTypeId}`);
    console.log(locationCoords[0]);
    console.log(locationCoords[1]);

    let options = {};

    if (cuisineTypeId === '') {
        options = {
            params: {
                latitude: locationCoords[0],
                longitude: locationCoords[1],
                limit: '30',
                currency: 'USD',
                distance: '2',
                open_now: 'false',
                lunit: 'mi',
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
                distance: '2',
                open_now: 'false',
                lunit: 'mi',
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
          'X-RapidAPI-Key': '652c01dd3emsh0215dfe5dc848f6p1d45d6jsn43f4c72bc42e',
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

// export function filterCuisines(restaurantList, cuisineList) {

// }

// export function filterByDistance(restaurantList, maxDistance) {

// }