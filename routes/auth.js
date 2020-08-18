const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

// 1. 회원가입 라우터
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
            return res.redirect('./join?error=exist');
        }

        const hash = await bcrypt.hash(password, 12); // 비밀번호 암호화
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// 2. 로그인 라우터
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }

        if (!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }

        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            
            return res.redirect('/');
        });
    })(req, res, next); // 라우터 미들웨어 안의 라우터! 사용자 정의 기능을 추가하고 싶을 때 내부 미들웨어에 (req, res, next)를 붙여서 호출
});

// 3. 로그아웃 라우터
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout(); // req.user 객체 제거
    req.session.destroy(); // req.session 객체 내용 제거
    res.redirect('/'); // 메인으로 되돌아가기 return 하고 안 하고 차이 ???
});

module.exports = router;