import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Author from "../Author/Author.js";
import AuthorsList from "../AuthorsList/AuthorsList.js";
import "awsm.css/dist/awsm.css";

const App = () => (
  <main>
    <Router>
      <Switch>
        <Route path="/author/:id" children={<Author />} />
        <Route path="/" children={<AuthorsList />} />
      </Switch>
    </Router>
  </main>
);

export default App;
