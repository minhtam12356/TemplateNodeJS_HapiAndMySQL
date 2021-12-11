/**
 * Created by A on 7/18/17.
 */
'use strict';
const Staff = require('../API/Staff/route/StaffRoute');
const Role = require('../API/Role/route/RoleRoute');
const Permission = require('../API/Permission/route/PermissionRoute');
const AppUsers = require('../API/AppUsers/route/AppUsersRoute');
const AppUserRole = require('../API/AppUserRole/route/AppUserRoleRoute');
const AppUserPermission = require('../API/AppUserPermission/route/AppUserPermissionRoute');
// const Wallet                = require('../API/Wallet/route/WalletRoute');
const WithdrawTransaction   = require('../API/WithdrawTransaction/route/WithdrawTransactionRoute');

const Maintain = require('../API/Maintain/route/MaintainRoute');
const Books = require('../API/Books/route/BooksRoute');
const BooksCategory = require('../API/BooksCategory/route/BooksCategoryRoute');
const SystemConfig = require('../API/SystemConfigurations/route/SystemConfigurationsRoute');
const Upload = require('../API/Upload/route/UploadRoute');
const CustomerSchedule = require('../API/CustomerSchedule/route/CustomerScheduleRoute');
const CustomerRecord = require('../API/CustomerRecord/route/CustomerRecordRoute');
const CustomerMessage = require('../API/CustomerMessage/route/CustomerMessageRoute');
const Stations = require('../API/Stations/route/StationsRoute');
const StationIntro = require('../API/StationIntroduction/route/StationIntroductionRoute');
const StationNews = require('../API/StationNews/route/StationNewsRoute');
const CustomerStatistical = require('../API/CustomerStatistical/route/CustomerStatisticalRoute');
const AppDevices = require('../API/AppDevies/route/AppDevicesRoute');
const Download = require('../API/Download/route/DownloadRoute');

