const express = require('express');

const { env } = require('./config');
const { ApiError, DEFAULT_CODE, DEFAULT_MESSAGE, DEFAULT_STATUS } = require('./lib/ApiError');
const ApiResponse = require('./lib/ApiResponse');
const heroesRouter = require('./routes/heroesRouter');

const app = express();

// 給 Load balancer 做 Health check
app.get('/ping', (req, res) => {
  res.send('pong');
});

// body-parser 因為沒有需要傳入Request Body的API，註解掉 (若有需要可以打開)
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

app.use('/heroes', heroesRouter);


// 成功訊息統一在這邊回覆 (可以在這邊加log系統，紀錄"request","response"及"呼叫外部API的log")
// 例如: 將log傳到ELK
app.use((req, res, next) => {
  if (res.headersSent) return;

  const apiResponse = res.apiResponse;
  if (!(apiResponse instanceof ApiResponse))
    return next(new ApiError('path_not_found', 'Path Not Found', 404));

  const responseStatus = res.apiResponse.status;
  const responseData = res.apiResponse.data;
  res.status(responseStatus)
    .json(responseData);
});

// 錯誤訊息統一在這邊回覆 (可以在這邊加log系統，紀錄"request","response","error stack"及"呼叫外部API的log")
// 例如: 將log傳到ELK
app.use((err, req, res, next) => {
  if (res.headersSent) return;

  let responseStatus = DEFAULT_STATUS;
  const responseData = {
    code: DEFAULT_CODE,
    message: DEFAULT_MESSAGE,
  };
  if (err instanceof ApiError) {
    responseStatus = err.status;
    responseData.code = err.code;
    responseData.message = err.message;
  }

  // 當 LOG_ERROR_STACK 為 "1" 時， 回傳 error stack
  if (env.LOG_ERROR_STACK === '1')
    responseData.stack = err?.stack;

  res.status(responseStatus)
    .json(responseData);
});

module.exports = app;