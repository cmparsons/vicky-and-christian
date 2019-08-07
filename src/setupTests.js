import "@testing-library/react/cleanup-after-each";
import "@testing-library/jest-dom/extend-expect";

// TODO: Remove once React makes 16.9 stable
// https://github.com/facebook/react/issues/14769#issuecomment-514589856
const consoleError = console.error;
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((...args) => {
    if (
      !args[0].includes(
        "Warning: An update to %s inside a test was not wrapped in act"
      )
    ) {
      consoleError(...args);
    }
  });
});
