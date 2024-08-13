import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Axios from "axios";
import HomePage from "./components/HomePage";
import AboutPage from "./components/AboutPage";
import NotFoundPage from "./components/NotFoundPage";

Axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
      <Route component={NotFoundPage} />
    </Switch>
  </Router>
);

ReactDOM.render(<App />, document.getElementById('root'));

export default App;