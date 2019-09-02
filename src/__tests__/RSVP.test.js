import React from "react";
import { render, fireEvent, waitForDomChange } from "@testing-library/react";
import RSVP from "../components/RSVP/RSVP";

const generateString = length => "a".repeat(length);

test("wizard goes to next page when no errors on current page", async () => {
  const { getByLabelText, getByText, queryByLabelText, queryByText } = render(
    <RSVP />
  );

  // First page -- first name, last name
  fireEvent.change(getByLabelText(/first name/i), {
    target: { value: "test" }
  });
  fireEvent.change(getByLabelText(/last name/i), { target: { value: "user" } });
  fireEvent.click(getByText(/next/i));

  await waitForDomChange();

  expect(queryByLabelText(/first name/i)).not.toBeInTheDocument();
  expect(queryByLabelText(/last name/i)).not.toBeInTheDocument();

  // Second page -- is attending
  expect(queryByText(/attending/i)).toBeInTheDocument();
});

test("form values persist from previous page", async () => {
  const { getByLabelText, getByText, queryByLabelText } = render(<RSVP />);

  // First page -- first name, last name
  fireEvent.change(getByLabelText(/first name/i), {
    target: { value: "test" }
  });
  fireEvent.change(getByLabelText(/last name/i), { target: { value: "user" } });
  fireEvent.click(getByText(/next/i));

  await waitForDomChange();

  fireEvent.click(getByText(/prev/i));

  expect(queryByLabelText(/first name/i)).toHaveValue("test");
  expect(queryByLabelText(/last name/i)).toHaveValue("user");
});

test("requires user to fill out first name and last name", async () => {
  const { queryAllByText, getByText } = render(<RSVP />);

  // First page -- first name, last name
  fireEvent.click(getByText(/next/i));

  await waitForDomChange();

  expect(queryAllByText("Required")).toHaveLength(2);
});

test('requires user to fill out "Is attending?" question', async () => {
  const { getByLabelText, getByText, queryByText } = render(<RSVP />);

  // First page -- first name, last name
  fireEvent.change(getByLabelText(/first name/i), {
    target: { value: "first" }
  });
  fireEvent.change(getByLabelText(/last name/i), { target: { value: "last" } });
  fireEvent.click(getByText(/next/i));

  await waitForDomChange();

  // Second page -- is attending
  fireEvent.click(getByText(/next/i));

  await waitForDomChange();

  expect(queryByText("Required")).toBeInTheDocument();
});

test("prevents user from submitting long responses for mailing address", async () => {
  const { getByLabelText, getByText, queryByText } = render(<RSVP />);

  // First page -- first name, last name
  fireEvent.change(getByLabelText(/first name/i), {
    target: { value: "first" }
  });
  fireEvent.change(getByLabelText(/last name/i), { target: { value: "last" } });
  fireEvent.click(getByText(/next/i));
  await waitForDomChange();

  // Second page -- is attending
  fireEvent.click(getByLabelText(/yes/i));
  fireEvent.click(getByText(/next/i));
  await waitForDomChange();

  // Third page -- mailing address
  fireEvent.change(getByLabelText(/what is your mailing address?/i), {
    target: { value: generateString(1000) }
  });
  fireEvent.click(getByText(/next/i));
  await waitForDomChange();

  expect(queryByText(/response is too long/i)).toBeInTheDocument();
});

test("prevents user from submitting long responses for contact info", async () => {
  const { getByLabelText, getByText, queryByText } = render(<RSVP />);

  // First page -- first name, last name
  fireEvent.change(getByLabelText(/first name/i), {
    target: { value: "first" }
  });
  fireEvent.change(getByLabelText(/last name/i), { target: { value: "last" } });
  fireEvent.click(getByText(/next/i));
  await waitForDomChange();

  // Second page -- is attending
  fireEvent.click(getByLabelText(/yes/i));
  fireEvent.click(getByText(/next/i));
  await waitForDomChange();

  // Third page -- mailing address
  fireEvent.change(getByLabelText(/mailing address/i), {
    target: { value: "my mailing address" }
  });
  fireEvent.click(getByText(/next/i));
  await waitForDomChange();

  // Fourth page -- contact information
  fireEvent.change(getByLabelText(/contact/i), {
    target: { value: generateString(1000) }
  });
  fireEvent.click(getByText(/next/i));
  await waitForDomChange();

  expect(queryByText(/response is too long/i)).toBeInTheDocument();
});

