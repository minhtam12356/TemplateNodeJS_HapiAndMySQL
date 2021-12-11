'use strict';

const Joi = require("joi");

const schema = Joi.object({
  stationsId: Joi.number(),
  stationsName: Joi.string().required(),
  stationUrl: Joi.string().allow(''),
  stationWebhookUrl: Joi.string().allow(''),
  stationBookingConfig: Joi.array().items({
    index: Joi.number(),
    time: Joi.string(),
    limit:Joi.number()
  }),
  stationCheckingConfig: Joi.array().items({
    stepIndex: Joi.number(),
    stepVoice: Joi.string().allow(''),
    stepLabel: Joi.string(),
    stepDuration: Joi.number(),
    stepVoiceUrl: Joi.string().allow(''),
  }).required(),
  stationStatus: Joi.number(),
  isHidden: Joi.number(),
  isDeleted: Joi.number(),
  updatedAt: Joi.date(),
  createdAt: Joi.date(),
  stationsLogo: Joi.string().allow(''),
  stationsColorset: Joi.string(),
  stationCheckingAuto: Joi.number(),
  stationUseCustomSMTP: Joi.number(),
  stationCustomSMTPConfig: Joi.string().allow(''),
  stationUseCustomSMSBrand: Joi.number(),
  stationCustomSMSBrandConfig: Joi.string().allow(''),
  stationUseCustomZNS: Joi.number(),
  stationCustomZNSConfig: Joi.string().allow(''),
  stationsHotline: Joi.string().allow(''),
  stationsAddress: Joi.string().allow(''),
  stationEnableUseZNS: Joi.number(),
  stationEnableUseSMS: Joi.number(),
  stationsEmail: Joi.string().allow('').email(),
  stationsEnableAd: Joi.number(),
  stationsCustomAdBannerLeft: Joi.string().allow(''),
  stationsCustomAdBannerRight: Joi.string().allow(''),
})

function fromData(data) {
  let modelData = {
    ...data, //copy all data from object
    stationUrl: data.stationUrl === null ? '' : `https://${data.stationUrl}`,
    stationBookingConfig: data.stationBookingConfig === '' ? {} : JSON.parse(data.stationBookingConfig),
    stationCheckingConfig: data.stationCheckingConfig === '' ? {} : JSON.parse(data.stationCheckingConfig),
    stationsLogo: data.stationsLogo === null ? '' : data.stationsLogo,
    stationCustomSMTPConfig: data.stationCustomSMTPConfig === null ? '' : data.stationCustomSMTPConfig,
    stationCustomSMSBrandConfig: data.stationCustomSMSBrandConfig === null ? '' : data.stationCustomSMSBrandConfig,
    stationCustomZNSConfig: data.stationCustomZNSConfig === null ? '' : data.stationCustomZNSConfig,
    stationWebhookUrl: data.stationWebhookUrl === null ? '' : `https://${data.stationWebhookUrl}/CustomerRecord/robotInsert`,
    stationsEmail: data.stationsEmail === null ? '' : data.stationsEmail,
    stationsHotline: data.stationsEmail === null ? '' : data.stationsHotline,
    stationsAddress: data.stationsAddress === null ? '' : data.stationsAddress,
    stationsCustomAdBannerLeft: data.stationsCustomAdBannerLeft === null ? '' : data.stationsCustomAdBannerLeft,
    stationsCustomAdBannerRight: data.stationsCustomAdBannerRight === null ? '' : data.stationsCustomAdBannerRight,
  }

  let outputModel = schema.validate(modelData);
  if (outputModel.error === undefined || outputModel.error === null || outputModel.error === "") {
    return outputModel.value;
  } else {
    console.error(outputModel.error);
    return undefined;
  }
}

module.exports = {
  fromData
};