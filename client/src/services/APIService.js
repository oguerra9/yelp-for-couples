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
        let locationId = response.data.data[0].result_object.location_id;
        return locationId;
    } catch (error) {
        console.error(error);
    }    
}

export async function getFilterOptions(locationId, filterName) {
    let filterOptions = await getFilterData(locationId).then((response) => {
        let filter = findFilter(response, filterName);
        return filter;
    });
    return filterOptions;
}

export async function getFilterData(locationId) {
    const options = {
        method: 'POST',
        url: 'https://travel-advisor.p.rapidapi.com/restaurant-filters/v2/list',
        params: {
            currency: 'USD',
            units: 'km',
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
        console.log(response);
        let filterDataArr = response.data.data.AppPresentation_queryAppListV2[0].filters.availableFilterGroups[0].filters;
            
        return filterDataArr;

    } catch (error) {
        console.error(error);
    }
}

function findFilter(filterData, searchFilter) {

    let filterIndex = 0;

    for (filterIndex = 0; filterIndex < filterData.length; filterIndex++) {
        if (filterData[filterIndex].name === searchFilter) {
            break;
        }
    }

    let filterOptions = findFilterOptions(filterData[filterIndex].values);
    return filterOptions;
}

function findFilterOptions(optionsArr) {
    let optionList = [];

    optionsArr.forEach((option) => {
        let optionName = '';

        if ((option.object).hasOwnProperty('tag')) {
            optionName = option.object.tag.localizedName;

        } else {
            optionName = option.object.text;
        }
        optionList.push(optionName);
    })

    return optionList;
}