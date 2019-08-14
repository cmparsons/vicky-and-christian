import "@testing-library/react/cleanup-after-each";
import "@testing-library/jest-dom/extend-expect";

// Semantic UI still uses componentWillReceiveProps which causes the console to be polluted with warnings.
beforeAll(() => {
  jest.spyOn(console, "warn").mockImplementation(() => {});
});
