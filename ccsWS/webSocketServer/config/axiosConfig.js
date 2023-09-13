const axios = require('axios').default;
const { ENDPOINTS } = require('../utils/constants');
const config = require('../config/wsConfig');

const axiosInstance = axios.create({
    baseURL: config.baseURL,
    timeout: config.requestTimeout
});

axiosInstance.interceptors.request.use(function(aConfig){
    const { url } = aConfig;

    if (url !== ENDPOINTS.GENERATE_JWT_TOKEN) {
        aConfig.headers.Authorization = `Bearer ${global.jwt}`;
        aConfig.headers['X-Username'] = config.username;
        aConfig.headers['X-IP-Address'] = global.remoteAddress;
        aConfig.headers['X-User-Role'] = config.userRole;
    }
    return aConfig
})

module.exports = axiosInstance;