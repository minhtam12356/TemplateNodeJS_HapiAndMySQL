/**
 * Created by A on 7/18/17.
 */
'use strict';

const crypto = require("crypto");
const otplib = require('otplib');

const AppUsersResourceAccess = require("./resourceAccess/AppUsersResourceAccess");
const QRCodeFunction = require('../../ThirdParty/QRCode/QRCodeFunctions');
const TokenFunction = require('../ApiUtils/token');
const Logger = require('../../utils/logging');

/** Gọi ra để sử dụng đối tượng "authenticator" của thằng otplib */
const { authenticator } = otplib
/** Tạo secret key ứng với từng user để phục vụ việc tạo otp token.
  * Lưu ý: Secret phải được gen bằng lib otplib thì những app như
    Google Authenticator hoặc tương tự mới xử lý chính xác được.
  * Các bạn có thể thử để linh linh cái secret này thì đến bước quét mã QR sẽ thấy có lỗi ngay.
*/
const generateUniqueSecret = () => {
    return authenticator.generateSecret()
}

/** Tạo mã OTP token */
const generateOTPToken = (username, serviceName, secret) => {
    return authenticator.keyuri(username, serviceName, secret)
}

function hashPassword(password) {
    const hashedPassword = crypto
        .createHmac("sha256", "ThisIsSecretKey")
        .update(password)
        .digest("hex");
    return hashedPassword;
}

function unhashPassword(hash) {
    const pass = cryptr.decrypt(hash);
    return pass;
}

function verifyUniqueUser(req, res) {
    // Find an entry from the database that
    // matches either the email or username
}

async function verifyCredentials(username, password) {
    let hashedPassword = hashPassword(password);
    // Find an entry from the database that
    // matches either the email or username
    let verifyResult = await AppUsersResourceAccess.find({
        username: username,
        password: hashedPassword
    });

    if (verifyResult && verifyResult.length > 0) {
        let foundUser = verifyResult[0];
        
        //create new login token
        let token = TokenFunction.createToken(foundUser);
        foundUser.token = token;

        return foundUser
    } else {
        return undefined;
    }
}

async function retrieveUserDetail(appUserId) {
    //get user detial
    let user = await AppUsersResourceAccess.find({ appUserId: appUserId });
    if (user && user.length > 0) {
        let foundUser = user[0];
        //create new login token
        let token = TokenFunction.createToken(foundUser);
        foundUser.token = token;
        return foundUser
    }

    return undefined;
}

async function changeUserPassword(userData, newPassword) {
    let newHashPassword = hashPassword(newPassword);

    let result = await AppUsersResourceAccess.updateById(userData.appUserId, { password: newHashPassword });

    if (result) {
        return result;
    } else {
        return undefined;
    }
}

async function generate2FACode(appUserId) {
    // đây là tên ứng dụng của các bạn, nó sẽ được hiển thị trên app Google Authenticator hoặc Authy sau khi bạn quét mã QR
    const serviceName = process.env.HOST_NAME || 'trainingdemo.makefamousapp.com';

    let user = await AppUsersResourceAccess.find({ appUserId: appUserId });

    if (user && user.length > 0) {
        user = user[0];

        // Thực hiện tạo mã OTP
        let topSecret = "";
        if (user.twoFACode || (user.twoFACode !== "" && user.twoFACode !== null)) {
            topSecret = user.twoFACode;
        } else {
            topSecret = generateUniqueSecret();
        }

        const otpAuth = generateOTPToken(user.username, serviceName, topSecret)
        const QRCodeImage = await QRCodeFunction.createQRCode(otpAuth)

        if (QRCodeImage) {
            await AppUsersResourceAccess.updateById(appUserId, {
                twoFACode: topSecret,
                twoFAQR: process.env.HOST_NAME + `/User/get2FACode?appUserId=${appUserId}`
            })
            return QRCodeImage;
        }
    }
    return undefined;
}

/** Kiểm tra mã OTP token có hợp lệ hay không
 * Có 2 method "verify" hoặc "check", các bạn có thể thử dùng một trong 2 tùy thích.
*/
const verify2FACode = (token, topSecret) => {
    return authenticator.check(token, topSecret)
}

async function createNewUser(userData) {
    return new Promise(async (resolve, reject) => {
        try {
            //hash password
            userData.password = hashPassword(userData.password);

            //create new user
            let addResult = await AppUsersResourceAccess.insert(userData);
            if (addResult === undefined) {
                reject("can not insert user");
                return;
            } else {
                let newUserId = addResult[0];
                await generate2FACode(newUserId);
                let userDetail = retrieveUserDetail(newUserId);
                resolve(userDetail);
            }
            return;
        } catch (e) {
            Logger.error('AppUserFunctions', e);
            reject("failed");
        }
    });
}

module.exports = {
    verifyUniqueUser,
    verifyCredentials,
    hashPassword,
    unhashPassword,
    retrieveUserDetail,
    changeUserPassword,
    generate2FACode,
    verify2FACode,
    createNewUser
}