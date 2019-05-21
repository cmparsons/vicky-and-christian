import React from "react";
import {
  Form,
  Popup,
  Radio,
  TextArea,
  Button,
  Icon,
  Label,
  Input,
  Transition
} from "semantic-ui-react";
import { Field, FieldArray, FormikConsumer } from "formik";
import Wizard from "./Wizard";

const wait = (delay = 2000) =>
  new Promise(resolve => setTimeout(resolve, delay));

const warn = (...args) =>
  process.env.NODE_ENV !== "production" && console.warn(...args);

const validateLength = key => values => {
  const value = values[key];
  const errors = {};

  if (value.length > 512) {
    errors[key] = "Woah there! Length of your response is too long";
  }

  return errors;
};

function ErrorLabel({ name }) {
  return (
    <FormikConsumer>
      {({ errors, touched }) => (
        <Transition
          visible={!!(touched[name] && errors[name])}
          animation="scale"
          duration={500}
        >
          <Label basic color="red" pointing>
            {errors[name]}
          </Label>
        </Transition>
      )}
    </FormikConsumer>
  );
}

function InputLengthLabel({ length, maxLength }) {
  const display = `${length} / ${maxLength}`;

  return (
    <small
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: 5
      }}
    >
      {display}
    </small>
  );
}

function Focus({ children }) {
  const inputRef = React.useRef(null);
  const childEls = React.Children.toArray(children);
  const numChildren = childEls.length;

  let childElement = children;

  if (numChildren > 1) {
    warn(
      "Focus component can only contain one child. Will grab the first child element"
    );
    childElement = childEls[0];
  } else if (numChildren === 0) {
    warn("Need a child element!");
  }

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return numChildren > 0
    ? React.cloneElement(childElement, { ref: inputRef })
    : null;
}

export default function RSVPForm() {
  const [apiError, setApiError] = React.useState(null);

  return (
    <Wizard
      initialValues={{
        firstName: "",
        lastName: "",
        eventCode: "",
        isAttending: "",
        mailingAddress: "",
        contactInfo: "",
        party: [{ firstName: "", lastName: "" }]
      }}
      apiError={apiError}
      onSubmit={(values, { setSubmitting }) => {
        const body = {
          ...values,
          isAttending: values.isAttending === "true",
          party: values.party.filter(
            member => member.firstName && member.lastName
          )
        };

        setApiError(null);

        fetch(`${process.env.REACT_APP_FIREBASE_FUNCTIONS}/rsvp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        })
          .then(
            res => {
              res.json().then(result => {
                console.log("result", result);
              });
            },
            error => {
              console.log("error", error);
              setApiError(error);
            }
          )
          .finally(() => {
            setSubmitting(false);
          });
      }}
    >
      <Wizard.Page
        validate={values => {
          if (!values.eventCode) {
            return {
              eventCode: "Required"
            };
          }
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
            render={({ field, form }) => (
              <Form.Field
                error={!!(form.touched.firstName && form.errors.firstName)}
              >
                <label>First name</label>
                <Focus>
                  <Input {...field} required placeholder="First Name" />
                </Focus>
                <ErrorLabel name="firstName" />
              </Form.Field>
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
          render={({ field, form }) => (
            <Popup
              trigger={
                <Form.Field
                  error={!!(form.touched.eventCode && form.errors.eventCode)}
                >
                  <label>Event code</label>
                  <Input
                    {...field}
                    icon="lock"
                    iconPosition="left"
                    placeholder="Event Code"
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck="off"
                  />
                  <ErrorLabel name="eventCode" />
                </Form.Field>
              }
              label="Event Code"
              content="Check your invite to find the event code"
              on="focus"
            />
          )}
        />
      </Wizard.Page>
      <Wizard.Page>
        <fieldset style={{ marginBottom: 15 }}>
          <legend
            style={{
              display: "block",
              marginBottom: 15,
              fontWeight: "bold"
            }}
          >
            Will you be attending the wedding?
          </legend>
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
        </fieldset>
      </Wizard.Page>
      <Wizard.Page validate={validateLength("mailingAddress")}>
        <Field
          name="mailingAddress"
          render={({ field, form }) => (
            <Form.Field
              error={
                !!(form.touched.mailingAddress && form.errors.mailingAddress)
              }
            >
              <label>What is your mailing address?</label>
              <Focus>
                <TextArea
                  {...field}
                  placeholder="Please enter your mailing address"
                  rows={5}
                />
              </Focus>
              <InputLengthLabel length={field.value.length} maxLength={512} />
            </Form.Field>
          )}
        />
      </Wizard.Page>
      <Wizard.Page validate={validateLength("contactInfo")}>
        <Field
          name="contactInfo"
          render={({ field, form }) => (
            <Form.Field
              error={!!(form.touched.contactInfo && form.errors.contactInfo)}
            >
              <label>
                What is a good way to contact you? (preferably a phone number or
                email)
              </label>
              <Focus>
                <TextArea
                  {...field}
                  placeholder="Please enter your contact information"
                  rows={5}
                />
              </Focus>
              <InputLengthLabel length={field.value.length} maxLength={512} />
            </Form.Field>
          )}
        />
      </Wizard.Page>
      <Wizard.Page>
        {({ values }) => (
          <FieldArray
            name="party"
            render={({ push, remove }) => (
              <>
                <label
                  style={{
                    marginBottom: 15,
                    fontWeight: "bold",
                    display: "block"
                  }}
                >
                  Please add any guests to your party.
                </label>
                {values.party.map((_, index) => (
                  <Form.Group
                    key={index}
                    unstackable
                    style={{ alignItems: "flex-end" }}
                  >
                    <Field
                      name={`party.${index}.firstName`}
                      render={({ field }) =>
                        index === values.party.length - 1 ? (
                          <Form.Field width="7">
                            <label>First name</label>
                            <Focus>
                              <Input {...field} placeholder="First Name" />
                            </Focus>
                          </Form.Field>
                        ) : (
                          <Form.Input
                            {...field}
                            placeholder="First Name"
                            label="First name"
                            width="7"
                          />
                        )
                      }
                    />
                    <Field
                      name={`party.${index}.lastName`}
                      render={({ field }) => (
                        <Form.Input
                          {...field}
                          placeholder="Last Name"
                          label="Last name"
                          width="7"
                        />
                      )}
                    />
                    <span style={{ paddingBottom: 3 }}>
                      <Button
                        circular
                        type="button"
                        icon="x"
                        aria-label="Remove"
                        onClick={() => remove(index)}
                      />
                    </span>
                  </Form.Group>
                ))}
                <div style={{ marginTop: "1em", marginBottom: "1em" }}>
                  <Popup
                    position="left center"
                    content="Please be aware we are limited to 150 guests. We likely already accounted for family and +1's (and do add those guests here), but if necessary,
                    we have the right to deny any guests. We'll do our best though and accommodate everyone."
                    defaultOpen={values.party.length === 1}
                    trigger={
                      <Button
                        type="button"
                        onClick={() => push({ firstName: "", lastName: "" })}
                      >
                        <Icon name="plus" />
                        Add
                      </Button>
                    }
                  />
                </div>
              </>
            )}
          />
        )}
      </Wizard.Page>
    </Wizard>
  );
}
