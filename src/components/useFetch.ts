import { useEffect, useState } from "react";

const SWAPI_API_BASE = "https://swapi.dev/api" as const;

type State<T> =
  | { loading: false; loaded: false; data: null }
  | { loading: true; loaded: false; data: null }
  | { loading: false; loaded: true; data: T };

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function getData() {
      try {
        setLoading(true);
        setLoaded(false);
        setData(undefined);

        const response = await fetch(`${SWAPI_API_BASE}${url}`, {
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });

        const result = (await response.json()) as T;

        console.log("got data: ", result);

        setData(result);
        setLoading(false);
        setLoaded(true);
      } catch (error) {
        if (error instanceof DOMException) {
          console.log("Fetch was aborted");
        } else {
          console.log("fetch error: ", error);
        }
      }
    }

    getData();

    return () => controller.abort();
  }, [url]);

  return { loading, loaded, data: data ?? null } as State<T>;
}

export { useFetch };
