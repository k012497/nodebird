const passport = require('passport');
const local = require('./localStrategy');
const kakao = requrie('./kakoStrategy');
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => { // 로그인 시 실행 (사용자 정보 객체를 세션에 아이디로 저장)
        done(null, user.id); // 저장하고 싶은 데이터 넘김. 에러발생 시 null 사용
    });

    passport.deserializeUser((id, done) => { // 매 요청 시 실행(사용자 정보 객체 불러오는 것). serializeUserd에 넣었던 id 데이터가 매개변수
        User.findOne({ where : { id }})
            .then(user => done(null, user))
            .catch(err => done(err));
    });
};

local();
kakao();
