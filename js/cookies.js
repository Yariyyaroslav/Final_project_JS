function setCookie(name, value, options = {}) {
    options = {
        ...options,
        path: '/',
    }

    if(options.expires instanceof Date) {
        options.expires = options.expires.toUTCString()
    }

    let updateCookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

    for(let optionKey in options) {
        updateCookie += '; ' + optionKey;
        if(options[optionKey] !== true){
            updateCookie += '=' + options[optionKey];
        }
    }

    document.cookie = updateCookie;
}
getCookie('firstName')
function getCookie(name){
    let value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`)
    if(parts.length === 2){
        return decodeURIComponent(parts.pop().split(';').shift());
    }
}
