import express from "express";
import authorRoute from "./routers/authors.js";

const app = express();
const API_PORT = 3000;

app.use("/authors", authorRoute);
app.listen(API_PORT, () => {
  console.log(`API is running on http://localhost:${API_PORT}`);
});
// app
//   .use(express.bodyParser())
//   .use("/assets", express.static(__dirname + "/assets"))
//   .use("/bower_components", express.static(__dirname + "/bower_components"))
//
//   .get("/", async (req, res) => {
//     (async () =>
//       new Promise((res, rej) => {
//         collection.find().count(function(err, count) {
//           res(Math.round(randomFromInterval(0, count - 1)));
//         });
//       }))
//       .then(
//         skipCount =>
//           new Promise((res, rej) =>
//             collection
//               .find({})
//               .skip(skipCount)
//               .limit(1)
//               .toArray((err, items) => res(items[0]))
//           )
//       )
//       .then(data => res.redirect("/poems/" + data._id))
//       .fail(err => console.log(err));
//   })
//
//   .get("/authors", function(req, res) {
//     new Promise((res, rej) => {
//       collection.distinct("author", (err, data) => res({ authors: data }));
//     })
//       .then(data => res.render("authors", data))
//       .fail(err => console.log(err));
//   })
//
//   .get("/authors/:author", (req, res) => {
//     const { author } = req.params;
//
//     new Promise((res, req) => {
//       collection.find({ author }).toArray((err, data) => {
//         res({
//           author,
//           poems: data.map(el => {
//             let poem = "\n" + el.poem; // "\n" + text + "\n" - it is hak for simplifying regex. (It for select first and last strings.)
//             poem = poem.match(/(\n[^\n]*){0,4}/)[0];
//             return {
//               _id: el._id,
//               poem: poem,
//               language: el.language
//             };
//           })
//         });
//       });
//     })
//       .then(data => res.render("author", data))
//       .fail(err => console.log(err));
//   })
//
//   .get("/poems/:id", (req, res) => {
//     new Promise((res, rej), () => {
//       const id = new BSON.ObjectID(req.params.id);
//       collection.findOne({ _id: id }, function(err, data) {
//         deferred.resolve(data);
//       });
//     })
//       .then(data => res.render("poem", data))
//       .fail(err => console.log(err));
//   })
//
//   .get("/search", (req, res) => {
//     collection
//       .find({
//         $or: [
//           { author: { $regex: req.query.query, $options: "i" } },
//           { poem: { $regex: req.query.query, $options: "i" } }
//         ]
//       })
//       .limit(10)
//       .toArray((err, data) => res.send({ items: data }));
//   })
//
//   .post("/add", (req, res) =>
//     collection.insert(req.body, { w: 1 }, (err, result) => res.send("Ok"))
//   )
