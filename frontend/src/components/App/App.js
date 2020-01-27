import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Author from "../Author/Author.js";
import AuthorsList from "../AuthorsList/AuthorsList.js";

const App = () => (
  <Router>
    <Switch>
      <Route path="/author/:id" children={<Author />} />
      <Route path="/" children={<AuthorsList />} />
    </Switch>
  </Router>
);

export default App;
