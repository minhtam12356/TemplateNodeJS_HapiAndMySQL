const Logger = require('../../../utils/logging');
const StatisticalFunctions = require('../StatisticalFunctions');

async function generalReport(req) {
  let endDate = req.payload.endDate;
  let startDate = req.payload.startDate;

  return new Promise(async (resolve, reject) => {

    let reportData = {
      totalUsers: 0, //<< tong so luong user
      totalNewUsers: 0, //<< tong so luong new user 
      totalServicePackage: 0, //<< tong so luong goi cuoc
      totalWalletBalanceUnit: 0, //<< tong so luong dong coin
      totalUserPaymentDepositAmount: 0, //<< tong so tien nap cua user 
      totalUserPaymentWithdrawAmount: 0, //<< tong so tien rut cua user 
      totalUserPaymentServiceAmount: 0, //<< tong so tien user da su dung
      totalUserSellRecord: 0, //<< tong so tien hoa hong da thanh toan
      summaryWalletBalanceUnit: [],
      summaryUserPaymentServicePackage: []
    };
    try {
      let promiseList = [];
      let promisetotalUsers = StatisticalFunctions.countTotalUser();
      promiseList.push(promisetotalUsers);

      let promisetotalNewUsers = StatisticalFunctions.countTotalNewUsers(startDate, endDate);
      promiseList.push(promisetotalNewUsers);

      let promisetotalServicePackage = StatisticalFunctions.countTotalServicePackage();
      promiseList.push(promisetotalServicePackage);

      let promisetotalWalletBalanceUnit = StatisticalFunctions.countTotalBalanceUnit();
      promiseList.push(promisetotalWalletBalanceUnit);

      let promisetotalUserPaymentDepositAmount = StatisticalFunctions.sumTotalUserPaymentDeposit(startDate, endDate);
      promiseList.push(promisetotalUserPaymentDepositAmount);

      let promisetotalUserPaymentWithdrawAmount = StatisticalFunctions.sumTotalUserPaymentWithdraw(startDate, endDate);
      promiseList.push(promisetotalUserPaymentWithdrawAmount);

      let promisetotalUserPaymentServiceAmount = StatisticalFunctions.sumTotalUserPaymentService(startDate, endDate);
      promiseList.push(promisetotalUserPaymentServiceAmount);

      let promisetotalUserComission = StatisticalFunctions.sumTotalUserSellRecord(startDate, endDate);
      promiseList.push(promisetotalUserComission);

      let promisesummaryWalletBalanceUnit = StatisticalFunctions.summaryWalletBalanceUnit(startDate, endDate);
      promiseList.push(promisesummaryWalletBalanceUnit);

      let promisesummaryUserPaymentServicePackage = StatisticalFunctions.summaryUserPaymentServicePackage(startDate, endDate);
      promiseList.push(promisesummaryUserPaymentServicePackage);

      Promise.all(promiseList).then((values) => {
        reportData.totalUsers = values[0];
        reportData.totalNewUsers = values[1];
        reportData.totalServicePackage = values[2];
        reportData.totalWalletBalanceUnit = values[3];
        reportData.totalUserPaymentDepositAmount = values[4];
        reportData.totalUserPaymentWithdrawAmount = values[5];
        reportData.totalUserPaymentServiceAmount = values[6];
        reportData.totalUserSellRecord = values[7];
        reportData.summaryWalletBalanceUnit = values[8];
        reportData.summaryUserPaymentServicePackage = values[9];
        resolve(reportData);
      });

    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  })
}

async function summaryUserPayment(req) {
  let endDate = req.payload.endDate;
  let startDate = req.payload.startDate;
  let appUserId = req.payload.appUserId;

  return new Promise(async (resolve, reject) => {
    try {
      let summaryUserPaymentResult = StatisticalFunctions.summaryUserPayment(appUserId, startDate, endDate);
      if (summaryUserPaymentResult) {
        resolve(summaryUserPaymentResult);
      } else {
        resolve({});
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  })
}

async function userSummaryReferUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      // let referData = {
      //   totalWithdraw: 100,
      //   totalDeposit: 200,
      //   totalBuy: 300,
      //   totalSell: 400,
      // };
      
      // let data = [];
      // referData.appUserId = 1;
      // referData.username = "username1";
      // data.push(referData);
      // referData.appUserId = 2;
      // referData.username = "username2";
      // data.push(referData);
      // referData.appUserId = 3;
      // referData.username = "username3";
      // data.push(referData);
      // referData.appUserId = 4;
      // referData.username = "username4";
      // data.push(referData);

      let skip = req.payload.skip;
      let limit = req.payload.limit;

      let data = await StatisticalFunctions.summaryReferUser(req.currentUser.appUserId, skip, limit);
      
      if (data) {
        resolve({ 
          data: data.summaryData, 
          total: data.summaryCountTotal,
          totalDeposit: data.summaryTotalDeposit,
          totalWithdraw: data.summaryTotalWithdraw,
          totalBuy: data.summaryTotalBuy,
          totalSell: data.summaryTotalSell,
        });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};


module.exports = {
  generalReport,
  summaryUserPayment,
  userSummaryReferUser
}