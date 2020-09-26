const express = require("express");
const router = express.Router();
const template = require("../models/template");
/*
const authData = {
    email: "id",
    password: "123",
    nickname: "nick-123",
};
*/
module.exports = (passport) => {
    router.get("/login", (req, res) => {
        const fmsg = req.flash();
        let feedback = "";
        if (fmsg.error) {
            feedback = fmsg.error[0];
        }
        const title = "WEB - login";
        const list = template.list(req.list);
        const body = `<div>${feedback}</div>
                    <form action="/auth/login_process" method="post">
                    <p><input type="text" name="email" placeholder="email"></p>
                    <p><input type="password" name="pwd" placeholder="password"></p>
                    <p>
                        <input type="submit" value="login">
                    </p>
                    </form>`;
        const control = ``;
        const html = template.HTML(title, list, body, control);
        res.send(html);
    });

    /*
    router.post("/login_process", (req, res) => {
        var post = req.body;
        var email = post.email;
        var password = post.pwd;
        if (email === authData.email && password === authData.password) {
            //res.send("Welcome!");
            req.session.is_logined = true;
            req.session.nickname = authData.nickname;
            req.session.save(() => {
                res.redirect(`/`);
            });
        } else {
            res.send("Who?");
        }
    });
    */

    router.get("/logout", (req, res) => {
        /*req.session.destroy((err) => {
        res.redirect("/");
    });*/
        req.logout();
        req.session.save(() => {
            res.redirect("/");
        });
    });

    // 로그인 검증 단계 이후 성공여부에 따라 이동
    router.post(
        "/login_process",
        passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/auth/login",
            failureFlash: true,
            successFlash: true,
        })
    );
    return router;
};
