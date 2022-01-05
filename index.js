const express = require("express");
const app = express();
const port = 3000;

/* mongoDB 연결*/
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://wogud541:qlraocl12@boilerplate.4c95e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
// , {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false}
).then(()=> console.log("mongoDb connected...."))
    .catch(err => console.log(err))


app.get('/', (req, res)=>{
    res.send('hello world~~~ nice to meet you!');
});

app.listen(port, ()=> {
    console.log(`Welcome to my project : ${port}`);
})