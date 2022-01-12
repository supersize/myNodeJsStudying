const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require('./config/key')
const { User } =  require("./models/User");
const { auth } =  require("./middleware/auth");

// application/x-www-form-urlencoded 데이터를 가져옴
app.use(bodyParser.urlencoded({extended: true}))

// application/json 데이터를 가져옴.
app.use(bodyParser.json());
app.use(cookieParser());

/* mongoDB 연결*/
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI
// , {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false}
).then(()=> console.log("mongoDb connected...."))
    .catch(err => console.log(err))


app.get('/', (req, res)=>{
    res.send('hello world~~~ nice to meet you!~~');
});


app.post('/api/user/register', (req, res) => {
    // 회원 가입 시 필요한 정보들은 client 에서 가져오면 그것들을 DB에 넣어준다.
    const user = new User(req.body);
 
    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err});
        return res.status(200).json({success: true});
    });
})

app.post('/api/user/login', (req, res)=> {
    // 요청된 이메일을 DB에서 있는지 찾는다.
    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (!user) res.json({ loginSuccess: false, message: "제공된 이메일에 해당되는 유저가 없습니다."})
        // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인 
        user.comparePw( req.body.password, (err, isMatch) => {
            if(!isMatch) {
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."});
            } 
    
            user.generateToken((err, user)=>{
                if (err) return res.status(400).send(err);
    
                // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지 등에 저장가능
                res.cookie('x_auth', user.token)
                .status(200)
                .json({loginSuccess:true, userId: user._id});
            })
        })
    
    });
    // 비번까지 갖다면 그 유저를 위한 토큰 생성.
})

app.get('/api/user/auth', auth, (req, res) => {
    // auth 파라메터는 middleware : 요청과 콜백사이에 뭔가 해주는 역할
    
    // 여기까지 미들웨어를 통과해 왔다는 의미는 Authentication이 True라는 말.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })

});

app.get('/api/user/logout', auth, (req, res)=> {
    User.findOneAndUpdate({
        _id: req.user._id
    }, { token: ""}, (err, user) => {
        if(err) return res.json({ success: false , err});
        return res.status(200).send({success: true})
    })
});

app.listen(port, ()=> {
    console.log(`Welcome to my project : ${port}`);
})