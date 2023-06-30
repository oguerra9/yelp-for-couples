import http from '../http-common.js';
import axios from 'axios';
//import myDM from './DataManager';


export async function getGeoId(locationName) {
    console.log('retrieving geoid');
    const options = {
        params: {
            query: locationName
        }
    };

    try {
        const response = await http.get('/locations/search',options);
        console.log(response);
        let locationId = response.data.data[0].result_object.location_id;
        console.log(locationId);
        //retrieveFilters(locationId);
        return locationId;
    } catch (error) {
        console.error(error);
    }
}

export async function retrieveFilterOptions(locationId, filterName) {
    locationId = parseInt(locationId);
    let filterResponse = await retrieveFilters(locationId).then((response) => {
        console.log(response);
        console.log('retrieve filter options returning');
        console.log(response[filterName]);
        
    });

    console.log('filter response');
    console.log(filterResponse);
    return filterResponse;
}

export async function retrieveFilters(locationId) {
    

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
        console.log(response);
        let usefulResponse = response.data.data.AppPresentation_queryAppListV2[0].filters.availableFilterGroups[0].filters;
        console.log('useful response');
        console.log(usefulResponse);
        
        let filterArr = findCuisineTypes(usefulResponse);
        console.log(`after findCuisineTypes`);
        return filterArr;
    } catch (error) {
        console.error(error);
    }
    // console.log(`locationId = ${locationId}`);
    // const options = {
    //     params: {
    //         currency: 'USD',
    //         units: 'km',
    //         lang: 'en_US'
    //     },
    //     data: {
    //         geoId: locationId,
    //         filters: [
    //           {
    //             id: 'distance',
    //             value: ['0', '3']
    //           }
    //         ]
    //     }
    // };
    // try {
    //     const response = await http.post('/restaurant-filters/v2/list', options);
    //     console.log(response);
    // } catch (error) {
    //     console.log(error);
    // }
}

export async function retrieveRestaurants(locationId) {

    const options = {
        params: {
            currency: 'USD',
            units: 'km',
            lang: 'en_US'
        },
        data: {
            geoId: locationId,
            filters: [
            {
                id: 'distance',
                value: ['3']
            }
            ],
            updateToken: ''
        }
    };
    

    try {
        const response = await http.post('/restaurants/v2/list',options);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}


function findCuisineTypes(filterData) {
    console.log(filterData);
    let filters = {};
    let filterNames = [];

    filterData.forEach((filterType) => {
        console.log(`adding filter ${filterType.name} to filters`);
        filterNames.push(filterType.name);

        filters[filterType.name] = {
            name: filterType.name,
            title: filterType.title,
            options: findFilterOptions(filterType.values)
        };

        console.log(`filters[${filterType.name}] =`);
        console.log(filters[filterType.name]);
    })
    return filters;

    //myDM.setFilterNames(filterNames);
    //myDM.setFilterData(filters);

}

function findFilterOptions(optionsArr) {
    let optionObj = {};
    let nameList = [];

    optionsArr.forEach((option) => {
        let optionName = '';

        if (option.object.tag != null) {
            optionName = option.object.tag.localizedName;

        } else {
            optionName = option.object.text;
        }
        nameList.push(optionName);
        optionObj[optionName] = {
            name: optionName,
            count: option.count,
            value: option.value
        };
    })

    optionObj['nameList'] = nameList;

    return optionObj;
}
