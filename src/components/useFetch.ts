import { useEffect, useReducer } from "react";
import { SWAPI_BASE_URL } from "../environment_variables";

type State<T> = {
  loading: boolean;
  statusCode?: number;
  error: Error | null;
} & ({ loaded: true; data: T } | { loaded: false; data: null });

type Action<T> =
  | { type: "reset" }
  | { type: "loading" }
  | { type: "responded"; status: number }
  | { type: "loaded"; data: T }
  | { type: "failed"; error: Error }
  | { type: "finished" };

function initialState<T>(): State<T> {
  return {
    loading: false,
    loaded: false,
    data: null,
    statusCode: undefined,
    error: null,
  };
}

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case "reset":
      return initialState();

    case "loading":
      return { ...state, loading: true };

    case "responded":
      return { ...state, statusCode: action.status };

    case "loaded":
      return { ...state, loaded: true, data: action.data };

    case "failed":
      return { ...state, error: action.error };

    case "finished":
      return { ...state, loading: false };
  }

  return state;
}

function useFetch<T>(url: string) {
  const [state, dispatch] = useReducer(reducer, null, initialState);

  useEffect(() => {
    const controller = new AbortController();

    async function getData() {
      try {
        dispatch({ type: "loading" });

        const response = await fetch(`${SWAPI_BASE_URL}${url}`, {
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });

        dispatch({ type: "responded", status: response.status });

        const result = (await response.json()) as T;

        dispatch({ type: "loaded", data: result });
      } catch (error) {
        if (error instanceof DOMException) {
          dispatch({ type: "reset" });
        } else if (error instanceof Error) {
          console.log("fetch errored");
          dispatch({ type: "failed", error });
        } else {
          console.log("fetch failed");
          dispatch({ type: "failed", error: new Error("Fetch failed") });
        }
      } finally {
        dispatch({ type: "finished" });
      }
    }

    getData();

    return () => controller.abort();
  }, [url]);

  return { ...state } as State<T>;
}

export { useFetch };
