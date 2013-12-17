var express = require('express');
var app = express();

var Q = require("q");
var qFS = require("q-io/fs");
var handlebars = require("handlebars")

function randomFromInterval(from,to){
    return Math.floor(Math.random()*(to-from+1)+from);
}


// Retrieve
var MongoClient = require('mongodb').MongoClient;
var collection;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/poetry", function(err, db) {
    if(err) { return console.dir(err); }
    db.createCollection('poetry', function(err, collect) {
        if(err) { return console.dir(err); }
        collection = collect;
    });
});


app.use(express.bodyParser());
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/bower_components',express.static(__dirname + '/bower_components'));

app.get('/', function(req, res){
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
});

app.post('/add', function(req, res){
    collection.insert(req.body, {w:1}, function(err, result) {});
    res.send("Ok")
});

app.get('/new', function(req, res){
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
});

app.listen(3000);