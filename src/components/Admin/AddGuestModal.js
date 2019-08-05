import React from "react";
import { Modal, Button, Form, TextArea, Icon } from "semantic-ui-react";
import { Formik, Field } from "formik";
import firebase from "firebase/app";

export default function AddGuestModal({ isOpen, close, open, addGuest }) {
  return (
    <Modal
      open={isOpen}
      onClose={close}
      onOpen={open}
      trigger={
        <Button
          circular
          icon="plus"
          primary
          size="massive"
          style={{
            position: "fixed",
            bottom: 25,
            right: 25
          }}
        />
      }
    >
      <Modal.Header>Add Guest</Modal.Header>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          mailingAddress: "",
          contactInfo: "",
          createdAt: firebase.firestore.Timestamp.fromDate(new Date())
        }}
        onSubmit={async (values, { setSubmitting }) => {
          console.log(values);
          const newGuest = {
            ...values,
            isAttending: false
          };
          try {
            const docRef = await firebase
              .firestore()
              .collection("guests")
              .add(newGuest);
            console.log("Document written with ID: ", docRef.id);
            newGuest.id = docRef.id;
            addGuest(newGuest);
            close();
          } catch (err) {
            console.log("error adding guest", err);
          } finally {
            setSubmitting(false);
          }
        }}
        render={({ handleSubmit, isSubmitting }) => (
          <>
            <Modal.Content>
              <Form onSubmit={handleSubmit} loading={isSubmitting}>
                <Form.Group widths="equal">
                  <Field
                    name="firstName"
                    render={({ field }) => (
                      <Form.Input
                        {...field}
                        id="firstName"
                        required
                        placeholder="First Name"
                        label="First name"
                        autoComplete="off"
                      />
                    )}
                  />
                  <Field
                    name="lastName"
                    render={({ field }) => (
                      <Form.Input
                        {...field}
                        id="lastName"
                        required
                        placeholder="Last Name"
                        label="Last name"
                        autoComplete="off"
                      />
                    )}
                  />
                </Form.Group>
                <Field
                  name="mailingAddress"
                  render={({ field }) => (
                    <Form.Field
                      {...field}
                      id="mailingAddress"
                      control={TextArea}
                      label="Mailing Address"
                      placeholder="Please enter mailing address"
                      rows={5}
                    />
                  )}
                />
                <Field
                  name="contactInfo"
                  render={({ field }) => (
                    <Form.Field
                      {...field}
                      id="contactInfo"
                      control={TextArea}
                      label="Contact Info"
                      placeholder="Please enter contact information"
                      rows={5}
                    />
                  )}
                />
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button secondary onClick={close}>
                Close
              </Button>
              <Button primary onClick={handleSubmit}>
                <Icon name="plus" />
                Add
              </Button>
            </Modal.Actions>
          </>
        )}
      />
    </Modal>
  );
}
