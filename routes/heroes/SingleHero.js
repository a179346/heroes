const express = require('express');
const router = express.Router();

router.get('/:heroId', async function (req, res, next) {
  try {
    throw new Error('SingleHero 未實作');
    // next();
  } catch (error) {
    next(error);
  }
});

module.exports = router;