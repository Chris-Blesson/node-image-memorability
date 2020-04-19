const express = require('express')
const app = express()
const https = require("https");
const axios = require("axios");
var fs = require("fs");
const multer = require("multer");
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "media/");
    },
    filename: function(req, file, cb) {
        cb(null, (file.originalname)); //Appending .jpg
    },
});
const path = require('path')
const upload = multer({ storage: storage });
const bodyParser = require('body-parser')
const staticFilesPath = path.join(__dirname, '../static')
app.set('view engine', 'hbs')
app.use(express.static(staticFilesPath))

app.get('/', (req, res) => {
    res.render('index')
})


app.post("/imageUpload", upload.single("images"), (req, res) => {
    console.log("End point Hit");
    console.log(req.file);
    fs.readFile(req.file.path, function(err, data) {

        axios
            .post("http://127.0.0.1:500/predict", {
                files: {
                    userid: (null, "vinoth"),
                    image: data,
                }
            })
            .then((res) => {
                let apiData = res
                console.log(apiData);
            })
            .catch((error) => {
                console.error(error);
            });

    });
});

app.listen(3000, () => {
    console.log('Listening on port 3000')
})