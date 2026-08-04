export const fetcherWithCredentials = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch with credentials");
    }
    return res.json();
  });

export const defaultFetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch");
    }
    return res.json();
  });
