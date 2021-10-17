const express = require('express');

const authUser = require('../middlewares/authUser');
const getHahowApi = require('../middlewares/getHahowApi');
const ListHeroes = require('./heroes/ListHeroes');
const SingleHero = require('./heroes/SingleHero');

const router = express.Router();

router.get('/', getHahowApi, authUser, ListHeroes);
router.get('/:heroId', getHahowApi, authUser, SingleHero);

module.exports = router;