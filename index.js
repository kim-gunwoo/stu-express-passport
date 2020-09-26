const express = require("express");
const app = express();
const port = 9999;

const fs = require("fs");
const bodyParser = require("body-parser");
const compression = require("compression");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("connect-flash");

/*
추가하면 자동으로 https 로 변경 문제가 발생함
const helmet = require("helmet");
app.use(helmet());
*/

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(
    session({
        secret: "secret-key",
        resave: false,
        saveUninitialized: true,
        store: new FileStore(),
    })
);
app.use(flash());

const passport = require("./models/passport")(app);

const index = require("./router/index");
const topic = require("./router/topic");
const auth = require("./router/auth")(passport);
/*
미들웨어 사용하는 방법
app.use(function (request, response, next) {
    fs.readdir("./data", function (error, filelist) {
        request.list = filelist;
        next();
    });
});
*/
// get 으로 들어오는 모든 요청으로 변경
app.get("*", (req, res, next) => {
    fs.readdir("./data", (err, filelist) => {
        req.list = filelist;
        next();
    });
});

app.use("/", index);
app.use("/topic", topic);
app.use("/auth", auth);

app.use((req, res, next) => {
    res.status(404).send("Sorry cant find that!");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
