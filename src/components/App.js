import React from "react";
import { Router } from "@reach/router";
import { Dimmer, Loader, Segment } from "semantic-ui-react";
import Home from "./Home/Home";
import RSVP from "./RSVP/RSVP";

const Admin = React.lazy(() => import("./Admin/Admin"));

function Loading() {
  return (
    <Segment style={{ height: "100vh" }}>
      <Dimmer active inverted>
        <Loader size="large" inverted />
      </Dimmer>
    </Segment>
  );
}

export default function App() {
  return (
    <React.Suspense fallback={<Loading />}>
      <Router>
        <Home path="/" />
        <RSVP path="/rsvp" />
        <Admin path="/admin" />
      </Router>
      <footer>
        &copy; 2019 Christian Parsons{" "}
        <span role="img" aria-hidden="true">
          👨‍💻
        </span>
      </footer>
    </React.Suspense>
  );
}
