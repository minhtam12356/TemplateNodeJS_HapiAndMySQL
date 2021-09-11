/**
 * Created by A on 7/18/17.
 */
"use strict";

const fs = require('fs');

const Logger = require('../../utils/logging');
const BooksChapterResource = require('../BooksChapter/resourceAccess/BooksChapterView');
const BooksResource = require('../Books/resourceAccess/BooksResourceAccess');
const BooksImageResource = require('../BooksImage/resourceAccess/BooksImageResourceAccess');

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

async function uploadNewChapterImage(booksChapterUrl, imageData, imageFormat) {
  let targetChapter = await BooksChapterResource.find({booksChapterUrl: booksChapterUrl}, 0, 1);
  if (!targetChapter || targetChapter.length < 1) {
    reject('can not find chapter');
    return undefined;
  }
  targetChapter = targetChapter[0];

  let newImageUrl = await uploadMediaFile(imageData, imageFormat);
  if (!newImageUrl) {
    reject('upload failed')
    return undefined;
  }

  let imageCounter = BooksImageResource.find({booksChapterId: booksChapterId});
  let newBookImage = await BooksImageResource.insert({
    booksImageUrl: newImageUrl,
    booksChapterId: targetChapter.booksChapterId,
    booksImageIndex: (imageCounter && imageCounter.length) ? imageCounter.length : 0 
  });

  if (!newBookImage) {
    reject('store image to db failed');
    fs.rm(newImagePath);
    return undefined;
  }

  return {
    booksImageUrl: newImageUrl
  }
}

module.exports = {
  uploadMediaFile,
  uploadNewChapterImage
};
