const AreaStreetResourceAccess = require("../../AreaStreet/resourceAccess/AreaStreetResourceAccess");
const RealEstateViews = require("../../RealEstate/resourceAccess/RealEstateViews");
const RealEstateResourceAccess = require("../../RealEstate/resourceAccess/RealEstateResourceAccess");
const AreaDirectionResourceAccess = require("../../AreaDirection/resourceAccess/AreaDirectionResourceAccess");
const AreaDataResourceAccess = require("../../AreaData/resourceAccess/AreaDataResourceAccess");
const RealEstatePostTypeResourceAccess = require("../../RealEstatePostType/resourceAccess/RealEstatePostTypeResourceAccess");
const RealEstateCategoryResourceAccess = require("../../RealEstateCategory/resourceAccess/RealEstateCategoryResourceAccess");

const Logger = require('../../../utils/logging');

async function getAreaData(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload;
      let result = await AreaDataResourceAccess.customSearch(filter);
      let resultCount = await AreaDataResourceAccess.customCount(filter);
      if (result && resultCount) {
        resolve({ data: result, total: resultCount[0].count });
      } else {
        reject("Cannot find data");
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

async function getDataFilterRealEstate(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload;
      let resultDirection = await AreaDirectionResourceAccess.find({});
      let resultRealEstatePostType = await RealEstatePostTypeResourceAccess.find({});
      let resultRealEstateCategory = await RealEstateCategoryResourceAccess.find(filter);
      if (
        resultDirection &&
        resultRealEstatePostType &&
        resultRealEstateCategory
      ) {
        resolve({ dataDirection: resultDirection, dataRealEstateType: resultRealEstatePostType, dataRealEstateCategory: resultRealEstateCategory });
      } else {
        reject("Cannot find data");
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

module.exports = {
  getDataFilterRealEstate,
  getAreaData
}
