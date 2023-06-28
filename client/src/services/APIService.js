import http from '../http-common.js';

export async function getBusinesses() {
    const options = {
        params: {
            location_id: '293919',
            restaurant_tagcategory: '10591',
            restaurant_tagcategory_standalone: '10591',
            currency: 'USD',
            lunit: 'km',
            limit: '30',
            open_now: 'false',
            lang: 'en_US'
        }
    };

    try {
        const response = await http.get('/',options);
        console.log(response.data['data']);
    } catch (error) {
        console.error(error);
    }
}