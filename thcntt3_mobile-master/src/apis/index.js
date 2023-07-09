const { baseURL, crudAPI, crud, commonHeadersAPI } = require("../constants");

const getAll = async () => {
    try {
        const options = {
            method: crud.get
        };
        const response = await (await fetch(`${baseURL}/${crudAPI.list}`, options)).json();
        return response;
    }
    catch (error) {
        console.log(`Error when call api getAll: ${error}`);
    }
};

const getDetail = async (id) => {
    try {
        const options = {
            method: crud.get
        };
        const response = await (await fetch(`${baseURL}/${crudAPI.detail}/${id}`, options)).json();
        return response;
    }
    catch (error) {
        console.log(`Error when call api getDetail: ${error}`);
    }
};

const addData = async (data) => {
    try {
        const options = {
            method: crud.post,
            body: JSON.stringify(data),
            headers: commonHeadersAPI
        };
        const response = await (await fetch(`${baseURL}/${crudAPI.add}`, options)).json();
        return response;
    }
    catch (error) {
        console.log(`Error when call api addData: ${error}`);
    }
};


const addDataSensor = async (data) => {
    try {
        const options = {
            method: crud.post,
            body: JSON.stringify(data),
            headers: commonHeadersAPI
        };
        const response = await (await fetch(`${baseURL}/${crudAPI.addSensor}`, options)).json();
        return response;
    }
    catch (error) {
        console.log(`Error when call api addData: ${error}`);
    }
};

const updateData = async (data) => {
    try {
        const options = {
            method: crud.put,
            body: JSON.stringify(data),
            headers: commonHeadersAPI
        };
        const response = await (await fetch(`${baseURL}/${crudAPI.update}`, options)).json();
        return response;
    }
    catch (error) {
        console.log(`Error when call api updateData: ${error}`);
    }
};

const deleteData = async (id) => {
    try {
        const options = {
            method: crud.delete
        };
        const response = await (await fetch(`${baseURL}/${crudAPI.delete}/${id}`, options)).json();
        return response;
    }
    catch (error) {
        console.log(`Error when call api deleteData: ${error}`);
    }
};

module.exports = { getAll, getDetail, addData, updateData, deleteData, addDataSensor };
