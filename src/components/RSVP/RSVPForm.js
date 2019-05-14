import React from "react";
import { Form, Popup, Radio, TextArea } from "semantic-ui-react";
import { Field } from "formik";
import Wizard from "./Wizard";

const wait = (delay = 2000) =>
  new Promise(resolve => setTimeout(resolve, delay));

export default function RSVPForm() {
  return (
    <Wizard
      initialValues={{
        firstName: "",
        lastName: "",
        eventCode: "",
        isAttending: "",
        mailingAddress: "",
        contactInfo: ""
      }}
      onSubmit={(values, { setSubmitting }) => {
        values.isAttending = values.isAttending === "true";

        // const eventsRef = firebase.firestore().collection("event");
        // const querySnapshot = await eventsRef.get();

        // const [realEventCode] = querySnapshot.docs;

        // if (realEventCode.data().code === eventCode) {
        //   console.log("eventCode match");
        // } else {
        //   console.log("eventCode did not match");
        // }

        // const guestsRef = firebase.firestore().collection('guests');

        // const guests = guestsRef
        //   .where('firstName', '==', firstName)
        //   .where('lastName', '==', lastName);

        // const guestsQuerySnapshot = await guests.get();
        // guestsQuerySnapshot.docs

        wait().then(() => {
          console.log(values);
          setSubmitting(false);
        });
      }}
    >
      <Wizard.Page
        validate={values => {
          if (
            process.env.REACT_APP_EVENT_CODE &&
            values.eventCode !== process.env.REACT_APP_EVENT_CODE
          ) {
            return {
              eventCode: "Invalid event code"
            };
          }

          return {};
        }}
      >
        <Form.Group widths="equal">
          <Field
            name="firstName"
            render={({ field }) => (
              <Form.Input
                {...field}
                required
                placeholder="First Name"
                label="First name"
              />
            )}
          />
          <Field
            name="lastName"
            render={({ field }) => (
              <Form.Input
                {...field}
                required
                placeholder="Last Name"
                label="Last name"
              />
            )}
          />
        </Form.Group>
        <Field
          name="eventCode"
          render={({ field }) => (
            <Popup
              trigger={
                <Form.Input
                  {...field}
                  required
                  icon="lock"
                  iconPosition="left"
                  label="Event code"
                  placeholder="Event Code"
                />
              }
              label="Event Code"
              content="Check your invite to find the event code"
              on="focus"
            />
          )}
        />
      </Wizard.Page>
      <Wizard.Page>
        <label
          style={{
            display: "block",
            marginBottom: "15px",
            fontWeight: "bold"
          }}
        >
          Will you be attending the wedding?
        </label>
        <Field
          name="isAttending"
          render={({ field, form }) => (
            <Form.Field
              {...field}
              control={Radio}
              id="isAttending_true"
              name="isAttending"
              label="Yes"
              value="true"
              checked={field.value === "true"}
              error={form.touched.isAttending && form.errors.isAttending}
            />
          )}
        />
        <Field
          name="isAttending"
          render={({ field, form }) => (
            <Form.Field
              {...field}
              control={Radio}
              name="isAttending"
              id="isAttending_false"
              label="No"
              value="false"
              checked={field.value === "false"}
              error={form.touched.isAttending && form.errors.isAttending}
            />
          )}
        />
      </Wizard.Page>
      <Wizard.Page>
        <Field
          name="mailingAddress"
          render={({ field }) => (
            <Form.Field
              {...field}
              control={TextArea}
              label="What is your mailing address?"
              placeholder="Please enter your mailing address"
              rows={5}
            />
          )}
        />
      </Wizard.Page>
      <Wizard.Page>
        <Field
          name="contactInfo"
          render={({ field }) => (
            <Form.Field
              {...field}
              control={TextArea}
              label="What is a good way to contact you? (preferably a phone number or email)"
              placeholder="Please enter your contact information"
              rows={5}
            />
          )}
        />
      </Wizard.Page>
    </Wizard>
  );
}
