/**
 * Created by A on 7/18/17.
 */
'use strict';
const WithdrawTransactionResource = require('./resourceAccess/WithdrawTransactionResourceAccess');
const WalletResourceAccess = require('../Wallet/resourceAccess/WalletResourceAccess');

const { WITHDRAW_TRX_STATUS } = require('./WithdrawTransactionConstant');

async function acceptWithdrawRequest(transactionRequestId) {
  let transaction = await WithdrawTransactionResource.find({ withdrawTransactionId: transactionRequestId });
  if (transaction === undefined || transaction.length < 1) {
    console.error(`Can not acceptWithdrawRequest ${transactionRequestId}`);
    return undefined;
  }
  transaction = transaction[0];

  if (transaction.status === WITHDRAW_TRX_STATUS.COMPLETED || transaction.status === WITHDRAW_TRX_STATUS.CANCELED || transaction.status === WITHDRAW_TRX_STATUS.DELETED) {
    console.error(`already acceptWithdrawRequest ${transactionRequestId}`);
    return undefined;
  }

  //update transaction status
  transaction.status = WITHDRAW_TRX_STATUS.COMPLETED;
  transaction.note = transaction.note + '\r\n' + `xac nhan giao dich ${new Date().toISOString()}`
  let updateResult = await WithdrawTransactionResource.updateById(transactionRequestId, transaction);
  if (updateResult) {
    return updateResult;
  } else {
    return undefined;
  }
}

async function rejectWithdrawRequest(transactionRequestId) {
  let transaction = await WithdrawTransactionResource.find({ withdrawTransactionId: transactionRequestId });
  if (transaction === undefined || transaction.length < 1) {
    console.error(`Can not rejectWithdrawRequest ${transactionRequestId}`);
    return undefined;
  }
  transaction = transaction[0];

  if (transaction.status === WITHDRAW_TRX_STATUS.COMPLETED || transaction.status === WITHDRAW_TRX_STATUS.CANCELED || transaction.status === WITHDRAW_TRX_STATUS.DELETED) {
    console.error(`already rejectWithdrawRequest ${transactionRequestId}`);
    return undefined;
  }
  let wallet = await WalletResourceAccess.find({ walletId: transaction.walletId });
  if (wallet === undefined || wallet.length < 1) {
    console.error(`Can not find wallet ${transaction.walletId} for transaction ${transactionRequestId}`);
    return undefined;
  }
  wallet = wallet[0];

  wallet.balance = wallet.balance + transaction.pointAmount;
  await WalletResourceAccess.updateBalanceTransaction([wallet]);

  //update transaction status
  transaction.status = WITHDRAW_TRX_STATUS.CANCELED;
  transaction.note = transaction.note + '\r\n' + `huy giao dich ${new Date().toISOString()}`
  let updateResult = await WithdrawTransactionResource.updateById(transactionRequestId, transaction);
  if (updateResult) {
    return updateResult;
  } else {
    return undefined;
  }
}

async function createWithdrawRequest(user, amount) {
  const MIN_PERSIST_AMOUNT = process.env.MIN_PERSIST_AMOUNT | 0;
  if (user.userId === undefined) {
    return undefined;
  }
  let wallet = await WalletResourceAccess.find({ userId: user.userId });
  if (!wallet || wallet.length < 1) {
    console.error("user wallet is invalid");
    return undefined;
  }
  wallet = wallet[0];

  if (wallet.balance - amount - MIN_PERSIST_AMOUNT < 0) {
    console.error("wallet do not have enough amount");
    return undefined;
  }

  let pointBegin = wallet.balance;
  let transactionData = {
    userId: user.userId,
    walletid: wallet.walletId,
    pointAmount: amount,
    pointBegin: pointBegin,
    pointEnd: pointBegin - amount,
    sotaikhoan: user.sotaikhoan,
    tentaikhoan: user.tentaikhoan,
    tennganhang: user.tennganhang,
    note: `${user.tennganhang} \r\n ${user.sotaikhoan} \r\n ${user.tentaikhoan}`,
    ethBegin: 0, //add to pass db validation
    ethEnd: 0 //add to pass db validation
  };

  if (user.referUserId) {
    transactionData.referId = user.referUserId;
  }

  await WalletResourceAccess.incrementBalance(wallet.walletId, amount * -1);
  let result = await WithdrawTransactionResource.insert(transactionData);

  if (result) {
    return result;
  } else {
    console.error("insert withdraw trx error");
    return undefined;
  }

}
module.exports = {
  acceptWithdrawRequest,
  rejectWithdrawRequest,
  createWithdrawRequest
}