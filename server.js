const mongoose = require("mongoose")
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const multer = require('multer');
const fs = require('fs');
const ObjectId = mongoose.Types.ObjectId
mongoose.connect('mongodb://127.0.0.1/shop', {
    useNewUrlParser: "true",
})
mongoose.connection.on("error", err => {
    console.log("err", err)
})
mongoose.connection.on("connected", (err, res) => {
    console.log("mongoose is connected")
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(express.static('public'));
const Products = require('./products')

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
        console.log(req);
        console.log(file);
        cb(null, file.originalname);
    }
})

var upload = multer({ storage: storage })

const { static } = require('express');
app.use('/uploads/', static('uploads/'));


app.post('/product/create', upload.single('image'), function(req, res, next) {
    console.log(req.file.path);
    let fileUrl = "";
    if (req.file) {
        fileUrl = req.protocol + "://" + req.host + ':3000/' + req.file.path;
        console.log(fileUrl);
    }
    const product = new Products({
        name: req.body.name,
        description: req.body.description,
        price: parseInt(req.body.price),
        image: fileUrl
    });
    product.save(function(err) {
        if (err) {
            res.send({
                "isError": true,
                "msg": "please check request body",
                "data": {}
            })
        } else {
            res.send({
                "isError": false,
                "msg": "Product created",
                "data": {}
            })
        }
    });
});

app.get('/products/list', (req, res) => {
    Products.find({}, (err, result) => {

        if (result.length > 0) {
            res.send({
                "isError": false,
                "msg": "List Found",
                "data": result
            })
        } else {
            res.send({
                "isError": true,
                "msg": "No Product found",
                "data": {}
            })
        }

    })

});
app.get('/products/get', (req, res) => {
    Products.findOne({ _id: ObjectId(req.query.id) }, (err, result) => {

        if (result) {
            res.send({
                "isError": false,
                "msg": "Product Found",
                "data": result
            })
        } else {
            res.send({
                "isError": true,
                "msg": "No Product found",
                "data": {}
            })
        }

    })

});
app.post('/products/delete', (req, res) => {
    Products.remove({ _id: ObjectId(req.body.id) }, (err, result) => {
        // console.log(result)
        if (result.deletedCount == 1) {
            res.send({
                "isError": false,
                "msg": "Product deleted",
                "data": {}
            })
        } else {
            res.send({
                "isError": true,
                "msg": "Please check product id",
                "data": {}
            })
        }

    })

});

app.listen(3000, () => console.log('Server started on port 3000'));