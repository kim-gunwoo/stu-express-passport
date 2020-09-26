module.exports = (app) => {
    const authData = {
        email: "id",
        password: "123",
        nickname: "nick-123",
    };

    // passport 및 local 스토리지 설정
    const passport = require("passport"),
        LocalStrategy = require("passport-local").Strategy;

    // passport 사용
    app.use(passport.initialize());
    app.use(passport.session());

    /* 
    app.get("/flash", function (req, res) {
        // Set a flash message by passing the key, followed by the value, to req.flash().
        req.flash("msg", "Flash is back!!");
        res.send("flash");
    });

    app.get("/flash-display", function (req, res) {
        // Get an array of flash messages by passing the key to req.flash()
        let fmsg = req.flash();
        console.log(fmsg);
        res.send(fmsg);
    });
    */
    // 로그인 검증이 완료 되었을 경우
    // 로그인 검증 성공 후 세션 저장
    passport.serializeUser(function (user, done) {
        console.log(`serializeUser  ${user}`);
        done(null, user.email);
    });
    // 로그인 여부 체크
    passport.deserializeUser(function (id, done) {
        console.log(`deserializeUser`);
        done(null, authData);
    });

    // 로그인시 검증
    passport.use(
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "pwd",
            },
            function (username, password, done) {
                if (username === authData.email) {
                    if (password === authData.password) {
                        return done(null, authData, {
                            message: "Welcome.",
                        });
                    } else {
                        return done(null, false, {
                            message: "Incorrect password.",
                        });
                    }
                } else {
                    return done(null, false, {
                        message: "Incorrect username.",
                    });
                }
            }
        )
    );
    return passport;
};
