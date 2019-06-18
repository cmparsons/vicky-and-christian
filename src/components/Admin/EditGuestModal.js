import React from "react";
import {
  Modal,
  Form,
  TextArea,
  Button,
  Radio,
  Icon,
  Header
} from "semantic-ui-react";
import { Formik, Field } from "formik";
import firebase from "firebase/app";

function DeleteGuestConfirmation({ guest, deleteGuest }) {
  const [isOpen, setOpen] = React.useState(false);

  const open = () => setOpen(true);
  const close = () => setOpen(false);

  return (
    <Modal
      open={isOpen}
      onOpen={open}
      onClose={close}
      trigger={
        <Button color="red">
          <Icon name="trash" />
          Remove Guest
        </Button>
      }
      basic
      size="small"
    >
      <Header icon="trash" content="Delete Guest" />
      <Modal.Content>
        <p>
          {`Are you sure you want to remove ${guest.firstName} ${
            guest.lastName
          } from the guest list?`}
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color="red" inverted onClick={close}>
          <Icon name="remove" /> No
        </Button>
        <Button
          color="green"
          inverted
          onClick={() => {
            close();
            deleteGuest();
          }}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default function EditGuestModal({
  guest,
  isOpen,
  close,
  editGuest,
  deleteGuest
}) {
  const getInitialFormValues = guest =>
    guest
      ? {
          firstName: guest.firstName || "",
          lastName: guest.lastName || "",
          mailingAddress: guest.mailingAddress || "",
          contactInfo: guest.contactInfo || "",
          isAttending: guest.isAttending ? "true" : "false"
        }
      : {
          firstName: "",
          lastName: "",
          mailingAddress: "",
          contactInfo: "",
          isAttending: "false"
        };

  return (
    <Modal open={isOpen} onClose={close}>
      <Modal.Header>Edit Guest</Modal.Header>
      <Formik
        initialValues={getInitialFormValues(guest)}
        onSubmit={async (values, { setSubmitting }) => {
          console.log(values);
          const newGuest = {
            id: guest.id,
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            contactInfo: values.contactInfo.trim(),
            mailingAddress: values.mailingAddress.trim(),
            isAttending: values.isAttending === "true",
            lastUpdated: firebase.firestore.Timestamp.fromDate(new Date())
          };
          try {
            await firebase
              .firestore()
              .collection("guests")
              .doc(guest.id)
              .update(newGuest);
            console.log("Document updated successfully");
            editGuest(newGuest);
            close();
          } catch (err) {
            console.log("error updating guest", err);
          } finally {
            setSubmitting(false);
          }
        }}
        render={({ handleSubmit, isSubmitting, setSubmitting }) => (
          <>
            <Modal.Content>
              <Form onSubmit={handleSubmit} loading={isSubmitting}>
                <Form.Group widths="equal">
                  <Field
                    name="firstName"
                    render={({ field }) => (
                      <Form.Input
                        {...field}
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
                      control={TextArea}
                      label="Contact Info"
                      placeholder="Please enter contact information"
                      rows={5}
                    />
                  )}
                />
                <label
                  style={{
                    display: "block",
                    marginBottom: "15px",
                    fontWeight: "bold"
                  }}
                >
                  Attending?
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
                      error={
                        form.touched.isAttending && form.errors.isAttending
                      }
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
                      error={
                        form.touched.isAttending && form.errors.isAttending
                      }
                    />
                  )}
                />
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <DeleteGuestConfirmation
                guest={guest}
                deleteGuest={async () => {
                  setSubmitting(true);
                  try {
                    await firebase
                      .firestore()
                      .collection("guests")
                      .doc(guest.id)
                      .delete();
                    console.log("Document successfully deleted!");
                    deleteGuest(guest);
                    close();
                  } catch (err) {
                    console.log("Error removing document: ", err);
                  } finally {
                    setSubmitting(false);
                  }
                }}
              />
              <Button secondary onClick={close}>
                Close
              </Button>
              <Button primary content="Update" onClick={handleSubmit} />
            </Modal.Actions>
          </>
        )}
      />
    </Modal>
  );
}
