/**
 * Generic api fetch to my api server
 * @param {string} path - Path to my endpoint without api prefix
 * @param {string} [method=GET] - An http method
 * @param {object} body - Payload of the fetch request
 * @param {object} signal - Singal from AbortCOntroller
 * @returns {Promise<object>} - Returns the json response from teh request
 */
 export default function fetchApi(path, method = `GET`, body, signal) {
    return fetch(
        `${process.env.REACT_APP_API_ENDPOINT}${path}`,
        Object.assign(
            {
                headers: {
                    'content-type': 'application/json',
                    'response-type': 'application/json',
                },
                method,
            },
            method !== `GET` && {
                body: JSON.stringify(body),
            },
            signal && {
                signal,
            },
        ),
    ).then(data => data.json());
}
//for image
// export function fetchImageApi(path, method = `GET`, body, signal) {
//     let formdata = new FormData();
//     Object.keys(data).forEach(function (key) {
//       let value = data[key];
//       formdata.append(key, value);
//     });
//     return fetch(
//         `${process.env.REACT_APP_API_ENDPOINT}${path}`,
//         Object.assign(
//             {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     'Accept': 'application/json'
//                 },
//                 method,
//             },
//             method !== `GET` && {
//                 body: formdata,
//             },
//             signal && {
//                 signal,
//             },
//         ),
//     ).then(formdata);
// }