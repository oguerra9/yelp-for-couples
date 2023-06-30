import http from '../http-common.js';
import axios from 'axios';

import { getGeoId, retrieveFilters } from './APIService';

export default class DataManager {
    constructor() {
        this.locationName = '';
        this.locationId = '';
        this.filterNames = [];
        this.filterData = {};
    }

    async setLocationName(newName) {
        this.locationName = newName;
        await this.findGeoId().then((response) => {
            console.log(`this.findGeoId returned ${response}`);
        });
        console.log(`await number 1 done, start number 2 now`);
        await this.findFilters().then((response) => {
            console.log(`filters found`);
            return this.locationId;
        });
        console.log(`await number 2 done`);
        
    }

    setFilterNames(newFilterNames) {
        this.filterNames = newFilterNames;
    }

    setFilterData(newFilterData) {
        console.log(newFilterData);
        this.filterData = newFilterData;
    }

    getFilterNames() {
        return this.filterNames;
    }

    getFilterData() {
        return this.filterData;
    }


    async findGeoId() {
        await getGeoId(this.locationName).then((response) => {
            console.log(`this.locationId = ${response}`);
            this.locationId = response;
            localStorage.setItem('locationId', response);
            // this.findFilters();
            return response;
        })

    }

    async findFilters() {

        let filterResponse = await retrieveFilters(this.locationId);
        this.findCuisineTypes(filterResponse);
    }

    findCuisineTypes(filterData) {
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
    
        this.filterNames = filterNames;
        this.filterData = filters;
    
    }
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



