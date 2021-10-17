const express = require('express');
const ApiResponse = require('../../lib/ApiResponse');
const router = express.Router();

// List Heroes - 取得英雄列表
// API文件: https://redocly.github.io/redoc/?url=https://raw.githubusercontent.com/a179346/heroes-apidoc/main/api.json#tag/Hero/paths/~1heroes/get
router.get('/', async function (req, res, next) {
  try {
    const heroes = await req.HahowApi.ListHeroes();
    if (req.hahowAuth) {
      // 當使用者驗證過身分後，須回傳hero profile
      const tasks = [];
      for (const hero of heroes)
        tasks.push(setHeroProfile(hero, req.HahowApi));
      await Promise.all(tasks);
    }

    res.apiResponse = new ApiResponse(200, { heroes });
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * @typedef Hero
 * @type {object}
 * @property {string} id 英雄id
 * @property {string} name 英雄名字
 * @property {string} image 英雄圖片
 */
/**
 * 取得並設定英雄檔案
 * @param {Hero} hero
 * @param {HahowApi} HahowApi
 */
async function setHeroProfile (hero, HahowApi) {
  const profile = await HahowApi.ProfileOfHero(hero.id);
  hero.profile = profile;
}

module.exports = router;