const DATA = require('./initData.json');
const AreaDataResourceAccess = require('../resourceAccess/AreaDataResourceAccess');

let prevCity = 0;
let prevDistrictKey = 0;
let prevWardKey = 0;

async function bulkInsert(data, parentKey = 1) {
  let parentId = parentKey;
  for(let i = 0; i < data.length; i++) {
    //Lấy key data type
    let childKey = '';
    let AreaDataType = '';
    let isNew = false;
    for(let k in data[i]) {
      // nó là thành phố và nó đang chứa district
      if(k === "districts") {
        AreaDataType = "CITY";
        parentId = 1;
        prevCity = prevCity + 1;
        childKey = "districts";
        isNew = true;
        break;
      // nó là quận và nó đang chứa ward
      } else if(k === "wards") {
        AreaDataType = "DISTRICT";
        prevDistrictKey = prevDistrictKey + 1;
        childKey = "wards";
        isNew = true;
        break;
      } else {
        //Nếu không chứa district hay ward thì nó là phường
        AreaDataType = "WARD";
        isNew = false;
      }
    }
    if(isNew === false) {
      prevWardKey = prevWardKey + 1;
    } 
    let AreaDataKey = AreaDataType;
    if(AreaDataType === "DISTRICT") {
      AreaDataKey = AreaDataKey+prevDistrictKey;
    } else if(AreaDataKey === "CITY") {
      AreaDataKey = AreaDataKey+prevCity;
    } else {
      AreaDataKey = AreaDataKey+prevWardKey;
    }
    let insertData = [{
      "AreaDataName": data[i].name,
      "AreaDataType": AreaDataType,
      "AreaParentId": parentId,
      "AreaDataKey": AreaDataKey
    }];
    let result = await AreaDataResourceAccess.insert(insertData);
    if(childKey !== '') {
      bulkInsert(data[i][childKey], result[0]);
    } else {
      continue;
    }
  }
}

bulkInsert(DATA.cities, 1);