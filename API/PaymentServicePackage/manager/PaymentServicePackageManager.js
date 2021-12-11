/**
 * Created by A on 7/18/17.
 */
 "use strict";
 const PaymentServicePackageResourceAccess = require("../resourceAccess/PaymentServicePackageResourceAccess");
 const Logger = require('../../../utils/logging');

 async function insert(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = req.payload;
        let result = await PaymentServicePackageResourceAccess.insert(data);
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
  
        let paymentServices = await PaymentServicePackageResourceAccess.find(filter, skip, limit, order);
        let paymentServiceCount = await PaymentServicePackageResourceAccess.count(filter, order);
        if (paymentServices && paymentServiceCount) {
          resolve({data: paymentServices, total: paymentServiceCount[0].count});
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
        let id = req.payload.id;
        let data = req.payload.data;
        let result = await PaymentServicePackageResourceAccess.updateById(id, data);
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
         let id = req.payload.id;
         let result = await PaymentServicePackageResourceAccess.deleteById(id);
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
        let id = req.payload.id;
        let result = await PaymentServicePackageResourceAccess.findById(id);
        if(result) {
            resolve(result);
        } else {
            reject('failed to get item');
        }
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