/**
 * Created by A on 7/18/17.
 */
 "use strict";
 const AreaStreet = require("../resourceAccess/AreaStreetResourceAccess");
 const Logger = require('../../../utils/logging');

 async function insert(req) {
   return new Promise(async (resolve, reject) => {
     try {
       let streetData = req.payload;
       streetData.AreaStreetKey = streetData.AreaStreetKey.toUpperCase(); 
       let result = await AreaStreet.insert(streetData);
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

       if(filter && filter.AreaStreetKey) {
        filter.AreaStreetKey = filter.AreaStreetKey.toUpperCase();
       }
       let wards = await AreaStreet.customSearch(filter, skip, limit, order);
       let wardsCount = await AreaStreet.customCount(filter, order);
       if (wards && wardsCount) {
         resolve({data: wards, total: wardsCount[0].count});
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
       let streetId = req.payload.id;
       let streetData = req.payload.data;
       if(streetData.AreaStreetKey) {
        streetData.AreaStreetKey = streetData.AreaStreetKey.toUpperCase();
       }
       let result = await AreaStreet.updateById(streetId, streetData);
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
      let streetId = req.payload.id;
      let result = await AreaStreet.updateById(streetId, {isDeleted: 1});
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
 