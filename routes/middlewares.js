exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) { // isAuthenticated 로그인 여부를 판단하는 메서드
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('이미 로그인 했음!');
        res.redirect(`/?error${message}`);
    }
};