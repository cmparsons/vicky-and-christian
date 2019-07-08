import React from "react";
import { Container } from "semantic-ui-react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/app";
import { Link } from "@reach/router";
import GuestList from "./GuestList";

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

function AdminContainer() {
  return (
    <Container>
      <GuestList />
      <div style={{ textAlign: "center" }}>
        <Link to="/">Go Home</Link>
      </div>
    </Container>
  );
}

function AdminContainerWithAuth() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    return firebase.auth().onAuthStateChanged(user => {
      setIsLoggedIn(!!user);
    });
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <AdminContainer />
      ) : (
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      )}
    </>
  );
}

export default function Admin() {
  if (process.env.NODE_ENV === "production") {
    return <AdminContainerWithAuth />;
  }

  return <AdminContainer />;
}
