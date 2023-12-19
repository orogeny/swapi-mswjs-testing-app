import { useEffect, useState } from "react";
import { SWAPI_BASE_URL } from "../environment_variables";

type State<T> = {
  loading: boolean;
  loaded: boolean;
  statusCode?: number;
  data: T | null;
  error: Error | null;
};

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [statusCode, setStatusCode] = useState<number | undefined>(undefined);
  const [fetchError, setFetchError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function getData() {
      try {
        const response = await fetch(`${SWAPI_BASE_URL}${url}`, {
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });

        setStatusCode(response.status);

        const result = (await response.json()) as T;

        setData(result);
      } catch (error) {
        if (error instanceof DOMException) {
          setData(null);
          setStatusCode(undefined);
          setFetchError(null);
        } else if (error instanceof Error) {
          setFetchError(error);
        } else {
          setFetchError(new Error("Fetch failed"));
        }
      }
    }

    getData();

    return () => controller.abort();
  }, [url]);

  return {
    loading: data === null && fetchError === null,
    loaded: data !== null,
    data,
    statusCode,
    error: fetchError,
  } as State<T>;
}

export { useFetch };
