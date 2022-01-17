/**
 * Created by A on 7/18/17.
 */
'use strict';
// User Modules
const AppUsers = require('../API/AppUsers/route/AppUsersRoute');
const Wallet = require('../API/Wallet/route/WalletRoute');
const WalletBalanceUnit = require('../API/WalletBalanceUnit/route');

//Staff modules
const Staff = require('../API/Staff/route/StaffRoute');
const Role = require('../API/Role/route/RoleRoute');
const Permission = require('../API/Permission/route/PermissionRoute');

//System & Utilites modules
const Maintain = require('../API/Maintain/route/MaintainRoute');
const Upload = require('../API/Upload/route/UploadRoute');
const SystemConfiguration = require('../API/SystemConfiguration/route');


//Payment modules
const PaymentMethod = require('../API/PaymentMethod/route');
const PaymentServicePackage = require('../API/PaymentServicePackage/route');
const PaymentRecord = require('../API/PaymentRecord/route/PaymentRecordRoute');
const PaymentDepositTransaction = require('../API/PaymentDepositTransaction/route');
const PaymentWithdrawTransaction = require('../API/PaymentWithdrawTransaction/route');
const PaymentExchangeTransaction = require('../API/PaymentExchangeTransaction/route');

//Dashboard modules 
const Statistical = require('../API/Statistical/route');

// Bet Records
const BetRecords = require('../API/BetRecords/route');

  //WalletBalanceUnit
