const PaymentServicePackage = require('./PaymentServicePackageRoute');
const PaymentServiceBonusPackage = require('./PaymentServiceBonusPackageRoute');
const UserPaymentServicePackageRoute = require('./UserPaymentServicePackageRoute');

module.exports = [
  { method: 'POST', path: '/PaymentServicePackage/insert', config: PaymentServicePackage.insert },
  { method: 'POST', path: '/PaymentServicePackage/updateById', config: PaymentServicePackage.updateById },
  { method: 'POST', path: '/PaymentServicePackage/find', config: PaymentServicePackage.find },
  { method: 'POST', path: '/PaymentServicePackage/findById', config: PaymentServicePackage.findById },
  { method: 'POST', path: '/PaymentServicePackage/deleteById', config: PaymentServicePackage.deleteById },
  { method: 'POST', path: '/PaymentServicePackage/user/getList', config: PaymentServicePackage.userGetListPaymentPackage },

  { method: 'POST', path: '/PaymentServicePackage/getListUserBuyPackage', config: UserPaymentServicePackageRoute.getListUserBuyPackage },
  { method: 'POST', path: '/PaymentServicePackage/user/getBalanceByUnitId', config: UserPaymentServicePackageRoute.userGetBalanceByUnitId },
  { method: 'POST', path: '/PaymentServicePackage/user/buyServicePackage', config: UserPaymentServicePackageRoute.buyServicePackage },
  { method: 'POST', path: '/PaymentServicePackage/user/getUserServicePackage', config: UserPaymentServicePackageRoute.getUserServicePackage },
  { method: 'POST', path: '/PaymentServicePackage/user/historyServicePackage', config: UserPaymentServicePackageRoute.historyServicePackage },
  { method: 'POST', path: '/PaymentServicePackage/user/activateServicePackage', config: UserPaymentServicePackageRoute.userActivateServicePackage },
  { method: 'POST', path: '/PaymentServicePackage/user/collectServicePackage', config: UserPaymentServicePackageRoute.userCollectServicePackage },

  { method: 'POST', path: '/PaymentServiceBonusPackage/insert', config: PaymentServiceBonusPackage.insert },
  { method: 'POST', path: '/PaymentServiceBonusPackage/updateById', config: PaymentServiceBonusPackage.updateById },
  { method: 'POST', path: '/PaymentServiceBonusPackage/find', config: PaymentServiceBonusPackage.find },
  { method: 'POST', path: '/PaymentServiceBonusPackage/findById', config: PaymentServiceBonusPackage.findById },
  { method: 'POST', path: '/PaymentServiceBonusPackage/deleteById', config: PaymentServiceBonusPackage.deleteById },
  { method: 'POST', path: '/PaymentServiceBonusPackage/user/getList', config: PaymentServiceBonusPackage.userGetListPaymentBonusPackage },
  { method: 'POST', path: '/PaymentServiceBonusPackage/user/claimBonusPackage', config: PaymentServiceBonusPackage.userClaimBonusPackage },
];