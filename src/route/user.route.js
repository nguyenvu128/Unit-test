const express = require('express');
const router = express.Router();
const sequelize = require('../database/database');
const userModel = require('../model/user.model');
const userController = require('../controller/user.controller');

router.post('/register', userController.createUser);

module.exports = router;