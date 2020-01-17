import {
  getHTML,
  getJSONFromFile,
  queryDocument,
  writeJsonToFile
} from "./helpers.js";

const DATA_FOLDER = "./data/poetryclub.com.ua";
const DOMAIN = "http://www.poetryclub.com.ua";

const getPoem = async listId => {
  const { author, poems } = await getJSONFromFile(
    `${DATA_FOLDER}/authors/${listId}.json`
  );

  console.log(`[start] ${author}.`);
  await Promise.all(
    poems.map(async ({ name, link }, poemId) => {
      const html = await getHTML(DOMAIN + "/" + link);
      const data = {
        author,
        name,
        link,
        html: queryDocument(html, ".main")[1].innerHTML
      };

      await writeJsonToFile(
        `${DATA_FOLDER}/poems/${listId}.${poemId}.json`,
        data
      );
      console.log(`    ${listId}.${poemId} ${name}`);
    })
  );

  console.log(`[done ] ==========`);
};

const getAuthorList = async (url, filePath) => {
  try {
    const authorsHTML = await getHTML(url);
    const authors = queryDocument(authorsHTML, "a.buttn").map(el => ({
      author: el.innerHTML,
      link: el.getAttribute("href")
    }));

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
  getAuthorList(DOMAIN + "/poets_of_ua.php").then(authorList =>
    writeJsonToFile(DATA_FOLDER + "/authors.json", authorList)
  )

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
  //   ))(),

  // Get poems
  // (async () => {
  //   async function* getPoems() {
  //     for (let i = 0; i < 1; i++) await getPoem(i);
  //   }
  //   for await (let value of getPoems()) {
  //   }
  // })()
])
  .then(messages => {
    console.log("-----------------");
    console.log(messages.join(" | "));
  })
  .catch(e => console.log(e));
