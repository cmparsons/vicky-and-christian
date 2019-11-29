import React from "react";
import { Router } from "@reach/router";
import { Dimmer, Loader } from "semantic-ui-react";
import Home from "./Home/Home";

const Admin = React.lazy(() => import("./Admin/Admin"));

function Loading() {
  return (
    <Dimmer active inverted style={{ height: "100vh" }}>
      <Loader size="large" inverted />
    </Dimmer>
  );
}

export default function App() {
  return (
    <React.Suspense fallback={<Loading />}>
      <Router>
        <Home path="/" />
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
