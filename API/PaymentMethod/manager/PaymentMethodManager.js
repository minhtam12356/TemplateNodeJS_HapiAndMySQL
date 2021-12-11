"use strict";
const Logger = require('../../../utils/logging');
const PaymentMethodResourseAccess = require('../resourceAccess/PaymentMethodResourceAccess')

async function insert(req) {
    return new Promise(async (resolve, reject) => {
        let paymentMethodData = req.payload
        let result = await PaymentMethodResourseAccess.insert(paymentMethodData)
        if (result) {
            resolve(result)
        }
        reject("failed");
    })
}

async function find(req) {
    return new Promise(async (resolve, reject) => {
        let result = await PaymentMethodResourseAccess.find()
        if (result) {
            resolve(result)
        }
        reject("failed");
    })
}

async function updateById(req) {
    return new Promise(async (resolve, reject) => {
        let paymentMethodId = req.payload.id;
        let paymentMethodData = req.payload.data;
        let result = await PaymentMethodResourseAccess.updateById(paymentMethodId, paymentMethodData);
        if (result) {
            resolve(result)
        }
        reject("failed");
    })
}

async function deleteById(req) {
    return new Promise(async (resolve, reject) => {
        let paymentMethodId = req.payload.id;
        let result = await PaymentMethodResourseAccess.deleteById(paymentMethodId)
        if (result) {
            resolve(result)
        }
        reject("failed");
    })
}

module.exports = {
    insert,
    find,
    updateById,
    deleteById
}