import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the role selector landing page", () => {
  render(<App />);
  expect(
    screen.getByText(/select your role to continue/i)
  ).toBeInTheDocument();
});
