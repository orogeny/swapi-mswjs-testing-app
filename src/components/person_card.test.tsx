import { describe, expect, test } from "vitest";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { PersonCard } from "./person_card";

describe("PersonCard", () => {
  test("renders Skywalker", async () => {
    render(<PersonCard id={1} />);

    expect(screen.getByText(/loading.../i)).toBeInTheDocument();

    await waitForElementToBeRemoved(screen.queryByText(/loading.../i));

    expect(screen.getByText(/skywalker/i)).toBeInTheDocument();
  });
});
