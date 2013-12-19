var express = require('express');
var app = express();

var Q = require("q");
var qFS = require("q-io/fs");
var handlebars = require("handlebars")


var mongojs = require('mongojs');
var db = mongojs("poetry");
var collection = db.collection('poetry');

function randomFromInterval(from,to){
    return Math.floor(Math.random()*(to-from+1)+from);
}


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

app.get('/search', function(req, res){
    collection.find({
        $or: [
            { author : { $regex: req.query.query, $options: 'i' }},
            { poem   : { $regex: req.query.query, $options: 'i' }}
        ]})
        .limit(10)
        .toArray(function(err, data){
            res.send({items: data});
        })

    /**
     * Temporarily disabled full text search.
     */
//    collection.runCommand("text", {search:req.query.query, language: "russian"}, function(err, data) {
//        res.send({items: data.results.map(function(el){return el.obj})});
//    });
})



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