/**
 * Created by A on 7/18/17.
 */
'use strict';
const AppUsers = require('../AppUsers/route/AppUsersRoute');
const AppDevices = require('../AppDevices/route/AppDevicesRoute');

module.exports = [
    // AppUsers APIs
    { method: 'POST', path: '/AppUsers/registerUser', config: AppUsers.registerUser },
    { method: 'POST', path: '/AppUsers/loginUser', config: AppUsers.loginUser },
    { method: 'POST', path: '/AppUsers/getListlUser', config: AppUsers.find },
    { method: 'POST', path: '/AppUsers/getDetailUserById', config: AppUsers.findById },
    { method: 'POST', path: '/AppUsers/updateUserById', config: AppUsers.updateById },
    { method: 'POST', path: '/AppUsers/resetPasswordUser', config: AppUsers.resetPasswordUser },
    { method: 'POST', path: '/AppUsers/changePasswordUser', config: AppUsers.changePasswordUser },
    { method: 'POST', path: '/AppUsers/verify2FA', config: AppUsers.verify2FA },
    { method: 'GET', path: '/AppUsers/get2FACode', config: AppUsers.get2FACode },

    // AppDevices APIs
    { method: 'POST', path: '/AppDevices/insert', config: AppDevices.insert },
    { method: 'POST', path: '/AppDevices/getList', config: AppDevices.find },
    { method: 'POST', path: '/AppDevices/getDetailById', config: AppDevices.findById },
    { method: 'POST', path: '/AppDevices/updateById', config: AppDevices.updateById },
];
