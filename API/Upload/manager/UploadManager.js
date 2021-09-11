/**
 * Created by A on 7/18/17.
 */
"use strict";
const UploadFunctions = require("../UploadFunctions");
const Logger = require('../../../utils/logging');

async function uploadChapterImage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      // booksChapterUrl: Joi.string(),
      const imageData = req.payload.booksImage;
      const imageFormat = req.payload.imageFormat;
      const booksChapterUrl = req.payload.booksChapterUrl;
      if (!imageData) {
        reject('do not have book data');
        return;
      }

      if (!booksChapterUrl) {
        reject('do not have book chapter url');
        return;
      }

      var originaldata = Buffer.from(imageData, 'base64');
      let newChapterImage = await UploadFunctions.uploadNewChapterImage(booksChapterUrl, originaldata, imageFormat);
      if (newChapterImage) {
        resolve(newChapterImage);
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
      let newChapterImage = await UploadFunctions.uploadMediaFile(originaldata, imageFormat);
      if (newChapterImage) {
        resolve(newChapterImage);
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
  uploadChapterImage,
  uploadUserAvatar
};
