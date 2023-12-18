import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import App from "./App";

describe("App", () => {
  test("renders gender", () => {
    render(<App />);

    expect(screen.getByText(/gender/i)).toBeInTheDocument();
  });
});
