/**
 * Created by A on 7/18/17.
 */
"use strict";
const UploadFunctions = require("../UploadFunctions");
const AppUsersResourceAccess = require('../../AppUsers/resourceAccess/AppUsersResourceAccess');
const Logger = require('../../../utils/logging');

async function uploadMediaFile(req) {
  return new Promise(async (resolve, reject) => {
    try {
      // booksChapterUrl: Joi.string(),
      const imageData = req.payload.imageData;
      const imageFormat = req.payload.imageFormat;
      
      if (!imageData) {
        reject('do not have book data');
        return;
      }

      var originaldata = Buffer.from(imageData, 'base64');
      let newMediaUrl = await UploadFunctions.uploadMediaFile(originaldata, imageFormat);
      if (newMediaUrl) {
        resolve(newMediaUrl);
      } else {
        reject('failed to upload')
      }
      
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

async function uploadUserAvatar(req) {
  return new Promise(async (resolve, reject) => {
    try {
      // booksChapterUrl: Joi.string(),
      const imageData = req.payload.image;
      const imageFormat = req.payload.imageFormat;
      const appUserId = req.currentUser.appUserId;

      if (!imageData) {
        reject('do not have book data');
        return;
      }

      if (!appUserId) {
        reject('do not have user id');
        return;
      }

      var originaldata = Buffer.from(imageData, 'base64');
      let newAvatar = await UploadFunctions.uploadMediaFile(originaldata, imageFormat);
      if (newAvatar) {
        let updateResult = await AppUsersResourceAccess.updateById(appUserId, {
          userAvatar: newAvatar
        });
        if (updateResult) {
          resolve(newAvatar);
        } else {
          reject('failed to save new avatar')
        }
        
      } else {
        reject('failed to upload')
      }
      
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

module.exports = {
  uploadMediaFile,
  uploadUserAvatar
};
