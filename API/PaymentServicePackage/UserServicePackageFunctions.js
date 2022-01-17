const moment = require('moment');

const WalletResource = require('../Wallet/resourceAccess/WalletResourceAccess');
const AppUserResource = require('../AppUsers/resourceAccess/AppUsersResourceAccess');
const { WALLET_TYPE } = require('../Wallet/WalletConstant');
const ServicePackageUser = require('./resourceAccess/PaymentServicePackageUserResourceAccess');
const ServicePackageResource = require('./resourceAccess/PaymentServicePackageResourceAccess');
const UserBonusPackageResource = require('./resourceAccess/UserBonusPackageResourceAccess');
const ServicePackageWalletViews = require('./resourceAccess/ServicePackageWalletViews');
const UserServicePackageViews = require('./resourceAccess/UserServicePackageViews');
const { ACTIVITY_STATUS, PACKAGE_CATEGORY, CLAIMABLE_STATUS } = require('./PaymentServicePackageConstant');
const PaymentRecordResource = require('./../PaymentRecord/resourceAccess/PaymentRecordResourceAccess');
const Logger = require('../../utils/logging');

async function _addBonusPackageForUser(appUserId, bonusPackageId) {
  //check if there is any existing bonus package that still enable
  //then skip this process, we do not allow to add duplicated bonus package at the same time
  let _existingBonusPackages = await UserBonusPackageResource.find({
    appUserId: appUserId,
    bonusPackageId: bonusPackageId,
    bonusPackageClaimable: CLAIMABLE_STATUS.ENABLE,
  });

  if (_existingBonusPackages && _existingBonusPackages.length > 0) {
    Logger.error(`_existingBonusPackages for appUserId ${appUserId} - bonusPackageId ${bonusPackageId}`);
    return;
  }

  let _newBonusPackageData = {
    appUserId: appUserId,
    bonusPackageId: bonusPackageId,
    bonusPackageClaimable: CLAIMABLE_STATUS.ENABLE,
  };
  let insertNewBonus = await UserBonusPackageResource.insert(_newBonusPackageData);
  if (!insertNewBonus) {
    Logger.error(`can not insertNewBonus for appUserId ${appUserId} - bonusPackageId ${bonusPackageId}`);
    return;
  }
}
async function _checkBonusAvaibility(appUserId) {
  //count existing bonus package, if available then we will proceed, else we skip it
  let _existingBonusPackagesCount = await ServicePackageResource.count({
    packageCategory: PACKAGE_CATEGORY.BONUS,
    isDeleted: false
  });

  if (!_existingBonusPackagesCount || _existingBonusPackagesCount.length <= 0) {
    return;
  }
  _existingBonusPackagesCount = _existingBonusPackagesCount[0].count;
  if (_existingBonusPackagesCount <= 0) {
    return;
  }

  //count userReferralCount, if available then we will proceed, else we skip it
  let _userReferralCount = await AppUserResource.count({
    referUserId: appUserId
  });
  if (!_userReferralCount || _userReferralCount.length <= 0) {
    _userReferralCount = 0;
  } else {
    _userReferralCount = _userReferralCount[0].count;
  }

  //count number of package that user buy
  let _totalReferPayment = await UserServicePackageViews.sum('packagePaymentAmount', {
    referUserId: appUserId,
  });
  if (!_totalReferPayment || _totalReferPayment.length <= 0) {
    _totalReferPayment = 0;
  } else {
    _totalReferPayment = _totalReferPayment[0].sumResult;
  }
  //find available bonus packages
  let _bonusPackages = await ServicePackageResource.countByReferral({
    packageCategory: PACKAGE_CATEGORY.BONUS,
  }, _userReferralCount, _totalReferPayment);

  if (_bonusPackages && _bonusPackages.length > 0) {
    for (let i = 0; i < _bonusPackages.length; i++) {
      const _bonusPackage = _bonusPackages[i];
      await _addBonusPackageForUser(appUserId, _bonusPackage.paymentServicePackageId);
    }
  }
}

