/**
 * Created by A on 7/18/17.
 */
"use strict";
const StationsResourceAccess = require("../resourceAccess/StationsResourceAccess");
const StationFunctions = require('../StationsFunctions');
const Logger = require('../../../utils/logging');
const UtilsFunction = require('../../ApiUtils/utilFunctions');
const AppUserFunctions = require('../../AppUsers/AppUsersFunctions');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationsData = req.payload;
      let registerResult = await StationFunctions.registerNewStation(stationsData);

      if (registerResult) {
        let nonVietnameseName = UtilsFunction.nonAccentVietnamese(stationsData.stationsName);
        nonVietnameseName = UtilsFunction.replaceAll(nonVietnameseName, ' ', '');
        //Register first admin user for new station
        let registerUserResult = undefined;
        let generatorIndex = 0;

        //loop until registration finish or react 100 times
        let retryMaxTime = 100;
        let retry = 0;
        while (registerUserResult === undefined) {
          let adminUserData = {
            username: nonVietnameseName + (generatorIndex === 0 ? "" : generatorIndex) + "admin",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            password: "123456789",
            stationsId: registerResult[0]
          }

          registerUserResult = await AppUserFunctions.createNewUser(adminUserData);

          if (!registerUserResult) {
            generatorIndex = generatorIndex + 1;
            retry++;
          }
          if (retryMaxTime === retry) {
            reject("failed");
          }
        }
        resolve(registerResult);
      } else {
        reject("failed");
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
      let limit = req.payload.limit;
      let order = req.payload.order;

      let stations = await StationsResourceAccess.find(filter, skip, limit, order);
      let stationsCount = await StationsResourceAccess.count(filter, order);
      if (stations && stationsCount) {
        resolve({ data: stations, total: stationsCount });
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
      let stationsId = req.payload.id;
      let stationsData = req.payload.data;
      if (stationsData.stationBookingConfig) {
        try {
          stationsData.stationBookingConfig = JSON.stringify(stationsData.stationBookingConfig);
          StationFunctions.sortCheckingConfigStep(stationsData.stationBookingConfig);
        } catch (error) {
          stationsData.stationBookingConfig = '';
        }
      }

      if (stationsData.stationCheckingConfig) {
        //compare to old config and find changes
        let oldStations = await StationsResourceAccess.findById(stationsId);
        if (oldStations) {
          let oldConfigs = oldStations.stationCheckingConfig;
          if (JSON.stringify(oldConfigs) !== JSON.stringify(stationsData.stationCheckingConfig)) {
            //update voice data for each step in checking process
            await StationFunctions.updateVoiceDataForConfig(stationsData.stationCheckingConfig);
          }
        }
        stationsData.stationCheckingConfig = JSON.stringify(stationsData.stationCheckingConfig);
      }

      let result = await StationsResourceAccess.updateById(stationsId, stationsData);
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
      let stationsId = req.payload.id;
      let result = await StationFunctions.getStationDetailById(stationsId);
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

async function findByUrl(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationsUrl = req.payload.stationsUrl;
      let result = await StationFunctions.getStationDetailByUrl(stationsUrl);
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

async function resetAllDefaultMp3() {
  await StationFunctions.resetAllDefaultMp3();
}

async function updateConfigSMTP(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationsId = req.payload.stationsId;
      let smtpHost = req.payload.smtpHost;
      let smtpPort = req.payload.smtpPort;
      let smtpSecure = req.payload.smtpSecure;
      let smtpAuth = req.payload.smtpAuth
      let smtpTls = req.payload.smtpTls
      let stationData = {
        stationCustomSMTPConfig: {
          smtpHost: smtpHost,
          smtpPort: smtpPort,
          smtpSecure: smtpSecure,
          smtpAuth: smtpAuth,
          smtpTls: smtpTls
        }
      };
      stationData.stationCustomSMTPConfig = JSON.stringify(stationData.stationCustomSMTPConfig);
      let result = await StationsResourceAccess.updateById(stationsId, stationData);
      if (result) {
        resolve(result);
      }
      reject("failed");
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });

}

async function updateConfigSMS(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationsId = req.payload.stationsId;
      let smsUrl = req.payload.smsUrl;
      let smsUserName = req.payload.smsUserName;
      let smsPassword = req.payload.smsPassword;
      let smsBrand = req.payload.smsBrand
      let stationData = {
        stationCustomSMSBrandConfig: {
          smsUrl: smsUrl,
          smsUserName: smsUserName,
          smsPassword: smsPassword,
          smsBrand: smsBrand,
        }
      };
      stationData.stationCustomSMSBrandConfig = JSON.stringify(stationData.stationCustomSMSBrandConfig);
      let result = await StationsResourceAccess.updateById(stationsId, stationData);
      if (result) {
        resolve(result);
      }
      reject("failed");
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });

}

async function updateCustomSMTP(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationsId = req.payload.stationsId;
      let stationUseCustomSMTP = req.payload.CustomSMTP;
      let stationData = {
        stationUseCustomSMTP: stationUseCustomSMTP
      }
      let result = await StationsResourceAccess.updateById(stationsId, stationData);
      if (result) {
        resolve(result);
      }
      reject("failed");
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });

}

async function updateCustomSMSBrand(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationsId = req.payload.stationsId;
      let stationUseCustomSMSBrand = req.payload.stationUseCustomSMSBrand;
      let stationData = {
        stationUseCustomSMSBrand: stationUseCustomSMSBrand
      }
      let result = await StationsResourceAccess.updateById(stationsId, stationData);
      if (result) {
        resolve(result);
      }
      reject("failed");
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });

}

async function updateRightAdBanner(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationsId = req.payload.stationsId;
      let stationsCustomAdBannerRight = req.payload.stationsCustomAdBannerRight;

      let result = await StationsResourceAccess.updateById(stationsId, {
        stationsCustomAdBannerRight: stationsCustomAdBannerRight
      });
      if (result) {
        resolve(result);
      }
      reject("failed");
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });

}

async function updateLeftAdBanner(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationsId = req.payload.stationsId;
      let stationsCustomAdBannerLeft = req.payload.stationsCustomAdBannerLeft;

      let result = await StationsResourceAccess.updateById(stationsId, {
        stationsCustomAdBannerLeft: stationsCustomAdBannerLeft
      });
      if (result) {
        resolve(result);
      }
      reject("failed");
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });

}

async function enableAdsForStation(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationsId = req.payload.stationsId;
      let stationsEnableAd = req.payload.stationsEnableAd;

      let result = await StationsResourceAccess.updateById(stationsId, {
        stationsEnableAd: stationsEnableAd
      });
      if (result) {
        resolve(result);
      } else {
        reject("failed");
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });

}



module.exports = {
  insert,
  find,
  updateById,
  findById,
  findByUrl,
  resetAllDefaultMp3,
  updateConfigSMTP,
  updateConfigSMS,
  updateCustomSMTP,
  updateCustomSMSBrand,
  updateLeftAdBanner,
  updateRightAdBanner,
  enableAdsForStation,
};
