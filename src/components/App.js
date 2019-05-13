import React from "react";
import { Router } from "@reach/router";
import Home from "./Home/Home";
import RSVP from "./RSVP/RSVP";

export default function App() {
  return (
    <Router>
      <Home path="/" />
      <RSVP path="/rsvp" />
    </Router>
  );
}
