import React from "react";
import RSVPForm from "./RSVPForm";
import { Container, Grid, Header, Segment } from "semantic-ui-react";

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
          <Segment stacked>
            <RSVPForm />
          </Segment>
        </Grid.Column>
      </Grid>
    </Container>
  );
}
