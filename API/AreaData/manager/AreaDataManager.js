/**
 * Created by A on 7/18/17.
 */
 "use strict";
 const AreaDataResourceAccess = require("../resourceAccess/AreaDataResourceAccess");
 const Logger = require('../../../utils/logging');

 async function insert(req) {
   return new Promise(async (resolve, reject) => {
     try {
       let areaData = req.payload;
       areaData.AreaDataType = areaData.AreaDataType.toUpperCase();
      let findPrevData = await AreaDataResourceAccess.find({
        "AreaDataType": areaData.AreaDataType
      }, 0, 1, {
        "key": "createdAt",
        "value": "desc"
      });
      // get last number ... WARD"1"
       const prevAreaDataKey = findPrevData[0].AreaDataKey 
       const nextNumber = parseInt(prevAreaDataKey.split(areaData.AreaDataType)[1]) + 1;
       const newAreaDataKey = areaData.AreaDataType + nextNumber.toString();
       areaData.AreaDataKey = newAreaDataKey;
       let result = await AreaDataResourceAccess.insert(areaData);
       if(result){
        resolve(result);
       }
       reject("failed");
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
       let limit = req.payload.limit;
       let order = req.payload.order;
 
       let areas = await AreaDataResourceAccess.customSearch(filter, skip, limit, order);
       let areasCount = await AreaDataResourceAccess.customCount(filter, order);
       if (areas && areasCount) {
         resolve({data: areas, total: areasCount[0].count});
       }else{
         resolve({data: [], total: 0 });
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
       let areaId = req.payload.id;
       let areaData = req.payload.data;
       let result = await AreaDataResourceAccess.updateById(areaId, areaData);
       if(result){
         resolve(result);
       }
       reject("failed");
     } catch (e) {
       Logger.error(__filename, e);
       reject("failed");
     }
   });
 };
 
  async function deleteById(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let areaId = req.payload.id;
        let result = await AreaDataResourceAccess.updateById(areaId, {isDeleted: 1});
        if(result){
          resolve(result);
        }
        reject("failed");
      } catch (e) {
        Logger.error(__filename, e);
        reject("failed");
      }
    });
  };

 async function findById(req) {
   return new Promise(async (resolve, reject) => {
     try {
       resolve("success");
     } catch (e) {
       Logger.error(__filename, e);
       reject("failed");
     }
   });
 };
 
 module.exports = {
   insert,
   find,
   updateById,
   deleteById,
   findById
 };
 