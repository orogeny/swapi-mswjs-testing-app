import { useEffect, useState } from "react";
import { SWAPI_BASE_URL } from "../environment_variables";

type State<T> =
  | {
      loading: false;
      loaded: false;
      data: null;
      statusCode: number;
      error: null;
    }
  | {
      loading: true;
      loaded: false;
      data: null;
      statusCode: number;
      error: null;
    }
  | { loading: false; loaded: true; data: T; statusCode: number; error: null }
  | {
      loading: false;
      loaded: false;
      data: null;
      statusCode: number;
      error: Error;
    };

function useFetch<T>(url: string) {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [statusCode, setStatusCode] = useState(0);
  const [fetchError, setFetchError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function getData() {
      try {
        setLoading(true);
        setLoaded(false);
        setData(null);

        const response = await fetch(`${SWAPI_BASE_URL}${url}`, {
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });

        setStatusCode(response.status);

        const result = (await response.json()) as T;

        setData(result);
        setLoaded(true);
      } catch (error) {
        if (error instanceof DOMException) {
          setLoaded(false);
          setData(null);
          setStatusCode(0);
          setFetchError(new Error("Fetch aborted"));
        } else if (error instanceof Error) {
          setFetchError(error);
        } else {
          setFetchError(new Error("Fetch failed"));
        }
      } finally {
        setLoading(false);
      }
    }

    getData();

    return () => controller.abort();
  }, [url]);

  return { loading, loaded, data, statusCode, error: fetchError } as State<T>;
}

export { useFetch };
