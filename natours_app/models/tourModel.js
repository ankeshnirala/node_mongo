const mongoose = require('mongoose');
const User = require('./userModel');

const toursSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name.'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [10, 'A tour name must have more or equal then 10 characters']
    },
    rating: {
        type: Number,
        default: 3
    },
    ratingAvg: {
        type: Number,
        default: 3,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0,
        required: [true, 'A tour must have a price.']
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration.']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size.']
    },
    description: {
        type: String,
        trim: true
    },
    difficulty: {
        type: String,
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
          }
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val) {
              // this only points to current doc on NEW document creation
              return val < this.price;
            },
            message: 'Discount price ({VALUE}) should be below regular price'
          }
    },
    summary: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDate: [Date],
    startLocation: {
        //GeoLocation in mongoose
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: Array
});

// To store embedded documents in mongodb i.e store user based on id
toursSchema.pre('save', async (next) => {
    let tourGuides = this.guides.map(async id => await User.findById(id));
    this.guides = await Promise.all(tourGuides);
    next();
});

const Tour = mongoose.model('Tours', toursSchema);

module.exports = Tour;