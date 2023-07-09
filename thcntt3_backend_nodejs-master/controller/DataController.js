const { validateData, sentSuccessResponse, sentErroresponse } = require('../common/response');
const { data, regexData } = require('../constant/index');
const Data = require('../model/data');
const moment = require('moment');

const DataController = {

    listen: async (req, res) => {
        return res.status(200).json(sentSuccessResponse(null, "Server is running"));
    },

    add: async (req, res) => {

        const { temperature_value: temperature, humidity_value: humidity, mq2_value: dust } = req.body;

        if (!temperature) return res.status(400).json(validateData('Vui lòng nhập temperature'));
        if (!humidity) return res.status(400).json(validateData('Vui lòng nhập humidity'));
        if (isNaN(temperature)) return res.status(400).json(validateData('temperature phải là số'));
        if (isNaN(humidity)) return res.status(400).json(validateData('humidity phải là số'));

        const date = moment().format('DD/MM/YYYY');
        const time = moment().format('HH:mm:ss');

        try {
            const result = new Data({
                temperature: temperature,
                humidity: humidity,
                dust: dust,
                date: date,
                time: time
            });
            await result.save()
                .then((data) => {
                    return res.status(200).json(sentSuccessResponse(data, 'Add Success'));
                })
                .catch((error) => {
                    return res.json(sentErroresponse(error, 'Add Fail'));
                })
        }
        catch (error) {
            return res.json(sentErroresponse(error, error.message));
        }
    },

    list: async (req, res) => {
        try {
            const result = await Data
                .find({ active: true })
                .sort({ createdAt: -1 })
                .limit(20);
            let object = {
                data: result,
                length: result.length
            };
            return res.status(200).json(sentSuccessResponse(object, 'Get List Success'));
        }
        catch (error) {
            return res.json(sentErroresponse(error, error.message));
        }
    },

    detail: async (req, res) => {
        const { id } = req.params;
        try {
            const result = await Data.findById(id);
            if (result) {
                return res.status(200).json(sentSuccessResponse(result, 'Get Detail Success'));
            }
            else {
                return res.json(sentErroresponse(null, 'Data is not found'));
            }
        }
        catch (error) {
            return res.json(sentErroresponse(error, error.message));
        }
    },

    update: async (req, res) => {

        const { temperature, humidity, dust, id } = req.body;

        if (!id) return res.status(400).json(validateData('Vui lòng nhập id'));
        if (!temperature) return res.status(400).json(validateData('Vui lòng nhập temperature'));
        if (!humidity) return res.status(400).json(validateData('Vui lòng nhập humidity'));

        if (isNaN(temperature)) return res.status(400).json(validateData('temperature phải là số'));
        if (isNaN(humidity)) return res.status(400).json(validateData('humidity phải là số'));

        const date = moment().format('DD/MM/YYYY');
        const time = moment().format('HH:mm:ss');

        try {
            const oldData = await Data.findOne({ _id: id });

            if (!oldData) {
                return res.json(sentErroresponse(null, 'Data is not found'));
            };

            oldData.temperature = temperature;
            oldData.humidity = humidity;
            oldData.dust = dust ? dust : oldData.dust;
            oldData.date = date;
            oldData.time = time;

            await oldData.save()
                .then((data) => {
                    return res.status(200).json(sentSuccessResponse(data, 'Update Success'));
                })
                .catch((error) => {
                    return res.json(sentErroresponse(error, error.message));
                })
        }
        catch (error) {
            return res.json(sentErroresponse(error, error.message));
        }
    },

    delete: async (req, res) => {
        const { id } = req.params;
        try {
            const result = await Data.findByIdAndDelete(id);
            if (result) {
                return res.status(200).json(sentSuccessResponse(result, 'Delete Success'));
            }
            else {
                return res.json(sentErroresponse(null, 'Delete Fail'));
            }
        }
        catch (error) {
            return res.json(sentErroresponse(error, error.message));
        }
    }
};

module.exports = DataController;
