//for image
export default function fetchImageApi(path, method = `GET`, data, signal) {
    let formdata = new FormData();
    Object.keys(data).forEach(function (key) {
      let value = data[key];
      formdata.append(key, value);
    });
    return fetch(
        `${process.env.REACT_APP_API_ENDPOINT}${path}`,
        Object.assign(
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                },
                method,
            },
            method !== `GET` && {
                body: formdata,
            },
            signal && {
                signal,
            },
        ),
    ).then(formdata);
}