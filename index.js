const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const config = require('./config/key')
const { User } =  require("./models/User");

// application/x-www-form-urlencoded 데이터를 가져옴
app.use(bodyParser.urlencoded({extended: true}))

// application/json 데이터를 가져옴.
app.use(bodyParser.json());

/* mongoDB 연결*/
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI
// , {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false}
).then(()=> console.log("mongoDb connected...."))
    .catch(err => console.log(err))


app.get('/', (req, res)=>{
    res.send('hello world~~~ nice to meet you!~~');
});


app.post('/register', (req, res) => {
    // 회원 가입 시 필요한 정보들은 client 에서 가져오면 그것들을 DB에 넣어준다.
    const user = new User(req.body);

    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err});
        return res.status(200).json({success: true});
    });
})




app.listen(port, ()=> {
    console.log(`Welcome to my project : ${port}`);
})