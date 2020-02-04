const express = require('express');
const Router = express.Router();
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

Router.route('/signup').post(authController.signup);
Router.route('/login').post(authController.login);

Router.route('/forgotPassword').post(authController.forgotPassword);
Router.route('/resetPassword/:token').patch(authController.resetPassword);

Router.route('/')
      .get(userController.getAllUsers)
      .post(userController.createUser);

Router.route('/:id')
      .get(userController.getUser)
      .patch(userController.updateUser)
      .delete(userController.deleteUser);

module.exports = Router;