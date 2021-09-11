/**
 * Created by A on 7/18/17.
 */
"use strict";

const fs = require('fs');

const Logger = require('../../utils/logging');

//Upload base64 image
//fileFormat: PNG, JPEG, MP4
async function uploadMediaFile(fileData, fileFormat = 'png') {
  return new Promise(async (resolve, reject) => {
    try {
      if (fileData) {
        //fake name with 64 ASCII chars 
        let fileName =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + "_" + new Date().toISOString()  + `.${fileFormat}`;
        const path = "uploads/" + fileName;
        fs.appendFile(path, fileData, (err) => {
          if (err) {
            throw err;
          }
          let newImageUrl = "https://" + process.env.HOST_NAME + '/uploads/' + fileName;
          resolve(newImageUrl);
       });
      }
    } catch (e) {
      Logger.error('UploadFunction', e);
      reject(undefined);
    }
  });
}

module.exports = {
  uploadMediaFile,
};
