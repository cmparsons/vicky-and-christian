import React from "react";
import Countdown from "../components/CountDown";
import { render } from "@testing-library/react";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  Date.now.mockRestore();
});

test("renders countdown to wedding date", async () => {
  const now = new Date(2019, 10, 16, 14).getTime();

  jest.spyOn(Date, "now").mockImplementation(() => now);

  const { findByRole } = render(<Countdown />);

  const countdownHeader = await findByRole("heading");

  expect(countdownHeader).toHaveTextContent(
    `${0} Days, ${1} Hours, ${0} Minutes, ${0} Seconds`
  );
});

test("renders all 0's on wedding date and time", async () => {
  const now = new Date(2019, 10, 16, 15).getTime();

  jest.spyOn(Date, "now").mockImplementation(() => now);

  const { findByRole } = render(<Countdown />);

  const countdownHeader = await findByRole("heading");

  expect(countdownHeader).toHaveTextContent(
    `${0} Days, ${0} Hours, ${0} Minutes, ${0} Seconds`
  );
});

test("renders all 0's when past wedding date and time", async () => {
  const now = new Date(2019, 10, 16, 15, 1).getTime();

  jest.spyOn(Date, "now").mockImplementation(() => now);

  const { findByRole } = render(<Countdown />);

  const countdownHeader = await findByRole("heading");

  expect(countdownHeader).toHaveTextContent(
    `${0} Days, ${0} Hours, ${0} Minutes, ${0} Seconds`
  );
});
