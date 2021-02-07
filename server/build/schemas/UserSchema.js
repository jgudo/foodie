"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EGender = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const lodash_omit_1 = __importDefault(require("lodash.omit"));
const mongoose_1 = require("mongoose");
var EProvider;
(function (EProvider) {
    EProvider["facebook"] = "facebook";
    EProvider["github"] = "github";
    EProvider["password"] = "password";
})(EProvider || (EProvider = {}));
var EGender;
(function (EGender) {
    EGender["male"] = "male";
    EGender["female"] = "female";
    EGender["unspecified"] = "unspecified";
})(EGender = exports.EGender || (exports.EGender = {}));
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        minlength: 12,
        unique: true,
        required: [true, 'Email is required.'],
        lowercase: true,
        maxlength: 64,
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
        required: true,
        maxlength: 100
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required.'],
        lowercase: true,
        minlength: 4,
        maxlength: 30,
        validate: {
            validator: (username) => {
                const regex = /^[a-z]+_?[a-z0-9]{1,}?$/ig;
                return regex.test(username);
            },
            message: 'Username Must preceed with letters followed by _ or numbers eg: john23 | john_23'
        }
    },
    provider: {
        type: String,
        default: 'password',
        enum: ['password', 'facebook', 'google', 'github']
    },
    provider_id: {
        type: String,
        default: null
    },
    provider_access_token: String,
    provider_refresh_token: String,
    firstname: {
        type: String,
        maxlength: 40
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    isEmailValidated: {
        type: Boolean,
        default: false
    },
    info: {
        bio: {
            type: String,
            maxlength: 200,
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
            type: mongoose_1.Schema.Types.ObjectId,
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
            delete ret.provider_access_token;
            delete ret.provider_refresh_token;
            return ret;
        }
    },
    toObject: {
        getters: true,
        virtuals: true,
        transform: function (doc, ret, opt) {
            delete ret.password;
            delete ret.provider_access_token;
            delete ret.provider_refresh_token;
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
    bcrypt_1.default.compare(password, user.password, function (err, isMatch) {
        if (err)
            return cb(err);
        cb(null, isMatch);
    });
};
UserSchema.methods.toUserJSON = function () {
    const user = lodash_omit_1.default(this.toObject(), ['password', 'facebook', 'createdAt', 'updatedAt', 'bookmarks']);
    return user;
};
UserSchema.methods.toProfileJSON = function () {
    return {
        username: this.username,
        fullname: this.fullname,
        profilePicture: this.profilePicture
    };
};
UserSchema.methods.isBookmarked = function (postID) {
    if (!mongoose_1.isValidObjectId(postID))
        return;
    return this.bookmarks.some(bookmark => {
        return bookmark._id.toString() === postID.toString();
    });
};
UserSchema.pre('save', function (next) {
    if (this.info.gender === null)
        this.info.gender = EGender.unspecified;
    if (this.firstname === null)
        this.firstname = '';
    if (this.lastname === null)
        this.lastname = '';
    if (this.info.birthday === null)
        this.info.birthday = '';
    if (this.isNew || this.isModified('password')) {
        bcrypt_1.default.genSalt(10, (err, salt) => {
            bcrypt_1.default.hash(this.password, salt, (err, hash) => {
                this.password = hash;
                next();
            });
        });
    }
    else {
        next();
    }
});
const User = mongoose_1.model('User', UserSchema);
exports.default = User;
//# sourceMappingURL=UserSchema.js.map