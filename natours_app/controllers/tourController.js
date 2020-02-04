const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/APIFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllTours = catchAsync(async (req, res, next) => {
    let features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
    let _Tour = await features.query;

    res.status(200).json({
        status: 1,
        message: 'success',
        length: _Tour.length,
        data: _Tour
    });
});

exports.createTour = catchAsync(async (req, res, next) => {
    let newTour = await Tour.create(req.body);

    res.status(200).json({
        status: 1,
        message: 'success',
        data: newTour
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    let _Tour = await Tour.findById(req.params.id);

    if(!_Tour){
       return next(new AppError(`No tour found with ${req.params.id} ID`, 404));
    }

    res.status(200).json({
        status: 1,
        message: 'success',
        data: _Tour
    });
});

exports.updateTour = catchAsync(async (req, res, next) => {
    let updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!updatedTour){
        return next(new AppError(`No tour found with ${req.params.id} ID`, 404));
     }

    res.status(200).json({
        status: 1,
        message: 'success',
        data: updatedTour
    });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
    let deletedTour = await Tour.findByIdAndDelete(req.params.id);

    if(!deletedTour){
        return next(new AppError(`No tour found with ${req.params.id} ID`, 404));
     }

    res.status(200).json({
        status: 1,
        message: 'success',
        data: deletedTour
    });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([{
            $match: {
                ratingAvg: {
                    $gte: 4.5
                }
            }
        },
        {
            $group: {
                _id: '$difficulty',
                avgRating: {
                    $avg: '$ratingAvg'
                },
                avgPrice: {
                    $avg: '$price'
                },
                minPrice: {
                    $min: '$price'
                },
                maxPrice: {
                    $max: '$price'
                },
                totalTours: {
                    $sum: 1
                }
            }
        }
    ]);

    res.status(200).json({
        status: 1,
        message: 'success',
        data: stats
    });
});