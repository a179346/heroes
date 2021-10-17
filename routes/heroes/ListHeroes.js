const express = require('express');
const router = express.Router();

router.get('/', async function (req, res, next) {
  try {
    throw new Error('ListHeroes 未實作');
    // next();
  } catch (error) {
    next(error);
  }
});

module.exports = router;