var APIs = [
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
  /* ***************USER MODULES**************** */
  // AppUsers APIs
  { method: 'POST', path: '/AppUsers/registerUser', config: AppUsers.registerUser },
  { method: 'POST', path: '/AppUsers/registerUserByPhone', config: AppUsers.registerUserByPhone },
  { method: 'POST', path: '/AppUsers/loginUser', config: AppUsers.loginUser },
  { method: 'POST', path: '/AppUsers/loginByPhone', config: AppUsers.loginByPhone },
  { method: 'POST', path: '/AppUsers/loginApple', config: AppUsers.loginApple },
  { method: 'POST', path: '/AppUsers/loginFacebook', config: AppUsers.loginFacebook },
  { method: 'POST', path: '/AppUsers/loginGoogle', config: AppUsers.loginGoogle },
  { method: 'POST', path: '/AppUsers/loginZalo', config: AppUsers.loginZalo },
  { method: 'POST', path: '/AppUsers/find', config: AppUsers.find },
  { method: 'POST', path: '/AppUsers/getDetailUserById', config: AppUsers.userGetDetailById },
  { method: 'POST', path: '/AppUsers/findById', config: AppUsers.findById },
  { method: 'POST', path: '/AppUsers/updateUserById', config: AppUsers.updateById },
  { method: 'POST', path: '/AppUsers/changePasswordUser', config: AppUsers.changePasswordUser },
  { method: 'POST', path: '/AppUsers/updateInfoUser', config: AppUsers.userUpdateInfo },
  { method: 'POST', path: '/AppUsers/verify2FA', config: AppUsers.verify2FA },
  { method: 'GET', path: '/AppUsers/get2FACode', config: AppUsers.get2FACode },
  { method: 'POST', path: '/AppUsers/verifyInfoUser', config: AppUsers.verifyInfoUser },
  { method: 'POST', path: '/AppUsers/rejectInfoUser', config: AppUsers.rejectInfoUser },
  { method: 'POST', path: '/AppUsers/getUsersByMonth', config: AppUsers.getUsersByMonth },
  { method: 'POST', path: '/AppUsers/uploadImageIdentityCardBefore', config: AppUsers.uploadIdentityCardBefore },
  { method: 'POST', path: '/AppUsers/uploadImageIdentityCardAfter', config: AppUsers.uploadIdentityCardAfter },
  { method: 'POST', path: '/AppUsers/submitImageIdentityCard', config: AppUsers.submitIdentityCardImage },
  { method: 'POST', path: '/AppUsers/uploadAvatar', config: AppUsers.uploadAvatar },
  { method: 'POST', path: '/AppUsers/exportExcel', config: AppUsers.exportExcelFile },
  { method: 'POST', path: '/AppUsers/forgotPassword', config: AppUsers.forgotPassword },
  { method: 'POST', path: '/AppUsers/forgotPasswordOTP', config: AppUsers.forgotPasswordOTP },
  { method: 'POST', path: '/AppUsers/verifyEmailUser', config: AppUsers.verifyEmailUser },
  { method: 'POST', path: '/AppUsers/userResetPassword', config: AppUsers.resetPasswordBaseOnToken },
  { method: 'POST', path: '/AppUsers/adminResetPasswordUser', config: AppUsers.adminResetPasswordUser },
  { method: 'POST', path: '/AppUsers/sendMailToVerifyEmail', config: AppUsers.sendMailToVerify },
  { method: 'POST', path: '/AppUsers/adminChangePasswordUser', config: AppUsers.adminChangePasswordUser },
  { method: 'POST', path: '/AppUsers/adminChangeSecondaryPasswordUser', config: AppUsers.adminChangeSecondaryPasswordUser },
  
  {
    method: 'GET', //This API use to load QRCode of user
    path: '/images/{filename}',
    handler: function (request, h) {
        return h.file(`images/${request.params.filename}`);
    }
  },
  /* ********************STAFF MODULES***************** */
  //Staff APIs
  { method: 'POST', path: '/Staff/loginStaff', config: Staff.loginStaff },
  { method: 'POST', path: '/Staff/registerStaff', config: Staff.registerStaff },
  { method: 'POST', path: '/Staff/updateStaffById', config: Staff.updateById },
  { method: 'POST', path: '/Staff/deleteStaffById', config: Staff.deleteById },
  { method: 'POST', path: '/Staff/getListStaff', config: Staff.find },
  { method: 'POST', path: '/Staff/insertStaff', config: Staff.insert },
  { method: 'POST', path: '/Staff/getDetailStaff', config: Staff.findById },
  { method: 'POST', path: '/Staff/resetPasswordStaff', config: Staff.resetPasswordStaff },
  { method: 'POST', path: '/Staff/changePasswordStaff', config: Staff.changePasswordStaff },

  //Role APIs
  { method: 'POST', path: '/Role/insert', config: Role.insert },
  { method: 'POST', path: '/Role/getList', config: Role.find },
  // { method: 'POST', path: '/Role/getDetailById', config: Role.findById }, //currently disable - no need
  { method: 'POST', path: '/Role/updateById', config: Role.updateById },

  //Permission APIs
  // { method: 'POST', path: '/Permission/insert', config: Permission.insert },//currently disable - no need
  { method: 'POST', path: '/Permission/getList', config: Permission.find },
  // { method: 'POST', path: '/Permission/getDetailById', config: Permission.findById },//currently disable - no need
  // { method: 'POST', path: '/Permission/updateById', config: Permission.updateById },//currently disable - no need

  /******************System & Utilites modules */

  //Maintain APIs
  { method: 'POST', path: '/Maintain/maintainAll', config: Maintain.maintainAll },
  { method: 'POST', path: '/Maintain/maintainSignup', config: Maintain.maintainSignup },
  { method: 'POST', path: '/Maintain/getSystemStatus', config: Maintain.getSystemStatus },

  /****************PAYMENT MODULES ****************/


];

APIs = APIs.concat(WalletBalanceUnit);

APIs = APIs.concat(BetRecords);

APIs = APIs.concat(PaymentMethod);
APIs = APIs.concat(PaymentServicePackage);
APIs = APIs.concat(PaymentWithdrawTransaction);
APIs = APIs.concat(PaymentDepositTransaction);
APIs = APIs.concat(PaymentExchangeTransaction);

APIs = APIs.concat(Statistical);

APIs = APIs.concat(SystemConfiguration);

module.exports = APIs;
