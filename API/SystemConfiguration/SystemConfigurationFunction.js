/**
 * Created by Huu on 11/18/21.
 */

"use strict";
const SystemConfigurationResourceAccess = require("./resourceAccess/SystemConfigurationResourceAccess");
async function getSystemConfig() {
  let config = await SystemConfigurationResourceAccess.find();
  if (config && config.length > 0) {
    return config[0];
  }
  return undefined;
}
module.exports = {
  getSystemConfig
};
