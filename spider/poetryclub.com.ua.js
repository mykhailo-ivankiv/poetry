"use strict";
var fs = require("fs"),
    jsdom = require("jsdom"),
    iconv = require("iconv"),
    Q = require ("q"),
    qFS = require("q-io/fs"),
    request = require("request"),

    DATA_FOLDER = "spider/data/poetryclub.com.ua",
    AUTHORS_JSON = "/authors.json",
    DOMAIN = "http://www.poetryclub.com.ua";



function getHTML (url){
    var deferred = Q.defer();
    request({
        uri: url,
        encoding:"binary"
    }, function(err, res, body){
        var body = new Buffer(body, 'binary'),
            conv = new iconv.Iconv('windows-1251', 'utf8');
        body = conv.convert(body).toString()

        deferred.resolve(body);
    })

    return deferred.promise;
}


function getAuthorsList(html) {
    jsdom.env({
        html : html,
        scripts : ["http://code.jquery.com/jquery.js"],
        done : function (errors, window) {
            var data = {authors: []};
            var $ = window.$;
            $("a.buttn").each(function(i, el){
                data.authors.push({
                    author : $(el).html(),
                    link : $(el).attr("href")
                });
            });

            fs.writeFileSync(DATA_FOLDER + AUTHORS_JSON, JSON.stringify(data, null, 4));

            console.log("Authors data saved");
        }
    })
};

function getAuthorsJSON(){
    return JSON.parse(fs.readFileSync( DATA_FOLDER + AUTHORS_JSON, "utf-8"));
}

function getPoemsList(){
    getAuthorsJSON()
        .authors
        .forEach(function(author, i){

            getHTML(DOMAIN + author.link)
                .then (function(html){
                    jsdom.env({
                        html : html,
                        scripts : ["http://code.jquery.com/jquery.js"],
                        done : function (errors, window) {
                            var $ = window.$,
                                data = {
                                    author : author.author,
                                    poems : []
                                };

                            $(".poem10").each(function(i, el){
                                data.poems.push({
                                    name : $(el).html(),
                                    link : $(el).attr("href")
                                })
                            });

                            fs.writeFileSync(DATA_FOLDER + "/data." + i + ".json", JSON.stringify(data, null, 4));
                            console.log(i + " Poems list saved");
                        }
                    })


                })

        })
}

function getPoem(i){
    qFS
        .read(DATA_FOLDER + "/data." + i + ".json")
        .then(function(data){
            return JSON.parse(data);
        })
        .then(function(data){
            var poems = data.poems;

            var queue = Q.all(poems.map(function(poem){
                    var deferred = Q.defer();

                    getHTML(DOMAIN + "/" + poem.link)
                        .then(function(html){
                            jsdom.env({
                                html : html,
                                scripts : ["http://code.jquery.com/jquery.js"],
                                done: function(err, window){
                                    var $ = window.$;
                                    deferred.resolve({
                                        name: poem.name,
                                        html: $(".main")[1].innerHTML
                                    })

                                }
                            })
                        })

                    return deferred.promise;
                })).then(function(poems){
                    return {
                        author : data.author,
                        poems : poems
                    }
                })

            return queue;
        })
        .then (function(data){
            fs.writeFileSync(DATA_FOLDER + "/final.data." + i + ".json", JSON.stringify(data, null, 4));
            console.log(i + " Poems saved.");
            getPoem(i+1)
        })
        .fail(function(err){ console.log(err);})
}

function getPoems() {
    var i,
        data;

    for (i=113; i < 130; i++){
        (function(i){
            qFS
                .read(DATA_FOLDER + "/data." + i + ".json")
                .then(function(data){
                    return JSON.parse(data);
                })
                .then(function(data){
                    var poems = data.poems;

                    var queue = Q.all(poems.map(function(poem){
                        var deferred = Q.defer();

                        getHTML(DOMAIN + "/" + poem.link)
                            .then(function(html){
                                jsdom.env({
                                    html : html,
                                    scripts : ["http://localhost:3000/assets/src/jquery-2.0.3.min.js"],
                                    done: function(err, window){
                                        var $ = window.$;
                                        deferred.resolve({
                                            name: poem.name,
                                            html: $(".main")[1].innerHTML
                                        })

                                    }
                                })
                            })

                        return deferred.promise;
                    })).then(function(poems){
                            return {
                                author : data.author,
                                poems : poems
                            }
                    })

                    return queue;
                })
                .then (function(data){
                    fs.writeFileSync(DATA_FOLDER + "/final.data." + i + ".json", JSON.stringify(data, null, 4));
                    console.log(i + " Poems saved.");
                })
                .fail(function(err){ console.log(err);})
        })(i);
    }
}

//getHTML(DOMAIN + "/poets_of_ua.php")
//    .then(getAuthorsList);

//getPoemsList();

//getPoems();

getPoem(215);