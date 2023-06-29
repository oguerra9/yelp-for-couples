import http from '../http-common.js';

export async function getLocationCoords(locationName) {
    const options = {
        params: {
            query: locationName
        }
    };

    try {
        const response = await http.get('/locations/search',options);
        let fullResponseData = response;
        console.log(`full response: ${fullResponseData}`);
        console.log(`full response: ${JSON.stringify(fullResponseData)}`);
        let responseData = fullResponseData.data;
        console.log(`response data: ${JSON.stringify(responseData)}`);
        let firstEntry = responseData.data[0];
        console.log(`first entry = ${firstEntry}`);
        let entryResult = firstEntry.result_object;
        console.log(`entry result: ${entryResult}`);
        let locationCoords = [entryResult.latitude, entryResult.longitude];
        console.log(`location coords = ${locationCoords}`);
        return locationCoords;
    } catch (error) {
        console.error(error);
    }
} 

export async function getBusinesses(offset) {
    const options = {
        params: {
            location_id: '293919',
            lunit: 'km',
            limit: '30',
            open_now: 'false',
            lang: 'en_US',
            offset: offset
        }
    };

    try {
        const response = await http.get('/restaurants/list',options);
        console.log(response.data['data']);
    } catch (error) {
        console.error(error);
    }
}