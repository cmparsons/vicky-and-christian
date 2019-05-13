import React from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Segment,
  Popup,
  Container
} from "semantic-ui-react";

const wait = (delay = 2000) =>
  new Promise(resolve => setTimeout(resolve, delay));

export default function RSVP() {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [eventCode, setEventCode] = React.useState("");
  const [isSubmitting, setSubmitting] = React.useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    await wait(2000);
    setSubmitting(false);
  }

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
          <Form size="large" onSubmit={handleSubmit} loading={isSubmitting}>
            <Segment stacked>
              <Form.Group widths="equal">
                <Form.Input
                  required
                  value={firstName}
                  placeholder="First Name"
                  label="First name"
                  onChange={e => setFirstName(e.target.value)}
                />
                <Form.Input
                  required
                  value={lastName}
                  placeholder="Last Name"
                  label="Last name"
                  onChange={e => setLastName(e.target.value)}
                />
              </Form.Group>
              <Popup
                trigger={
                  <Form.Input
                    required
                    icon="lock"
                    iconPosition="left"
                    value={eventCode}
                    label="Event code"
                    placeholder="Event Code"
                    onChange={e => setEventCode(e.target.value)}
                  />
                }
                header="Event Code"
                content="Check your invite to find the event code"
                on="focus"
              />

              <Button color="blue" fluid size="large">
                Find Your Invitation
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    </Container>
  );
}
