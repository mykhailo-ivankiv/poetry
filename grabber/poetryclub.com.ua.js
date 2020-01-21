import shortid from "shortid";
import {
  getHTML,
  queryDocument,
  writeJsonToFile,
  asyncMap,
  getAsyncGenerator
} from "./helpers.js";

const DOMAIN = "http://www.poetryclub.com.ua";

const grabAuthorList = async url =>
  queryDocument(await getHTML(url), "a.buttn").map(el => ({
    name: el.innerHTML,
    link: el.getAttribute("href")
  }));

const grabAuthorPoemList = async ({ name, link }) => ({
  name,
  link,
  poems: [...queryDocument(await getHTML(DOMAIN + link), ".poem10")].map(
    el => ({
      title: el.innerHTML,
      link: el.getAttribute("href")
    })
  )
});

const grabPoem = async ({ title, link }) => ({
  title,
  link,
  html: queryDocument(await getHTML(DOMAIN + "/" + link), ".main")[1].innerHTML
});

const grab = async DOMAIN => {
  console.log(` I. Grab data from ${DOMAIN}`);

  const authors = await grabAuthorList(DOMAIN + "/poets_of_ua.php");
  const listByAuthors = getAsyncGenerator(authors, grabAuthorPoemList);

  console.log(`II. Get list of poems by author`);

  await asyncMap(listByAuthors, async (author, i) => {
    console.log("");
    console.log(`    ${i}. ${author.name}`);

    const authorId = shortid.generate();
    const poems = getAsyncGenerator(author.poems, grabPoem);

    const poemIds = await asyncMap(poems, async (poem, j) => {
      const id = shortid.generate();

      await writeJsonToFile(`./data/tmp/poems/${id}.json`, {
        author: authorId,
        id,
        ...poem
      });

      console.log(`    ${i}.${j} ${poem.title} ✓`);

      return id;
    });

    await writeJsonToFile(`./data/tmp/authors/${authorId}.json`, {
      ...author,
      id: authorId,
      poems: poemIds
    });
  });
};

grab(DOMAIN);
