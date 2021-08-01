require('dotenv').config();
console.log(process.env.NODE_ENV);
function getEnv() {
  if (process.env.NODE_ENV === 'dev') {
    return {
      baseUrl: "https://skyqueen-server.service.hodace.network"
    };
  }
  else if (process.env.NODE_ENV === 'demo') {
    return {};
  }
}

const envData = getEnv();

module.exports = {
  baseUrl: envData.baseUrl,
  envData,
};
