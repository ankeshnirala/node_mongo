const express = require('express');
const Router = express.Router();
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

Router.route('/tour-stats').get(tourController.getTourStats);

Router.route('/')
      .get(authController.protect, tourController.getAllTours)
      .post(authController.protect, authController.restrictTo('admin'), tourController.createTour);

Router.route('/:id')
      .get(tourController.getTour)
      .patch(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.updateTour)
      .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = Router;