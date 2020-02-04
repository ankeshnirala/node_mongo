const User = require('./../models/userModel');
const APIFeatures = require('./../utils/APIFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    let features = new APIFeatures(User.find(), req.query).filter().sort().limitFields().paginate();
    let _user = await features.query;

    res.status(200).json({
        status: 1,
        message: 'success',
        length: _user.length,
        data: _user
    });
});

exports.createUser = catchAsync(async (req, res, next) => {
    let newUser = await User.create(req.body);

    res.status(200).json({
        status: 1,
        message: 'success',
        data: newUser
    });
});

exports.getUser = catchAsync(async (req, res, next) => {
    let _user = await User.findById(req.params.id);

    if(!_user){
       return next(new AppError(`No user found with ${req.params.id} ID`, 404));
    }

    res.status(200).json({
        status: 1,
        message: 'success',
        data: _user
    });
});

exports.updateUser = catchAsync(async (req, res, next) => {
    let updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!updatedUser){
        return next(new AppError(`No user found with ${req.params.id} ID`, 404));
     }

    res.status(200).json({
        status: 1,
        message: 'success',
        data: updateduser
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    let deletedUser = await User.findByIdAndDelete(req.params.id);

    if(!deletedUser){
        return next(new AppError(`No user found with ${req.params.id} ID`, 404));
     }

    res.status(200).json({
        status: 1,
        message: 'success',
        data: deletedUser
    });
});