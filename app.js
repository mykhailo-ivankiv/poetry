var express = require('express'),
    app = express(),
    Q = require("q"),
    qFS = require("q-io/fs"),
    handlebars = require("handlebars"),

    mongojs = require('mongojs'),
    db = mongojs("poetry"),
    collection = db.collection('poetry');

function randomFromInterval(from,to){
    return Math.floor(Math.random()*(to-from+1)+from);
}

app
    .use(express.bodyParser())
    .use('/assets', express.static(__dirname + '/assets'))
    .use('/bower_components',express.static(__dirname + '/bower_components'))

    .get('/', function(req, res){
        qFS.read('assets/index.html')
            .then(function(template){
                return handlebars.compile(template);
            })
            .then (function(template){
                var deferred = Q.defer();

                collection.find().count(function(err, count){
                    var skip = Math.round(randomFromInterval(0, count - 1));

                    collection.find({}).skip(skip).limit(1).toArray(function(err, items) {
                        deferred.resolve (template(items[0]))
                    });
                });

                return deferred.promise;
            })
            .then(function(html){
                res.send(html);
            })
            .fail(function(err){
                console.log(err);
            })
    })

    .get('/search', function(req, res){
        collection.find({
            $or: [
                { author : { $regex: req.query.query, $options: 'i' }},
                { poem   : { $regex: req.query.query, $options: 'i' }}
            ]})
            .limit(10)
            .toArray(function(err, data){
                res.send({items: data});
            })
    })


    .post('/add', function(req, res){
        collection.insert(req.body, {w:1}, function(err, result) {
            res.send("Ok")
        });
    })

    .get('/new', function(req, res){
        qFS.read('assets/add.html')
            .then(function(template){
                return handlebars.compile(template);
            })
            .then(function(template){
                return template({});
            })
            .then(function(html){
                res.send(html);
            })
            .fail(function(err){
                console.log(err);
            })
    })
    .listen(3000);