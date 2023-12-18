import { useEffect, useState } from "react";
import { SWAPI_BASE_URL } from "../environment_variables";

type State<T> =
  | { loading: false; loaded: false; data: null }
  | { loading: true; loaded: false; data: null }
  | { loading: false; loaded: true; data: T };

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

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

        const result = (await response.json()) as T;

        setData(result);
        setLoaded(true);
      } catch (error) {
        if (error instanceof DOMException) {
          console.log("Fetch was aborted");
        } else {
          if (error instanceof Error) {
            console.log(error.message);
          } else {
            console.log("fetch error: ", error);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    getData();

    return () => controller.abort();
  }, [url]);

  return { loading, loaded, data } as State<T>;
}

export { useFetch };
