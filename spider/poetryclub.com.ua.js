const { range, pipe, map } = require("ramda");

const fs = require("fs").promises,
  { JSDOM } = require("jsdom"),
  axios = require("axios"),
  iconv = require("iconv-lite"),
  DATA_FOLDER = "./data/poetryclub.com.ua",
  AUTHORS_DATA_PATH = "./data/poetryclub.com.ua/authors.json",
  DOMAIN = "http://www.poetryclub.com.ua";

const getHTML = url =>
  axios
    .get(url, { responseType: "arraybuffer" })
    .then(response => iconv.decode(response.data, "win1251"))
    .catch(error => console.log(error));

const writeJsonToFile = async (filePath, data) =>
  fs.writeFile(filePath, JSON.stringify(data, null, 2));

const getJSONFromFile = async path => {
  const text = await fs.readFile(path, "utf8");
  return JSON.parse(text);
};

const getAuthorsListFromHTML = html =>
  [...new JSDOM(html).window.document.querySelectorAll("a.buttn")].map(el => ({
    author: el.innerHTML,
    link: el.getAttribute("href")
  }));

const getPoem = async listId => {
  const { author, poems } = await getJSONFromFile(
    `${DATA_FOLDER}/authors/${listId}.json`
  );

  await Promise.all(
    poems.map(async ({ name, link }, poemId) => {
      const html = await getHTML(DOMAIN + "/" + link);
      const data = {
        author,
        name,
        link,
        html: new JSDOM(html).window.document.querySelectorAll(".main")[1]
          .innerHTML
      };

      await writeJsonToFile(
        `${DATA_FOLDER}/poems/${listId}.${poemId}.json`,
        data
      );
      console.log(`${listId}.${poemId} poem saved.`);
    })
  );

  console.log(listId + " all saved.");
};

const saveAuthorListToFile = async (url, filePath) => {
  try {
    const authorsHTML = await getHTML(url);
    const authors = getAuthorsListFromHTML(authorsHTML);
    return writeJsonToFile(filePath, authors);
  } catch (e) {
    console.log(e);
  }
};

const getAuthorPoemLIst = async ({ author, link }) => ({
  author,
  link,
  poems: [
    ...new JSDOM(await getHTML(DOMAIN + link)).window.document.querySelectorAll(
      ".poem10"
    )
  ].map(el => ({
    name: el.innerHTML,
    link: el.getAttribute("href")
  }))
});

Promise.all([
  // Get authors
  // saveAuthorListToFile(DOMAIN + "/poets_of_ua.php", AUTHORS_DATA_PATH)

  // Get poem list
  // (async () =>
  //   Promise.all(
  //     (await getJSONFromFile(AUTHORS_DATA_PATH)).map(async (author, i) => {
  //       try {
  //         const poemList = await getAuthorPoemLIst(author);
  //         await writeJsonToFile(`${DATA_FOLDER}/authors/${i}.json`, poemList);
  //
  //         console.log(`[${i}] ${author.author} -> done`);
  //         return "ok ";
  //       } catch (e) {
  //         console.log(`e`);
  //         return "err";
  //       }
  //     })
  //   ))()

  async () => {
    const list = range(0, 5);


  }
])
  .then(messages => {
    console.log("-----------------");
    console.log(messages.join(" | "));
  })
  .catch(e => console.log(e));
