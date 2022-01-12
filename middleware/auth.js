const { User } =  require("../models/User");

let auth = (req, res, next) => {

    // 인증처리를 하는 곳
    // client 쿠키에서 토큰을 가져옴.
    let token = req.cookies.x_auth;
    // 가져온 토큰을 복호화하여 해당 유저를 찾는다.
    // 해당 유자가 있으면 인증
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if(!User) return res.json({isAuth:false, error:true})

        req.token = token;
        req.user = user;
        // req.token, req.user는 findByToken() 호출한 곳에서 
        // 'req.token, req.user'로 바로 쓰일수 있음.
        next();
    })
    // 없으면 인증 no!
}

module.exports = {auth}