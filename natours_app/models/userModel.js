const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name.'],
        trim: true,
        maxlength: [40, 'A user name must have less or equal then 40 characters'],
        minlength: [10, 'A user name must have more or equal then 10 characters']
    },
    email: {
        type: String,
        required: [true, 'A user must have a email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email.']
    },
    image: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'A user must have a password.'],
        trim: true,
        minlength: [8, 'Your password is too short. It should be at least 8 character.'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password.'],
        validate: {
            //ONLY WORKS ON SAVE AND SAVE
            validator: function(item){
                return item === this.password;
            },
            message: 'Password are not the same.'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
});

usersSchema.pre('save', async function(next) {
    if(this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

usersSchema.pre('save', async function(next) {
    // Only run if password was actually modified
    if(!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete the passwordConfirm field from mongodb
    this.passwordConfirm = undefined;

    next();
});

usersSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

usersSchema.methods.changedPasswordAfterLogin = async function(JWTTimestamp){
    if(this.passwordChangedAt){
        let changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000, 10);
        
        return (JWTTimestamp < changedTimeStamp);   
    }
    return false;
};

usersSchema.methods.createPasswordResetToken = async function() {
    let resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('Users', usersSchema);

module.exports = User;