const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const getChartsUrl = 'https://api.deezer.com/chart';
const searchUrl = 'https://api.deezer.com/search';

//!!!!!!!!!!!!!!!!!GET CHARTS & SCROLL!!!!!!!!!!!!!!!!!!!!!!
document.addEventListener('DOMContentLoaded', async () => {
    const getCharts = await sendRequest('GET', proxyUrl + getChartsUrl);
    console.log(getCharts)
    document.querySelectorAll('.chart-section').forEach(section => {
        const type = section.dataset.type;
        const container = section.querySelector('.scroll-container');
        createCards(container, getCharts[type].data, type);
        section.querySelectorAll('.scroll-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                scrollContainer(container, btn.dataset.dir);
            });
        });
    });
});
function scrollContainer(container, dir){
    const distance = 320;
    container.scrollBy({ left: dir === 'left' ? -distance : distance, behavior: 'smooth' });
}

//!!!!!!!!!!!!!!!!!!!!!!!!SEARCH!!!!!!!!!!!!!!!!!!!!!!!!!
let search = document.getElementById('searchMain')
search.addEventListener('input', async () => {
    let query = search.value;
    if (!query) {
        container_search_info.style.display = 'none';
        return;
    }
    let getSearchResults = await sendRequest('GET', proxyUrl + searchUrl + `?q=${encodeURIComponent(query)}&limit=6`, {});
    console.log(getSearchResults);
    createSearchResults(getSearchResults.data);
});

let container_search_info = document.getElementById('searchInfo')
function createSearchResults(items){
    container_search_info.style.display = 'flex';
    container_search_info.innerHTML = items.map(item => {
        return `<div class="searchResultCard">
                        <img class="searchResultCardImage" src="${item.album.cover_small}" alt="photo">
                        <div class="flex flex-col gap-[4px] max-w-[100px] w-full">
                        <span class="Track text-[16px]">${item.title}</span>
                        <span class="author text-[12px]">${item.artist.name}</span>
                        </div>
                    </div>`
    }).join('');
}
search.addEventListener('click', () => {
    if (search.value) {
        container_search_info.style.display = 'flex';
    }
});
container_search_info.addEventListener('click', (e) => {
    e.stopPropagation()
})
document.addEventListener('click',  (e) => {
    if (!e.target.closest('#searchInfo') && !e.target.closest('#searchMain')) {
        container_search_info.style.display = 'none';
    }
})



//!!!!!!!!!!!!!!!!!!!CREATING CARDS!!!!!!!!!!!!!!!!!!!!!!
function createCards(container, items, type){
    items.forEach(item => {
        const div = document.createElement('div');
        if(type === 'artists'){
            div.classList.add('cardArtists');
        }else{
            div.classList.add('card');
        }

        const title = type === 'artists' ? null : item.title;
        const author = type === 'artists' ? item.name : item.artist.name ;//тернарный оператор
        const cover = type === 'albums' ? item.cover_medium : type === 'artists' ? item.picture_big : item.album.cover_medium;
        const audio = type === 'tracks' ? item.preview : null;
        div.innerHTML = type === 'artists' ? `
            <img class="imageArtist" src="${cover}" alt="Cover">
            <div class="p-[10px]">
                <p class="author text-[18px] text-black">${author}</p>
            </div>
        `: type === 'tracks' ? `
            <div class="overlay"></div>
            <button class="play-button">▶</button>
            <img class="w-full object-cover" src="${cover}" alt="Cover">
            <audio src="${audio}"></audio>
            <div class="p-[10px]">
                <p class="title text-[12px] font-[600]">${title}</p>
                <p class="author text-[10px] text-gray-400">${author}</p>
            </div>
        `: `
            <img class="w-full object-cover" src="${cover}" alt="Cover">
            <div class="p-[10px]">
                <p class="title text-[12px] font-[600]">${title}</p>
                <p class="author text-[10px] text-gray-400">${author}</p>
            </div>
        `;
        container.appendChild(div);
    });
}

let buttonHeaderPlay = document.getElementById('buttonHeaderPlay');
let track = document.querySelector('.track');
let author = document.querySelector('.author');
let imgHeader = document.querySelector('.imgHeader');



document.addEventListener('click', (e) =>{//делегирование событий
    if (e.target.classList.contains('play-button')) {
        const currentCard = e.target.closest('.card');
        const audio = currentCard.querySelector('audio');
        const imageCover = currentCard.querySelector('img').src;
        const title = currentCard.querySelector('.title').textContent;
        const authorName = currentCard.querySelector('.author').textContent;
        const button = currentCard.querySelector('.play-button');
        playAudio(audio, imageCover, title, authorName, button);
    }
})



async function getRandomTrack(){
    const query = 'a';
    const limit = 1;
    const maxOffset = 1000;
    const offset = Math.floor(Math.random() * maxOffset);
    const randUrl = `${proxyUrl}${searchUrl}?q=${query}&limit=${limit}&offset=${offset}`;
    const randValue = await sendRequest("GET", randUrl)
    const value = randValue.data[0];
    return value;

}




//!!!!!!!!!!!!!!!!!PLAY TRACK!!!!!!!!!!!!!!!
let currentButton = null;
let currentAudio = null;
function playAudio(audio, imageCover, title, authorName, button){
    track.textContent = title;
    author.textContent = authorName;
    imgHeader.src = imageCover;
    if(currentAudio && currentAudio !== audio){
        currentAudio.pause()
        currentButton.textContent = '▶'
        currentAudio.currentTime = 0;
    }
    if(audio.paused){
        audio.play();
        button.textContent = '⏸';
        updateHeaderIcon(true)
        currentAudio = audio
        currentButton = button;

    }else{
        audio.pause();
        currentButton.textContent = '▶';
        updateHeaderIcon(false)
        currentAudio = null;
        currentButton = null;
    }
}

buttonHeaderPlay.addEventListener('click', async(e) =>{
    if(!currentAudio){
        const trackData = await getRandomTrack();
        playAudio(new Audio(trackData.preview), trackData.album.cover_medium, trackData.title, trackData.artist.name, buttonHeaderPlay);
        updateHeaderIcon(true)
        currentButton = buttonHeaderPlay
    } else if (currentAudio.paused) {
        currentAudio.play();
        updateHeaderIcon(true);

    } else {
        currentAudio.pause();
        updateHeaderIcon(false);
    }
})

//!!!!!!!!!!!!!!!!!!!UPDATE SRC BUTTON IN HEADER!!!!!!!!!!!!!!!!!!!
function updateHeaderIcon(isPlaying) {
    if (isPlaying) {
        buttonHeaderPlay.innerHTML = `
            <svg class="text-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="6" y="4" width="4" height="16" rx="1.5"></rect>
                <rect x="14" y="4" width="4" height="16" rx="1.5"></rect>
            </svg>`;
    } else {
        buttonHeaderPlay.innerHTML = `
            <svg class="text-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>`;
    }
}

//!!!!!!!!!!!!!!!!!!!!SEND REQUEST MAIN FUNCTION!!!!!!!!!!!!!!!!!!!!!!!!!!
async function sendRequest(method, url, body = null){
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