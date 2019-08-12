import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./views/Login";
import Main from "./views/Main";

export default function Routes() {
  return (
    <BrowserRouter>
      <Route exact path="/dev/:id" component={Main} />
      <Route exact path="/" component={Login} />
    </BrowserRouter>
  );
}
