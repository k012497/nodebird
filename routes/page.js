const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User } = require('./models');

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

router.get('/', async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick'],
            },
            order: [['createdAt', 'DESC']],
        });
        res.render('main', {
            title: 'NodeBird',
            twits: posts,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});
module.exports = router;