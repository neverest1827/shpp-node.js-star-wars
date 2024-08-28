export async function fetchData(url, options = {}) {
  try {
    view.showLoader();
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
    });

    if (!response.ok) {
      view.hideLoader();
      const error = await response.json();
      throwHTTPError(response.status, error.message || response.statusText);
    }

    view.hideLoader();
    return response;
  } catch (err) {
    handleError(err);
  }
}

function throwHTTPError(status, message){
  throw new Error(
    `HTTP error! status: ${status} - ${message}`,
  );
}

function handleError(err) {
  alert(err);
  console.error(err);
}