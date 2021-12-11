const CommonPlaceResourceAccess = require("../../CommonPlace/resourceAccess/CommonPlaceResourceAccess");

const Logger = require('../../../utils/logging');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = req.payload;
      let result = await CommonPlaceResourceAccess.insert(data);
      if (result) {
        resolve(result);
      } else {
        reject("Cannot insert data");
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

async function getCommonPlace(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let order = req.payload.order;
      let limit = req.payload.limit;
      let result = await CommonPlaceResourceAccess.customSearch(filter, skip, limit, order);
      let resultCount = await CommonPlaceResourceAccess.customCount(filter, order);
      if (result && resultCount) {
        resolve({ data: result, total: resultCount[0].count });
      } else {
        reject("Cannot find data");
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let order = req.payload.order;
      let limit = req.payload.limit;
      let result = await CommonPlaceResourceAccess.customSearch(filter, skip, limit, order);
      let resultCount = await CommonPlaceResourceAccess.customCount(filter, order);
      if (result && resultCount) {
        resolve({ data: result, total: resultCount[0].count });
      } else {
        reject("Cannot find data");
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = req.payload.data;
      let id = req.payload.CommonPlaceId;
      let result = await CommonPlaceResourceAccess.updateById(id, data);
      if (result) {
        resolve("OK");
      } else {
        reject("Cannot update data");
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.CommonPlaceId;
      let result = await CommonPlaceResourceAccess.updateById(id, { isDeleted: 1 });
      if (result) {
        resolve("OK");
      } else {
        reject("Cannot update data");
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

module.exports = {
  getCommonPlace,
  find,
  updateById,
  deleteById,
  insert
}
