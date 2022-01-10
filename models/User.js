const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const saltRounds = 10; // salt가 10자리.
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp : {
        type: Number
    }
})

userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        // 비밀번호를 암호화 시킨다. genSalt는 bcrypt 매서드
        bcrypt.genSalt(saltRounds, function (err, salt) {
            // next() : 바로 'app.post('/register', (req, res) => {'으로 이동함. 
            if (err) return next(err); 
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err); 
                user.password = hash;
                next();
            })
        })
    }
    else {
       next(); 
    }
}); // db에 저장하기 전에 fucntion을 함.

userSchema.methods.comparePw = function (plainPw, cb) {
    // plainPw가 12345라면 암호화된 값과 같는지 체크.
    bcrypt.compare(plainPw, userSchema.password, function (err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch)
    });
}

userSchema.methods.generateToken = function (cb) {
    var user = this;
    // jsonwebtoken을 이용해서 토큰을 생성하기.  
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token;
    user.save(function (err, user) {
        if (err) return cb(err) 
        cb(null, user)
    })
}

const User = mongoose.model('User', userSchema)

module.exports= { User }