import shortid from "shortid";
import { getHTML, queryDocument, writeJsonToFile } from "./helpers.js";

const DOMAIN = "http://www.poetryclub.com.ua";

const grabPoem = async ({title, link}) => {
  const html = await getHTML(DOMAIN + "/" + link);
  return {
    title,
    link,
    html: queryDocument(html, ".main")[1].innerHTML
  };
};

const grabAuthorList = async url => {
  const authorsHTML = await getHTML(url);
  return queryDocument(authorsHTML, "a.buttn").map(el => ({
    name: el.innerHTML,
    link: el.getAttribute("href")
  }));
};

const grabAuthorPoemList = async (name, link) => ({
  name,
  link,
  poems: [...queryDocument(await getHTML(DOMAIN + link), ".poem10")].map(
    el => ({
      title: el.innerHTML,
      link: el.getAttribute("href")
    })
  )
});

async function* getAsyncGenerator(data, fn) {
  for (const item of data) yield fn(item);
}

async function* getAuthorPoemList(authorList) {
  for (const { name, link } of authorList) {
    yield grabAuthorPoemList(name, link);
  }
}

async function* getPoems(poems) {
  for (const { title, link } of poems) {
    yield grabPoem({title, link});
  }
}

const grab = async DOMAIN => {
  console.log(` I. Grab data from ${DOMAIN}`);

  const listByAuthors = getAuthorPoemList(
    await grabAuthorList(DOMAIN + "/poets_of_ua.php")
  );

  console.log(`II. Get list of poems by author`);

  let authorsCounter = 1;
  for await (let author of listByAuthors) {
    console.log("");
    console.log(`    ${authorsCounter}. ${author.name}`);

    const authorId = shortid.generate();
    const poems = getPoems(author.poems);
    let poemsCounter = 1;
    const poemIds = [];

    for await (let poem of poems) {
      const poemId = shortid.generate();
      await writeJsonToFile(`./data/poems/${poemId}.json`, {
        author: authorId,
        id: poemId,
        ...poem
      });
      poemIds.push(poemId);
      console.log(`    ${authorsCounter}.${poemsCounter++} ${poem.title} ✓`);
    }

    await writeJsonToFile(`./data/authors/${authorId}.json`, {
      ...author,
      id: authorId,
      poems: poemIds
    });

    authorsCounter += 1;
  }
};

grab(DOMAIN, DATA_FOLDER);
