/**
 * Created by A on 7/18/17.
 */
"use strict";
const AppDevicesResourceAccess = require("../resourceAccess/AppDevicesResourceAccess");

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let deviceData = req.payload;
      await AppDevicesResourceAccess.insert(deviceData);
      resolve("done");
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;

      let deviceList = await AppDevicesResourceAccess.find(filter, skip, limit, order);
      let deviceCount = await AppDevicesResourceAccess.count(filter, order);
      
      if (deviceList && deviceCount && deviceList.length > 0) {
        resolve({
          data: deviceList, 
          total: deviceCount[0].count,
        });
      } else {
        resolve({
          data: [], 
          total: 0,
        });
      }
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let updateResult = await AppDevicesResourceAccess.updateById(req.payload.id, req.payload.data);
      if (updateResult) {
        resolve(updateResult);
      } else {
        resolve({});
      }
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let deviceList = await AppDevicesResourceAccess.find({ commissionPolicyId: req.payload.id });
      if (deviceList) {
        resolve(deviceList[0]);
      } else {
        resolve({});
      }
      resolve("success");
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

module.exports = {
  insert,
  find,
  updateById,
  findById
};
