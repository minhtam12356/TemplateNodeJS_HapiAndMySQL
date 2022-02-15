/**
 * Created by A on 7/18/17.
 */
"use strict";
const PaymentServicePackageResourceAccess = require("../resourceAccess/PaymentServicePackageResourceAccess");
const SystemConfiguration = require('../../SystemConfiguration/SystemConfigurationFunction');
const Logger = require('../../../utils/logging');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = req.payload;
      let result = await PaymentServicePackageResourceAccess.insert(data);
      if (result) {
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

      let paymentServices = await PaymentServicePackageResourceAccess.customSearch(filter, skip, limit, undefined, undefined, undefined, order);

      if (paymentServices) {
        //lay ti le quy doi Xu
        let _configuration = await SystemConfiguration.getSystemConfig();

        for (let i = 0; i < paymentServices.length; i++) {
          let promotionAmount = paymentServices[i].promotion; //<<so tien khuyen mai

          //neu so tien khuyen mai sai thi ko de khuyen mai
          if (promotionAmount === null || promotionAmount === undefined || promotionAmount <= 0) {
            promotionAmount = 0;
          }

          //cap nhat ti le quy doi xu cho tung goi cuoc
          paymentServices[i].exchangePoint = parseInt((paymentServices[i].rechargePackage / _configuration.exchangeRateCoin) * promotionAmount / 100);
        }

        let paymentServiceCount = await PaymentServicePackageResourceAccess.customCount(filter, undefined, undefined, undefined, order);
        resolve({ data: paymentServices, total: paymentServiceCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
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

      if (data.packageDiscountPrice !== undefined) {
        if (data.packageDiscountPrice.trim() === "") {
          data.packageDiscountPrice = null;
        } else {
          data.packageDiscountPrice = data.packageDiscountPrice * 1;
        }
      }

      if (data.packageDiscountPrice !== null && data.packageDiscountPrice < 1) {
        Logger.error(`invalid packageDiscountPrice`)
        reject("INVALID_DISCOUNT_PRICE");
        return;
      }

      let result = await PaymentServicePackageResourceAccess.updateById(id, data);
      if (result) {
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
      if (result) {
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
      if (result) {
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