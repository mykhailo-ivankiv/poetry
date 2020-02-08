import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import Author from "../Author/Author.js";
import AuthorsList from "../AuthorsList/AuthorsList.js";
// Styles
import "awsm.css/dist/awsm.css";
import "./App.css";
import BEM from "../../utils/BEM.js";
const b = BEM("App.css");

const App = () => (
  <Router>
    <main className={b()}>
      <h1>
        <Link to="/">Poetry</Link>
      </h1>

      <Switch>
        <Route path="/author/:id" children={<Author />} />
        <Route path="/" children={<AuthorsList />} />
      </Switch>
    </main>
  </Router>
);

export default App;