async function userBuyServicePackage(user, packageId) {
  const FUNC_FAILED = undefined;
  //find user selecting package
  let package = await ServicePackageResource.find({
    paymentServicePackageId: packageId,
  }, 0, 1);
  if (package === undefined || package.length < 1) {
    Logger.error(`userBuyServicePackage invalid package ${packageId}`);
    return FUNC_FAILED;
  }
  package = package[0];

  //find user exisitng package
  let existingPackages = await ServicePackageUser.find({
    paymentServicePackageId: packageId,
    appUserId: user.appUserId,
  }, 0, 5);
  
  if (existingPackages &&  existingPackages.length > 0) {
    for (let counter = 0; counter < existingPackages.length; counter++) {
      const _existedPackage = existingPackages[counter];
      if (_existedPackage.packageActivityStatus !== ACTIVITY_STATUS.COMPLETED) {
        Logger.error(`userBuyServicePackage existing package ${packageId}`);
        return FUNC_FAILED;
      }
    }
  }
  
  //retrieve wallet info to check balance
  let userWallet = await WalletResource.find({
    appUserId: user.appUserId,
    walletType: WALLET_TYPE.POINT
  }, 0, 1);

  if (userWallet === undefined || userWallet.length < 1) {
    Logger.error(`userBuyServicePackage can not wallet POINT ${appUserId}`)
    return FUNC_FAILED;
  }
  userWallet = userWallet[0];

  //check if wallet balance is enough to pay or not
  let paymentAmount = package.packageDiscountPrice === null ? package.packagePrice : package.packageDiscountPrice;
  if (userWallet.balance - paymentAmount < 0) {
    Logger.error(`userBuyServicePackage do not have enough balance`)
    return FUNC_FAILED;
  };

  //update wallet balance
  let updateWallet = await WalletResource.decrementBalance(userWallet.walletId, paymentAmount);
  if (updateWallet) {

    //store payment history record 
    let paymentRecordData = {
      paymentUserId: user.appUserId,
      paymentTargetId: package.paymentServicePackageId,
      paymentTitle: `Purchase service package: ${package.packageName}`,
      paymentTargetType: "SERVICE_PACKAGE",
      paymentAmount: paymentAmount,
      walletBalanceBefore: userWallet.balance,
      walletBalanceAfter: userWallet.balance - paymentAmount,
    }
    let newPaymentRecord = await PaymentRecordResource.insert(paymentRecordData);
    if (newPaymentRecord === undefined) {
      Logger.error(`userBuyServicePackage can not store payment record user ${user.appUserId} - packageId ${packageId} `)
    }

    //create new wallet follow balance unit if wallet is not existed
    let newUnitWallet = await WalletResource.find({
      appUserId: user.appUserId,
      walletType: WALLET_TYPE.CRYPTO,
      walletBalanceUnitId: package.packageUnitId
    });
    if (newUnitWallet && newUnitWallet.length > 0) {
      //if wallet existed, then do nothing
    } else {  
      let createNewUnitWallet = await WalletResource.insert({
        appUserId: user.appUserId,
        walletType: WALLET_TYPE.CRYPTO,
        walletBalanceUnitId: package.packageUnitId
      });
      if (createNewUnitWallet === undefined) {
        Logger.error(`userBuyServicePackage can not create new wallet crypto user ${user.appUserId} - unitId ${package.packageUnitId}`)
      }
    }

    //store working package 
    let userPackageData = {
      appUserId: user.appUserId,
      paymentServicePackageId: packageId,
      packageExpireDate: moment().add(package.packageDuration,'days').add(1,'m').toDate(),
      profitEstimate: package.packagePerformance * package.packageDuration,
      packagePrice: package.packagePrice,
      packageDiscountPrice: package.packageDiscountPrice,
      packagePaymentAmount: paymentAmount,
      packageLastActiveDate: new Date(),
    };
    let newPackageResult = await ServicePackageUser.insert(userPackageData);
    if (newPackageResult) {
      
      //check to add bonus packages
      await _checkBonusAvaibility(user.appUserId);
      await _checkBonusAvaibility(user.referUserId)
      return newPackageResult;
    } else {
      Logger.error(`userBuyServicePackage can not record user ${user.appUserId} - packageId ${packageId}`)
      return FUNC_FAILED;
    }
  } else {
    Logger.error(`userBuyServicePackage can not pay to wallet ${userWallet.walletId}, ${paymentAmount}`)
    return FUNC_FAILED;
  }
}

async function userCollectServicePackage(user, packageId) {
  const FUNC_FAILED = undefined;
  //find user selecting package
  let package = await ServicePackageWalletViews.find({
    paymentServicePackageUserId: packageId,
    appUserId: user.appUserId
  }, 0, 1);
  if (package === undefined || package.length < 1) {
    Logger.error(`userCollectServicePackage invalid package ${packageId}`);
    return FUNC_FAILED;
  }
  package = package[0];

  //retrieve wallet info to check balance
  let userWallet = await WalletResource.find({
    appUserId: user.appUserId,
    walletBalanceUnitId: package.walletBalanceUnitId
  }, 0, 1);

  if (userWallet === undefined || userWallet.length < 1) {
    Logger.error(`userCollectServicePackage can not find wallet POINT ${appUserId}`)
    return FUNC_FAILED;
  }
  userWallet = userWallet[0];

  let collectAmount = package.profitActual;
  let claimedAmount = package.profitClaimed * 1 + collectAmount * 1;
  let updatedPackageData = {
    profitActual: 0,
    profitClaimed: claimedAmount
  }
  if (claimedAmount >= package.profitEstimate) {
    updatedPackageData.packageActivityStatus = ACTIVITY_STATUS.COMPLETED
  }

  let collectUpdated = await ServicePackageUser.updateById(packageId, updatedPackageData);
  if (collectUpdated === undefined) {
    Logger.error(`userCollectServicePackage can not collect`)
    return FUNC_FAILED;
  }
  
  //update wallet balance
  let updateWallet = await WalletResource.incrementBalance(userWallet.walletId, collectAmount);
  if (updateWallet) {
    return updateWallet;
  } else {
    Logger.error(`userBuyServicePackage can not pay to wallet ${userWallet.walletId}, ${paymentAmount}`)
    return FUNC_FAILED;
  }
}

async function userActivateServicePackage(user, packageId) {
  const FUNC_FAILED = undefined;
  //find user selecting package
  let package = await ServicePackageWalletViews.find({
    paymentServicePackageUserId: packageId,
    appUserId: user.appUserId,
    packageActivityStatus: ACTIVITY_STATUS.STANDBY
  }, 0, 1);
  if (package === undefined || package.length < 1) {
    Logger.error(`userCollectServicePackage invalid package ${packageId}`);
    return FUNC_FAILED;
  }
  package = package[0];

  let _packageExpire = new Date(package.packageExpireDate) - 1;
  if (_packageExpire < new Date() - 1)  {
    let collectUpdated = await ServicePackageUser.updateById(packageId, {
      packageActivityStatus: ACTIVITY_STATUS.WORKING,
      packageLastActiveDate: new Date()
    });

    if (collectUpdated === undefined) {
      Logger.error(`userCollectServicePackage can not collect`)
      return FUNC_FAILED;
    } else {
      return collectUpdated;
    }

  } else {
    Logger.error(`_packageExpire - package ${packageId}`);
    return FUNC_FAILED;
  }
}

module.exports = {
  userBuyServicePackage,
  userCollectServicePackage,
  userActivateServicePackage,
};
