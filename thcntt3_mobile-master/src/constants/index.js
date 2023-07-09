const baseURL = 'http://192.168.1.8:3003';

const crudAPI = {
    list: 'list',
    detail: 'detail',
    add: 'add-data',
    addSensor: 'sensor',
    update: 'update',
    delete: 'delete'
};

const crud = {
    get: 'GET',
    post: 'POST',
    put: 'PUT',
    delete: 'DELETE'
};

const commonHeadersAPI = {
    'Content-type': 'application/json; charset=UTF-8'
};

module.exports = { baseURL, crudAPI, crud, commonHeadersAPI };
