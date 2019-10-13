import React from "react";
import Countdown from "../components/CountDown";
import { render, waitForElement } from "@testing-library/react";
import { act } from "react-dom/test-utils";

beforeEach(() => {
  jest.restoreAllMocks();
  jest.useFakeTimers();
});

test("renders countdown to wedding date", () => {
  const now = new Date(2019, 10, 16, 14).getTime();

  jest.spyOn(Date, "now").mockImplementation(() => now);

  const { getByRole } = render(<Countdown />);

  expect(getByRole("heading")).toHaveTextContent(
    `${0} Days, ${1} Hours, ${0} Minutes, ${0} Seconds`
  );
});

test("renders all 0's on wedding date and time", () => {
  const now = new Date(2019, 10, 16, 15).getTime();

  jest.spyOn(Date, "now").mockImplementation(() => now);

  const { getByRole } = render(<Countdown />);

  expect(getByRole("heading")).toHaveTextContent(
    `${0} Days, ${0} Hours, ${0} Minutes, ${0} Seconds`
  );
});

test("renders all 0's when past wedding date and time", () => {
  const now = new Date(2019, 10, 16, 15, 1).getTime();

  jest.spyOn(Date, "now").mockImplementation(() => now);

  const { getByRole } = render(<Countdown />);

  expect(getByRole("heading")).toHaveTextContent(
    `${0} Days, ${0} Hours, ${0} Minutes, ${0} Seconds`
  );
});

test("updates countdown every second", async () => {
  const now = new Date(2019, 10, 16, 14).getTime();

  const { getByText } = render(<Countdown start={now} />);

  await waitForElement(() =>
    getByText(`${0} Days, ${1} Hours, ${0} Minutes, ${0} Seconds`)
  );

  act(() => {
    jest.useFakeTimers();
    jest.advanceTimersByTime(500);
    jest.useRealTimers();
  });

  await waitForElement(() =>
    getByText(`${0} Days, ${1} Hours, ${0} Minutes, ${0} Seconds`)
  );

  act(() => {
    jest.useFakeTimers();
    jest.advanceTimersByTime(500);
    jest.useRealTimers();
  });

  await waitForElement(() =>
    getByText(`${0} Days, ${0} Hours, ${59} Minutes, ${59} Seconds`)
  );
});
