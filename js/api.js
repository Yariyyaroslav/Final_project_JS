const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const getChartsUrl = 'https://api.deezer.com/chart';
const searchUrl = 'https://api.deezer.com/search';

async function sendRequest(method, url, body = null) {
    const options = { method };
    if (body) {
        options.body = JSON.stringify(body);
        options.headers = { 'Content-Type': 'application/json' };
    }
    try{
        const response = await fetch(url, {method});
        if(response.ok){
            return await response.json()
        }else{
            const err = await response.json()
            const e = new Error(err.message)
            e.name = err.name
            throw e
        }
    }catch (e){
        throw e;
    }
}
