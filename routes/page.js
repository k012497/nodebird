const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User } = require('../models');

const router = express.Router();

// 라우터용 미들웨어_ 템플릿 엔진에서 사용할 변수 세팅
router.use((req, res, next) => {
    res.locals.user = req.user; // 넌적스에서 user 객체를 통해 사용자 정보에 접근 가능하도록
    res.locals.followerCount = req.user ? req.user.Followers.length : 0;
    res.locals.followingCount = req.user ? req.user.Followings.length : 0;
    res.locals.folloerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
    next();
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.send('profile', {title:'내 정보'});
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', { title: '회원가입'});
});

router.get('/hashtag', async (req, res, next) => {
    const query = req.query.hashtag;

    if (!query) {
        return res.redirect('/'); // 해시태그 값이 없는 경우 메인으로
    }

    try {
        const hashtag = await hashtag.findOne({ where: { title: query } });
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts({ include: [{ model: User }] }); // 해당 태그 글 + 작성자 정보 가져오기
        }

        return res.render('main', {
            title: `${query} || NodeBird`,
            twits: posts, // 조회해서 가져온 포스트만 가져와서 메인 페이지 렌더링
        })
    } catch (error) {
        console.error(error);
        return next(error);
    }
})

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