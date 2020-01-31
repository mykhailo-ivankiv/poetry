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

const grabPoem = async ({ title, link }) => {
  const html = queryDocument(await getHTML(DOMAIN + "/" + link), ".main")[1];


  return {
    title,
    link,
    html: html.textContent
  };
};

const grab = async (DOMAIN, { onAuthor, onPoem }) => {
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

      await onPoem({ author: authorId, id, ...poem });

      console.log(`    ${i}.${j} ${poem.title} ✓`);

      return id;
    });

    await onAuthor({
      ...author,
      id: authorId,
      poems: poemIds
    });
  });
};

grab(DOMAIN, {
  onPoem: async poem =>
    writeJsonToFile(`./data/new/poems/${poem.id}.json`, poem),
  onAuthor: async author =>
    writeJsonToFile(`./data/new/authors/${author.id}.json`, author)
});
