/**
 * Created by A on 7/18/17.
 */
'use strict';
const Staff = require('../API/Staff/route/StaffRoute');
const Role = require('../API/Role/route/RoleRoute');
const Permission = require('../API/Permission/route/PermissionRoute');
const AppUsers = require('../API/AppUsers/route/AppUsersRoute');
const Maintain = require('../API/Maintain/route/MaintainRoute');
const Books = require('../API/Books/route/BooksRoute');
const BooksCategory = require('../API/BooksCategory/route/BooksCategoryRoute');
const Upload = require('../API/Upload/route/UploadRoute');

module.exports = [
    { method: 'POST', path: '/Maintain/maintainAll', config: Maintain.maintainAll },
    { method: 'POST', path: '/Maintain/maintainSignup', config: Maintain.maintainSignup },
    { method: 'POST', path: '/Maintain/maintainGoogleAds', config: Maintain.maintainGoogleAds },
    { method: 'POST', path: '/Maintain/getSystemStatus', config: Maintain.getSystemStatus },

    //Staff APIs
    { method: 'POST', path: '/Staff/loginStaff', config: Staff.loginStaff },
    { method: 'POST', path: '/Staff/registerStaff', config: Staff.registerStaff },
    { method: 'POST', path: '/Staff/updateStaffById', config: Staff.updateById },
    { method: 'POST', path: '/Staff/getListStaff', config: Staff.find },
    { method: 'POST', path: '/Staff/getDetailStaff', config: Staff.findById },
    { method: 'POST', path: '/Staff/resetPasswordStaff', config: Staff.resetPasswordStaff },
    { method: 'POST', path: '/Staff/changePasswordStaff', config: Staff.changePasswordStaff },

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
    //Customer Record APIs
    { method: 'POST', path: '/CustomerMessage/insert', config: CustomerMessage.insert },
    { method: 'POST', path: '/CustomerMessage/getList', config: CustomerMessage.find },
    { method: 'POST', path: '/CustomerMessage/getDetailById', config: CustomerMessage.findById },
    { method: 'POST', path: '/CustomerMessage/sendsms', config: CustomerMessage.sendsms },
    { method: 'POST', path: '/CustomerMessage/sendMessageByFilter', config: CustomerMessage.sendMessageByFilter },
    { method: 'POST', path: '/CustomerMessage/sendMessageByCustomerList', config: CustomerMessage.sendMessageByCustomerList },
    { method: 'POST', path: '/CustomerMessage/findTemplates', config: CustomerMessage.findTemplates },

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
    }
];
