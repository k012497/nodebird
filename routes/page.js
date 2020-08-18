const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

// 라우터용 미들웨어_ 템플릿 엔진에서 사용할 변수 세팅
router.use((req, res, next) => {
    res.locals.user = req.user; // 넌적스에서 user 객체를 통해 사용자 정보에 접근 가능하도록
    res.locals.user = null;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.folloerIdList = [];
    next();
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.send('profile', {title:'내 정보'});
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', { title: '회원가입'});
});

router.get('/', (req, res, next) => {
    const twits = [];
    res.render('main', {
        title: 'NodeBird',
        twits
    });
});

module.exports = router;