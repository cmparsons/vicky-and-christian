import React from "react";
import RSVPForm from "./RSVPForm";
import { Container, Grid, Header, Segment } from "semantic-ui-react";
import { Link } from "@reach/router";

export default function RSVP() {
  return (
    <Container>
      <Grid verticalAlign="middle" centered style={{ height: "100vh" }}>
        <Grid.Column style={{ maxWidth: 650 }}>
          <Header as="h2" textAlign="center">
            <span role="img" aria-label="RSVP">
              📝
            </span>
            RSVP
          </Header>
          <Segment raised>
            <RSVPForm />
          </Segment>
          <div style={{ textAlign: "center" }}>
            <Link to="/">Go Home</Link>
          </div>
        </Grid.Column>
      </Grid>
    </Container>
  );
}