test("allows the user to rsvp successfully", async () => {
  jest.spyOn(window, "fetch").mockImplementationOnce(async () => ({
    ok: true
  }));

  const { getByLabelText, getByText, findByRole } = render(<RSVP />);

  // First page -- first name, last name
  fireEvent.change(getByLabelText(/first name/i), {
    target: { value: "test" }
  });
  fireEvent.change(getByLabelText(/last name/i), { target: { value: "user" } });
  fireEvent.click(getByText(/next/i));
  await waitForDomChange();

  // Second page -- is attending
  fireEvent.click(getByLabelText(/yes/i));
  fireEvent.click(getByText(/next/i));
  await waitForDomChange();

  // Third page -- mailing address
  fireEvent.change(getByLabelText(/mailing address/i), {
    target: { value: "my mailing address" }
  });
  fireEvent.click(getByText(/next/i));
  await waitForDomChange();

  // Fourth page -- contact information
  fireEvent.change(getByLabelText(/contact/i), {
    target: { value: "my contact info" }
  });
  fireEvent.click(getByText(/next/i));
  await waitForDomChange();

  // Fifth page -- party members
  fireEvent.click(getByText(/submit/i));

  const message = await findByRole("alert");

  expect(message).toHaveTextContent(/success/i);
});

test("displays error if an API error occurs", async () => {
  jest.spyOn(window, "fetch").mockImplementationOnce(async () => ({
    status: 400
  }));

  const { getByLabelText, getByText, findByRole } = render(<RSVP />);

  // First page -- first name, last name
  fireEvent.change(getByLabelText(/first name/i), {
    target: { value: "test" }
  });
  fireEvent.change(getByLabelText(/last name/i), { target: { value: "user" } });
  fireEvent.click(getByText(/next/i));
  await waitForDomChange();

  // Second page -- is attending
  fireEvent.click(getByLabelText(/yes/i));
  fireEvent.click(getByText(/next/i));
  await waitForDomChange();

  // Third page -- mailing address
  fireEvent.change(getByLabelText(/mailing address/i), {
    target: { value: "my mailing address" }
  });
  fireEvent.click(getByText(/next/i));
  await waitForDomChange();

  // Fourth page -- contact information
  fireEvent.change(getByLabelText(/contact/i), {
    target: { value: "my contact info" }
  });
  fireEvent.click(getByText(/next/i));
  await waitForDomChange();

  // Fifth page -- party members
  fireEvent.click(getByText(/submit/i));

  const message = await findByRole("alert");

  expect(message).toHaveTextContent(/error/i);
});

test("first input of each page is focused when initially mounted", async () => {
  const { getByLabelText, getByText } = render(<RSVP />);

  // First page -- first name, last name
  const firstNameInput = getByLabelText(/first name/i);
  expect(firstNameInput).toHaveFocus();
  fireEvent.change(firstNameInput, { target: { value: "test" } });
  fireEvent.change(getByLabelText(/last name/i), { target: { value: "user" } });
  fireEvent.click(getByText(/next/i));

  await waitForDomChange();

  // Second page -- is attending
  // TODO ...
  fireEvent.click(getByLabelText(/yes/i));
  fireEvent.click(getByText(/next/i));
  await waitForDomChange();

  // Third page -- mailing address
  const mailingAddress = getByLabelText(/mailing address/i);
  expect(mailingAddress).toHaveFocus();
  fireEvent.click(getByText(/next/i));
  await waitForDomChange();

  // Fourth page -- contact info
  const contactInfo = getByLabelText(/contact/i);
  expect(contactInfo).toHaveFocus();
  fireEvent.click(getByText(/next/i));
  await waitForDomChange();

  // Fifth page -- party
  const firstPartyMemberFirstName = getByLabelText(/first name/i);
  expect(firstPartyMemberFirstName).toHaveFocus();
});

test("prevents user from adding multiple first names", async () => {
  const { getByLabelText, getByText } = render(<RSVP />);

  fireEvent.change(getByLabelText(/first name/i), {
    target: { value: "Bob and Mary" }
  });
  fireEvent.change(getByLabelText(/last name/i), {
    target: { value: "Smith" }
  });
  fireEvent.click(getByText(/next/i));

  await waitForDomChange();

  expect(getByText(/limit first name to one person/i)).toBeInTheDocument();
});
