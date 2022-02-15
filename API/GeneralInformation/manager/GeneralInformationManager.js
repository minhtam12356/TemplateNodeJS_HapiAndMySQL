/**
 * Created by Huu on 11/18/21.
 */

"use strict";
const GeneralInformationResourceAccess = require("../resourceAccess/GeneralInformationResourceAccess");
const Logger = require("../../../utils/logging");

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await GeneralInformationResourceAccess.find();
      if (data) {
        resolve({ data: data });
      } else {
        resolve({ data: []});
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = req.payload.data;
      let information = await GeneralInformationResourceAccess.find();
      if(information) {
        let id = information[0].generalInformationId;
        let result = await GeneralInformationResourceAccess.updateById(id, data);
        if (result) {
          resolve(result);
        }
        reject("failed");
      }
      reject("failed");
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
}

module.exports = {
  find,
  updateById,
};
