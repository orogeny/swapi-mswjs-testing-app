import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import App from "./App";

describe("App", () => {
  test("renders Today", () => {
    render(<App />);

    expect(screen.getByText(/today/i)).toBeInTheDocument();
  });
});
