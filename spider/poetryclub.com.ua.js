const fs = require("fs").promises,
  { JSDOM } = require("jsdom"),
  Q = require("q"),
  qFS = require("q-io/fs"),
  axios = require("axios"),
  iconv = require("iconv-lite"),
  DATA_FOLDER = "./data/poetryclub.com.ua",
  AUTHORS_DATA_PATH = "./data/poetryclub.com.ua/authors.json",
  DOMAIN = "http://www.poetryclub.com.ua";

const getHTML = url =>
  axios
    .get(url, { responseType: "arraybuffer" })
    .then(response => iconv.decode(response.data, "win1251"))
    .catch(error => {
      console.log(error);
    });

const getAuthorsListFromHTML = html =>
  [...new JSDOM(html).window.document.querySelectorAll("a.buttn")].map(el => ({
    author: el.innerHTML,
    link: el.getAttribute("href")
  }));

function getPoemsList(authors) {
  authors.forEach(function(author, i) {
    getHTML(DOMAIN + author.link).then(function(html) {
      jsdom.env({
        html: html,
        scripts: ["http://code.jquery.com/jquery.js"],
        done: function(errors, window) {
          var $ = window.$,
            data = {
              author: author.author,
              poems: []
            };

          $(".poem10").each(function(i, el) {
            data.poems.push({
              name: $(el).html(),
              link: $(el).attr("href")
            });
          });

          fs.writeFileSync(
            DATA_FOLDER + "/data." + i + ".json",
            JSON.stringify(data, null, 4)
          );
          console.log(i + " Poems list saved");
        }
      });
    });
  });
}

function getPoem(i) {
  qFS
    .read(DATA_FOLDER + "/data." + i + ".json")
    .then(function(data) {
      return JSON.parse(data);
    })
    .then(function(data) {
      var poems = data.poems;

      var queue = Q.all(
        poems.map(function(poem) {
          var deferred = Q.defer();

          getHTML(DOMAIN + "/" + poem.link).then(function(html) {
            jsdom.env({
              html: html,
              scripts: ["http://code.jquery.com/jquery.js"],
              done: function(err, window) {
                var $ = window.$;
                deferred.resolve({
                  name: poem.name,
                  html: $(".main")[1].innerHTML
                });
              }
            });
          });

          return deferred.promise;
        })
      ).then(function(poems) {
        return {
          author: data.author,
          poems: poems
        };
      });

      return queue;
    })
    .then(function(data) {
      fs.writeFileSync(
        DATA_FOLDER + "/final.data." + i + ".json",
        JSON.stringify(data, null, 4)
      );
      console.log(i + " Poems saved.");
      getPoem(i + 1);
    })
    .fail(function(err) {
      console.log(err);
    });
}

function getPoems() {
  var i, data;

  for (i = 113; i < 130; i++) {
    (function(i) {
      qFS
        .read(DATA_FOLDER + "/data." + i + ".json")
        .then(function(data) {
          return JSON.parse(data);
        })
        .then(function(data) {
          var poems = data.poems;

          var queue = Q.all(
            poems.map(function(poem) {
              var deferred = Q.defer();

              getHTML(DOMAIN + "/" + poem.link).then(function(html) {
                jsdom.env({
                  html: html,
                  scripts: [
                    "http://localhost:3000/assets/src/jquery-2.0.3.min.js"
                  ],
                  done: function(err, window) {
                    var $ = window.$;
                    deferred.resolve({
                      name: poem.name,
                      html: $(".main")[1].innerHTML
                    });
                  }
                });
              });

              return deferred.promise;
            })
          ).then(function(poems) {
            return {
              author: data.author,
              poems: poems
            };
          });

          return queue;
        })
        .then(function(data) {
          fs.writeFileSync(
            DATA_FOLDER + "/final.data." + i + ".json",
            JSON.stringify(data, null, 4)
          );
          console.log(i + " Poems saved.");
        })
        .fail(function(err) {
          console.log(err);
        });
    })(i);
  }
}

const saveAuthorListToFile = async (url, filePath) => {
  try {
    const authorsHTML = await getHTML(url);
    const authors = getAuthorsListFromHTML(authorsHTML);

    await fs.writeFile(filePath, JSON.stringify(authors, null, 4));
  } catch (e) {
    console.log(e);
  }
};

const getJSONFromFile = async path => {
  const text = await fs.readFile(path, "utf8");
  return JSON.parse(text);
};

Promise.all([
  // saveAuthorListToFile(DOMAIN + "/poets_of_ua.php", AUTHORS_DATA_PATH)
  getJSONFromFile(AUTHORS_DATA_PATH)
])
  .then(messages => console.log(messages.join("\n")))
  .catch(e => console.log(e));

//getPoemsList();

//getPoems();

// getPoem(215);
