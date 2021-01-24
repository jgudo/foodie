const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const omit = require('lodash.omit');
// const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        minlength: 12,
        unique: [true, 'Email already taken.'],
        required: [true, 'Email is required.'],
        lowercase: true,
        validate: {
            validator: (email) => {
                const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
                return regex.test(email);
            },
            message: '{VALUE} is invalid.'
        }
    },
    password: {
        type: String,
        minlength: 8,
        required: true
    },
    username: {
        type: String,
        unique: [true, 'Username already taken.'],
        required: [true, 'Username is required.'],
        lowercase: true,
        validate: {
            validator: (username) => {
                const regex = /[a-zA-Z]+_?\d./g;
                return regex.test(username);
            },
            message: '{VALUE} is invalid. Must preceed with letters followed by _ or numbers eg: john_23'
        }
    },
    firstname: String,
    lastname: String,
    facebook: {
        id: String,
        token: String,
        name: String,
        email: String
    },
    isEmailValidated: {
        type: Boolean,
        default: false
    },
    info: {
        bio: {
            type: String,
            default: ''
        },
        birthday: {
            type: Date,
        },
        gender: {
            type: String,
            default: 'unspecified',
            enum: ['male', 'female', 'unspecified']
        }
    },
    profilePicture: {
        type: String,
        default: null
    },
    coverPhoto: {
        type: String,
        default: null
    },
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    dateJoined: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret, opt) {
            delete ret.password;
            delete ret.facebook;
            return ret;
        }
    },
    toObject: {
        getters: true,
        virtuals: true,
        transform: function (doc, ret, opt) {
            delete ret.password;
            delete ret.facebook;
            return ret;
        }
    }
});

UserSchema.virtual('fullname').get(function () {
    const { firstname, lastname } = this;
    return (firstname && lastname) ? `${this.firstname} ${this.lastname}` : null;
});

// UserSchema.set('toObject', { getters: true });

UserSchema.methods.passwordMatch = function (password, cb) {
    const user = this;

    bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) return cb(err);

        cb(null, isMatch);
    });
}

UserSchema.methods.toUserJSON = function () {
    const user = omit(this.toObject(), ['password', 'facebook', 'createdAt', 'updatedAt', 'bookmarks']);

    return user;
}

UserSchema.methods.toProfileJSON = function () {
    return {
        username: this.username,
        fullname: this.fullname,
        profilePicture: this.profilePicture
    };
}

UserSchema.methods.isBookmarked = function (postID) {
    if (!mongoose.isValidObjectId(postID)) return;

    return this.bookmarks.some(bookmark => {
        return bookmark._id.toString() === postID.toString();
    });
}

UserSchema.pre('save', function (next) {
    if (this.info.gender === null) this.info.gender = 'unspecified';
    if (this.firstname === null) this.firstname = '';
    if (this.lastname === null) this.lastname = '';
    if (this.info.birthday === null) this.info.birthday = '';

    if (this.isNew || this.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(this.password, salt, (err, hash) => {
                this.password = hash;
                next();
            });
        })
    } else {
        next();
    }
});

module.exports = mongoose.model('User', UserSchema);