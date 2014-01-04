var LanguageDetect = require('languagedetect');
var lngDetector = new LanguageDetect();

console.log(lngDetector.detect('Йдеш на мене подібний'));


var express = require('express'),
    exphbs  = require('express3-handlebars'),
    app = express(),
    Q = require("q"),
    FS = require("fs")
    qFS = require("q-io/fs"),
    handlebars = require("handlebars"),

    mongojs = require('mongojs'),
    BSON = require('mongodb').BSONPure,
    db = mongojs("poetry"),
    collection = db.collection('poetry');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

function randomFromInterval(from,to){
    return Math.floor(Math.random()*(to-from+1)+from);
}

app
    .use(express.bodyParser())
    .use('/assets', express.static(__dirname + '/assets'))
    .use('/bower_components',express.static(__dirname + '/bower_components'))

    .get('/', function(req, res){

            (function(){
                    var deferred = Q.defer();

                    collection
                        .find()
                        .count(function(err, count){
                            var skip = Math.round(randomFromInterval(0, count - 1));
                            deferred.resolve(skip);
                        });

                    return deferred.promise;
            })()

            .then(function (skipCount) {
                var deferred = Q.defer();
                collection
                    .find({})
                    .skip(skipCount).limit(1)
                    .toArray(function(err, items) {
                        deferred.resolve (items[0]);
                    });
                return deferred.promise;
            })
            .then(function(data){
                res.redirect("/poems/" + data._id);
            })
            .fail(function(err){
                console.log(err);
            })
    })

    .get('/authors', function(req, res){

            (function(){
                var deferred = Q.defer();
                collection.distinct("author", function(err, data){ deferred.resolve({authors:data}); });
                return deferred.promise;
            })()
            .then(function(data){
                res.render('authors', data);
            })
            .fail(function(err){console.log(err);})
    })

    .get('/poems/:id', function(req, res){
            (function(){
                var deferred = Q.defer();

                var id = new BSON.ObjectID(req.params.id);
                collection.findOne({'_id': id}, function(err, data){
                    deferred.resolve(data)
                });
                return deferred.promise;
            })()
            .then(function (data) {
                res.render('poem', data);
            })
            .fail(function(err){ console.log(err);})


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