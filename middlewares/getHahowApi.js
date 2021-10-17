const HahowApi = require('../externalApi/hahowApi');

module.exports = function (req, res, next) {
  try {
    // 把 HahowApi 放到 req
    // 優點:
    //  當要回傳給client時，可以在 req.HahowApi.apiLogs 找到呼叫外部API的紀錄
    //  進一步在log系統去記錄下來
    req.HahowApi = new HahowApi();
    next();
  } catch (error) {
    next(error);
  }
};