const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const getChartsUrl = 'https://api.deezer.com/chart';
const searchUrl = 'https://api.deezer.com/search';

async function sendRequest(method, url, body = null) {
    const options = { method };
    if (body) {
        options.body = JSON.stringify(body);
        options.headers = { 'Content-Type': 'application/json' };
    }
    const response = await fetch(url, options);
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Error');
    }
    return response.json();
}
