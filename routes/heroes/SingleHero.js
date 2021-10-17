const express = require('express');
const { ApiError } = require('../../lib/ApiError');
const ApiResponse = require('../../lib/ApiResponse');
const router = express.Router();

// Single Hero - 取得單一英雄
// API文件: https://redocly.github.io/redoc/?url=https://raw.githubusercontent.com/a179346/heroes-apidoc/main/api.json#tag/Hero/paths/~1heroes~1{heroId}/get
router.get('/:heroId', async function (req, res, next) {
  try {
    const heroId = req.params.heroId;
    if (!heroId || typeof heroId !== 'string') throw new ApiError('bad_request', '錯誤的 heroId', 400);

    const hero = await req.HahowApi.SingleHero(heroId);
    if (req.hahowAuth) {
      // 當使用者驗證過身分後，須回傳profile
      const profile = await req.HahowApi.ProfileOfHero(heroId);
      hero.profile = profile;
    }

    res.apiResponse = new ApiResponse(200, hero);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = router;