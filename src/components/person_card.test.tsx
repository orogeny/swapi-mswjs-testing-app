import { describe, expect, test } from "vitest";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { PersonCard } from "./person_card";
import { server } from "../mock_api/node";
import { HttpResponse, http } from "msw";
import { SWAPI_BASE_URL } from "../environment_variables";

describe("PersonCard", () => {
  test("renders Skywalker", async () => {
    render(<PersonCard id={1} />);

    expect(screen.getByText(/loading.../i)).toBeInTheDocument();

    await waitForElementToBeRemoved(screen.queryByText(/loading.../i));

    expect(screen.getByText(/skywalker/i)).toBeInTheDocument();
  });

  test("500 response produces error message", async () => {
    const expectedErrorMessage = "Oops... something went wrong, try again 🤕";

    server.use(
      http.get(`${SWAPI_BASE_URL}/people/1`, () => {
        return new HttpResponse(null, {
          status: 500,
          statusText: "It's not you, it's me",
        });
      })
    );

    render(<PersonCard id={1} />);

    expect(await screen.findByText(/oops/i)).toHaveTextContent(
      expectedErrorMessage
    );
  });

  test("418 response produces silly error message", async () => {
    const expectedErrorMessage = "418 I'm a tea pot, silly";

    server.use(
      http.get(`${SWAPI_BASE_URL}/people/1`, () => {
        return new HttpResponse(null, {
          status: 418,
          statusText: "Ich bin eine Kaffeekanne, Dummkopf",
        });
      })
    );

    render(<PersonCard id={1} />);

    expect(await screen.findByText(/418/i)).toHaveTextContent(
      expectedErrorMessage
    );
  });
});
