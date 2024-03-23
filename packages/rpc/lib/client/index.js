const createApi = (url) => {
  return (payload, headers) => window.fetch(url, {
    method: "POST",
    body: payload
  });
};
