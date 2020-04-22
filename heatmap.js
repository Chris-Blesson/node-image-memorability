const express = require('express')
const app = express()
var fs = require("fs");
const multer = require("multer");
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "media/");
    },
    filename: function(req, file, cb) {
        cb(null, (file.originalname));
    },
});
const path = require('path')
let request = require('request');
const upload = multer({ storage: storage });
const staticFilesPath = path.join(__dirname, '../static')
app.set('view engine', 'ejs')
app.use(express.static(staticFilesPath))
app.use(express.static('media'));

app.get('/', (req, res) => {
    res.render('index')
})


app.post("/imageUpload", upload.single("images"), (req, res) => {
    let path = `./${req.file.destination}${req.file.originalname}`
    var options = {
        'method': 'POST',
        'url': 'http://127.0.0.1:500/predict',
        'headers': {},
        formData: {
            'image': {
                'value': fs.createReadStream(path),
                'options': {
                    'filename': path,
                    'contentType': null
                }
            }
        }
    };
    request(options, function(error, response) {
        if (error) throw new Error(error);
        let responseData = JSON.parse(response.body)
        require("fs").writeFile("./media/heatmap.png", responseData.heatmap, 'base64', function(err) {
            res.render('slider.ejs', { data: { 'image1': req.file.originalname, "image2": "heatmap.png", "score": responseData.score } })
        });

    });

})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})