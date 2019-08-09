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
import { navigate } from "@reach/router";

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
        float: "right",
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

function reducer(state, action) {
  switch (action.type) {
    case "SUCCESS":
      return {
        success: true,
        error: null
      };
    case "ERROR":
      return {
        success: false,
        error: action.error
      };
    case "RESET":
      return initialState;
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

const initialState = { success: false, error: null };

export default function RSVPForm() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  // Redirect back to the homepage after successfully RSVPing
  React.useEffect(() => {
    let timeout = null;
    if (state.success) {
      timeout = setTimeout(() => {
        navigate("/");
      }, 7000);
    }
    return () => timeout && clearTimeout(timeout);
  }, [state.success]);

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
      apiState={state}
      onSubmit={(values, { setSubmitting }) => {
        const body = {
          ...values,
          isAttending: values.isAttending === "true",
          party: values.party.filter(
            member => member.firstName && member.lastName
          )
        };

        dispatch({ type: "RESET" });

        fetch(`${process.env.REACT_APP_FIREBASE_FUNCTIONS}/rsvp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        })
          .then(
            res => {
              if (res.ok) {
                dispatch({ type: "SUCCESS" });
              } else if (res.status === 400) {
                res.text().then(error => {
                  dispatch({ type: "ERROR", error });
                });
              } else if (res.status === 404) {
                res.text().then(error => {
                  dispatch({
                    type: "ERROR",
                    error: `We could not find your invitation. Try another variation of your name, especially if we know you by another name.
                    If that doesn't work, please contact us directly.`
                  });
                });
              } else {
                throw new Error("Network response was not ok.");
              }
            },
            () => {
              dispatch({
                type: "ERROR",
                error:
                  "A system error occurred. Please try again later or contact us directly if issue persists."
              });
            }
          )
          .catch(() => {
            dispatch({
              type: "ERROR",
              error:
                "A system error occurred. Please try again later or contact us directly if issue persists."
            });
          })
          .finally(() => {
            setSubmitting(false);
          });
      }}
    >
      <Wizard.Page
        validate={values => {
          const errors = {};
          if (process.env.REACT_APP_EVENT_CODE) {
            if (!values.eventCode) {
              errors.eventCode = "Required";
            } else if (
              values.eventCode.toLowerCase() !==
              process.env.REACT_EVENT_CODE.toLowerCase()
            ) {
              errors.eventCode = "Invalid event code";
            }
          }

          if (!values.firstName) {
            errors.firstName = "Required";
          }

          if (!values.lastName) {
            errors.lastName = "Required";
          }

          return errors;
        }}
      >
        <Form.Group widths="equal">
          <Field
            name="firstName"
            render={({ field, form }) => (
              <Form.Field
                error={!!(form.touched.firstName && form.errors.firstName)}
                required
              >
                <label htmlFor="firstName">First name</label>
                <Focus>
                  <Input
                    {...field}
                    id="firstName"
                    required
                    placeholder="First Name"
                  />
                </Focus>
                <ErrorLabel name="firstName" />
              </Form.Field>
            )}
          />
          <Field
            name="lastName"
            render={({ field, form }) => (
              <Form.Field
                error={!!(form.touched.lastName && form.errors.lastName)}
                required
              >
                <label htmlFor="lastName">Last name</label>
                <Input
                  {...field}
                  id="lastName"
                  required
                  placeholder="Last Name"
                />
                <ErrorLabel name="lastName" />
              </Form.Field>
            )}
          />
        </Form.Group>
        {process.env.REACT_APP_EVENT_CODE ? (
          <Field
            name="eventCode"
            render={({ field, form }) => (
              <Popup
                trigger={
                  <Form.Field
                    error={!!(form.touched.eventCode && form.errors.eventCode)}
                    required={process.env.REACT_APP_EVENT_CODE !== ""}
                  >
                    <label htmlFor="eventCode">Event code</label>
                    <Input
                      {...field}
                      id="eventCode"
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
        ) : null}
      </Wizard.Page>
      <Wizard.Page
        validate={values => {
          if (!values.isAttending) {
            return {
              isAttending: "Required"
            };
          }
        }}
      >
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
                error={!!(form.touched.isAttending && form.errors.isAttending)}
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
                error={!!(form.touched.isAttending && form.errors.isAttending)}
              />
            )}
          />
          <ErrorLabel name="isAttending" />
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
              <label htmlFor="mailingAddress">
                What is your mailing address?
              </label>
              <Focus>
                <TextArea
                  id="mailingAddress"
                  {...field}
                  placeholder="Please enter your mailing address"
                  rows={5}
                />
              </Focus>
              <InputLengthLabel length={field.value.length} maxLength={512} />
              <ErrorLabel name="mailingAddress" />
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
              <label htmlFor="contactInfo">
                What is a good way to contact you? (preferably a phone number or
                email)
              </label>
              <Focus>
                <TextArea
                  {...field}
                  id="contactInfo"
                  placeholder="Please enter your contact information"
                  rows={5}
                />
              </Focus>
              <InputLengthLabel length={field.value.length} maxLength={512} />
              <ErrorLabel name="contactInfo" />
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
                            <label htmlFor={`party.${index}.firstName`}>
                              First name
                            </label>
                            <Focus>
                              <Input
                                {...field}
                                id={`party.${index}.firstName`}
                                placeholder="First Name"
                              />
                            </Focus>
                          </Form.Field>
                        ) : (
                          <Form.Input
                            {...field}
                            id={`party.${index}.firstName`}
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
                          id={`party.${index}.lastName`}
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
                        aria-label="Add party member"
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