module.exports = [
    { method: 'POST', path: '/Maintain/maintainAll', config: Maintain.maintainAll },
    { method: 'POST', path: '/Maintain/maintainDeposit', config: Maintain.maintainDeposit },
    { method: 'POST', path: '/Maintain/maintainTransfer', config: Maintain.maintainTransfer },
    { method: 'POST', path: '/Maintain/maintainWithdraw', config: Maintain.maintainWithdraw },
    { method: 'POST', path: '/Maintain/maintainSignup', config: Maintain.maintainSignup },
    { method: 'POST', path: '/Maintain/getSystemStatus', config: Maintain.getSystemStatus },

    //WithdrawTransaction APIs
    { method: 'POST', path: '/WithdrawTransaction/insert', config: WithdrawTransaction.insert },
    { method: 'POST', path: '/WithdrawTransaction/getList', config: WithdrawTransaction.find },
    { method: 'POST', path: '/WithdrawTransaction/findByUser', config: WithdrawTransaction.findByUser },
    { method: 'POST', path: '/WithdrawTransaction/getDetailById', config: WithdrawTransaction.findById },
    { method: 'POST', path: '/WithdrawTransaction/summaryUser', config: WithdrawTransaction.summaryUser },

    //WithdrawTransaction APIs for staffs
    { method: 'POST', path: '/WithdrawTransaction/acceptRequest', config: WithdrawTransaction.staffAcceptRequest },
    { method: 'POST', path: '/WithdrawTransaction/rejectRequest', config: WithdrawTransaction.staffRejectRequest },
    { method: 'POST', path: '/WithdrawTransaction/summaryAll', config: WithdrawTransaction.summaryAll },
    //Staff APIs
    { method: 'POST', path: '/Staff/loginStaff', config: Staff.loginStaff },
    { method: 'POST', path: '/Staff/registerStaff', config: Staff.registerStaff },
    { method: 'POST', path: '/Staff/updateStaffById', config: Staff.updateById },
    { method: 'POST', path: '/Staff/getListStaff', config: Staff.find },
    { method: 'POST', path: '/Staff/getDetailStaff', config: Staff.findById },
    { method: 'POST', path: '/Staff/resetPasswordStaff', config: Staff.resetPasswordStaff },
    { method: 'POST', path: '/Staff/changePasswordStaff', config: Staff.changePasswordStaff },
    { method: 'POST', path: '/Staff/changePasswordUser', config: Staff.changePasswordUserStaff },

    // AppUsers APIs
    { method: 'POST', path: '/AppUsers/registerUser', config: AppUsers.registerUser },
    { method: 'POST', path: '/AppUsers/loginUser', config: AppUsers.loginUser },
    { method: 'POST', path: '/AppUsers/loginApple', config: AppUsers.loginApple },
    { method: 'POST', path: '/AppUsers/loginFacebook', config: AppUsers.loginFacebook },
    { method: 'POST', path: '/AppUsers/loginGoogle', config: AppUsers.loginGoogle },
    { method: 'POST', path: '/AppUsers/loginZalo', config: AppUsers.loginZalo },
    { method: 'POST', path: '/AppUsers/getListlUser', config: AppUsers.find },
    { method: 'POST', path: '/AppUsers/getDetailUserById', config: AppUsers.findById },
    { method: 'POST', path: '/AppUsers/updateUserById', config: AppUsers.updateById },
    { method: 'POST', path: '/AppUsers/resetPasswordUser', config: AppUsers.resetPasswordUser },
    { method: 'POST', path: '/AppUsers/changePasswordUser', config: AppUsers.changePasswordUser },
    { method: 'POST', path: '/AppUsers/verify2FA', config: AppUsers.verify2FA },
    { method: 'GET', path: '/AppUsers/get2FACode', config: AppUsers.get2FACode },

    // Station User APIs
    { method: 'POST', path: '/AppUsers/registerStationUser', config: AppUsers.registerStationUser },
    { method: 'POST', path: '/AppUsers/stationUserList', config: AppUsers.stationUserList },
    { method: 'POST', path: '/AppUsers/updateStationUserById', config: AppUsers.updateStationUserById },
    { method: 'POST', path: '/AppUsers/stationUserDetail', config: AppUsers.stationUserDetail },

    { method: 'POST', path: '/AppUserRole/find', config: AppUserRole.find },
    { method: 'POST', path: '/AppUserPermission/find', config: AppUserPermission.find },
    //Customer Record APIs
    { method: 'POST', path: '/CustomerRecord/insert', config: CustomerRecord.insert },
    
    { method: 'POST', path: '/CustomerRecord/getList', config: CustomerRecord.find },
    { method: 'POST', path: '/CustomerRecord/todayCustomerRecord', config: CustomerRecord.findToday },
    { method: 'POST', path: '/CustomerRecord/getDetailById', config: CustomerRecord.findById },
    { method: 'POST', path: '/CustomerRecord/updateById', config: CustomerRecord.updateById },
    { method: 'POST', path: '/CustomerRecord/deleteById', config: CustomerRecord.deleteById },
    { method: 'POST', path: '/CustomerRecord/exportExcel', config: CustomerRecord.exportExcelCustomerRecord },
    { method: 'POST', path: '/CustomerRecord/importExcel', config: CustomerRecord.importCustomerRecord },
    //BEWARE !! This API is use for robot
    { method: 'POST', path: '/CustomerRecord/robotInsert', config: CustomerRecord.robotInsert },

    //Customer Record APIs
    // { method: 'POST', path: '/CustomerMessage/insert', config: CustomerMessage.insert }, //no need to use this API
    { method: 'POST', path: '/CustomerMessage/getList', config: CustomerMessage.find },
    { method: 'POST', path: '/CustomerMessage/getDetailById', config: CustomerMessage.findById },
    // { method: 'POST', path: '/CustomerMessage/sendsms', config: CustomerMessage.sendsms }, //only open this API for testing
    { method: 'POST', path: '/CustomerMessage/sendMessageByFilter', config: CustomerMessage.sendMessageByFilter },
    { method: 'POST', path: '/CustomerMessage/sendMessageByCustomerList', config: CustomerMessage.sendMessageByCustomerList },
    { method: 'POST', path: '/CustomerMessage/findTemplates', config: CustomerMessage.findTemplates },

    //Station Record APIs
    { method: 'POST', path: '/Stations/insert', config: Stations.insert },
    { method: 'POST', path: '/Stations/getList', config: Stations.find },
    { method: 'POST', path: '/Stations/getDetailById', config: Stations.findById },
    { method: 'POST', path: '/Stations/getDetailByUrl', config: Stations.findByUrl },
    { method: 'POST', path: '/Stations/updateById', config: Stations.updateById },
    { method: 'POST', path: '/Stations/resetAllDefaultMp3', config: Stations.resetAllDefaultMp3 },
    { method: 'POST', path: '/Stations/updateConfigSMTP', config: Stations.updateConfigSMTP},
    { method: 'POST', path: '/Stations/updateConfigSMS', config: Stations.updateConfigSMS},
    { method: 'POST', path: '/Stations/updateCustomSMTP', config: Stations.updateCustomSMTP},
    { method: 'POST', path: '/Stations/updateCustomSMSBrand', config: Stations.updateCustomSMSBrand},
    { method: 'POST', path: '/Stations/enableAdsForStation', config: Stations.enableAdsForStation},
    { method: 'POST', path: '/Stations/updateLeftAdBanner', config: Stations.updateLeftAdBanner},
    { method: 'POST', path: '/Stations/updateRightAdBanner', config: Stations.updateRightAdBanner},
    
    //Additional Station modules
    { method: 'POST', path: '/StationIntroduction/updateStationIntro', config: StationIntro.updateById},
    { method: 'POST', path: '/StationIntroduction/stationIntroductionDetail', config: StationIntro.stationIntroductionDetail},

    //Station News APIs
    { method: 'POST', path: '/StationNews/insert', config: StationNews.insert },
    { method: 'POST', path: '/StationNews/getList', config: StationNews.find },
    { method: 'POST', path: '/StationNews/getDetailById', config: StationNews.findById },
    { method: 'POST', path: '/StationNews/updateById', config: StationNews.updateById },
    { method: 'POST', path: '/StationNews/getNewsList', config: StationNews.stationNewsList },
    { method: 'POST', path: '/StationNews/getHotNewsList', config: StationNews.stationNewsList },
    { method: 'POST', path: '/StationNews/getNewsDetail', config: StationNews.stationNewsDetail },
    { method: 'POST', path: '/StationNews/deleteById', config: StationNews.deleteById },

    //Role APIs
    { method: 'POST', path: '/Role/insert', config: Role.insert },
    { method: 'POST', path: '/Role/getList', config: Role.find },
    // { method: 'POST', path: '/Role/getDetailById', config: Role.findById },
    { method: 'POST', path: '/Role/updateById', config: Role.updateById },

    //Permission APIs
    // { method: 'POST', path: '/Permission/insert', config: Permission.insert },
    { method: 'POST', path: '/Permission/getList', config: Permission.find },
    // { method: 'POST', path: '/Permission/getDetailById', config: Permission.findById },
    // { method: 'POST', path: '/Permission/updateById', config: Permission.updateById },

    //Books APIs
    { method: 'POST', path: '/Books/insert', config: Books.insert },
    { method: 'POST', path: '/Books/getList', config: Books.find },
    { method: 'POST', path: '/Books/getDetailById', config: Books.findById },
    { method: 'POST', path: '/Books/updateById', config: Books.updateById },
    { method: 'POST', path: '/Books/bookDetail', config: Books.bookDetail },
    { method: 'POST', path: '/Books/bookList', config: Books.bookList },
    { method: 'POST', path: '/Books/summaryView', config: Books.summaryView },
    { method: 'POST', path: '/Books/searchBooks', config: Books.searchBooks },

    //Books Category APIs
    { method: 'POST', path: '/BooksCategory/insert', config: BooksCategory.insert },
    { method: 'POST', path: '/BooksCategory/getList', config: BooksCategory.find },
    { method: 'POST', path: '/BooksCategory/getDetailById', config: BooksCategory.findById },
    { method: 'POST', path: '/BooksCategory/updateById', config: BooksCategory.updateById },

    //Upload APIs
    { method: 'POST', path: '/Upload/uploadMediaFile', config: Upload.uploadMediaFile },
    {
        method: 'GET',
        path: '/{path*}',
        handler: function (request, h) {
            return h.file(`${request.params.path}`);
        }
    },
    { method: 'POST', path: '/Upload/uploadUserAvatar', config: Upload.uploadUserAvatar },
    //Download APIs
    { method: 'POST', path: '/Download/downloadBookReport', config: Download.downloadBookReport },
    {
        method: 'GET',
        path: '/downloads/{filename}',
        handler: function (request, h) {
            return h.file(`downloads/${request.params.filename}`);
        }
    },
    {
        method: 'GET',
        path: '/servertime',
        handler: function (request, h) {
            return h(new Date().toLocaleString());
        }
    },

    //Api CustomerSchedule
    { method: 'POST', path: '/CustomerSchedule/userInsertSchedule', config: CustomerSchedule.userInsertSchedule },
    { method: 'POST', path: '/CustomerSchedule/add', config: CustomerSchedule.insert },
    { method: 'POST', path: '/CustomerSchedule/update', config: CustomerSchedule.updateById },
    { method: 'POST', path: '/CustomerSchedule/findId', config: CustomerSchedule.findById },
    { method: 'POST', path: '/CustomerSchedule/list', config: CustomerSchedule.find },
    { method: 'POST', path: '/CustomerSchedule/delete', config: CustomerSchedule.deleteById },

    // API CustomerStatistical
    { method: 'POST', path: '/CustomerStatistical/report', config: CustomerStatistical.reportCustomer},
    { method: 'POST', path: '/CustomerStatistical/reportAllStation', config: CustomerStatistical.reportAllStation},

   // API AppDevices
   { method: 'POST', path: '/AppDevices/insert', config: AppDevices.insert},
   { method: 'POST', path: '/AppDevices/findById', config: AppDevices.findById},
   { method: 'POST', path: '/AppDevices/find', config: AppDevices.find},
   { method: 'POST', path: '/AppDevices/UpdateById', config: AppDevices.updateById},
   { method: 'POST', path: '/AppDevices/deleteById', config: AppDevices.deleteById},
    //API for System Configurations
    { method: 'POST', path: '/SystemConfigurations/updateById', config: SystemConfig.updateById },
    { method: 'POST', path: '/SystemConfigurations/findById', config: SystemConfig.findById },
];
