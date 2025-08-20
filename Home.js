const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const getChartsUrl = 'https://api.deezer.com/chart';
const searchUrl = 'https://api.deezer.com/search';

let search = document.getElementById('searchMain');
let container_search_info = document.getElementById('searchInfo');
let buttonHeaderPlay = document.getElementById('buttonHeaderPlay');
let track = document.querySelector('.track');
let author = document.querySelector('.author');
let imgHeader = document.querySelector('.imgHeader');

// ====== Универсальный плеер ======
const player = {
    audio: null, // теперь аудио берется из карточки
    currentButtonCard: null,
    currentButtonHeader: null,
};

// ====== GET CHARTS & SCROLL ======
document.addEventListener('DOMContentLoaded', async () => {
    const getCharts = await sendRequest('GET', proxyUrl + getChartsUrl);
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

// ====== SCROLL FUNCTION ======
function scrollContainer(container, dir){
    const card = container.querySelector('.card, .cardArtists');
    const distance = card ? card.offsetWidth + 16 : 320; // адаптивно
    container.scrollBy({ left: dir === 'left' ? -distance : distance, behavior: 'smooth' });
}

// ====== SEARCH ======
search.addEventListener('input', async () => {
    const query = search.value.trim();
    if(!query){
        container_search_info.style.display = 'none';
        container_search_info.innerHTML = '';
        return;
    }
    const getSearchResults = await sendRequest('GET', proxyUrl + searchUrl + `?q=${encodeURIComponent(query)}&limit=6`);
    createSearchResults(getSearchResults.data);
});

search.addEventListener('click', () => {
    if(search.value){
        container_search_info.style.display = 'flex'
    }
});

container_search_info.addEventListener('click', (e) => e.stopPropagation());

document.addEventListener('click', (e) => {
    if(!e.target.closest('#searchInfo') && !e.target.closest('#searchMain')){
        container_search_info.style.display = 'none';
    }
});

function createSearchResults(items){
    container_search_info.style.display = 'flex';
    container_search_info.innerHTML = items.map(item => `
        <div class="searchResultCard">
            <img class="searchResultCardImage" src="${item.album.cover_small}" alt="photo">
            <div class="flex flex-col gap-[4px] max-w-[100px] w-full">
                <span class="Track text-[16px]">${item.title}</span>
                <span class="author text-[12px]">${item.artist.name}</span>
            </div>
        </div>
    `).join('');
}

// ====== CREATE CARDS ======
function createCards(container, items, type){
    items.forEach(item => {
        const div = document.createElement('div');
        div.classList.add(type === 'artists' ? 'cardArtists' : 'card');

        const title = type === 'artists' ? null : item.title;
        const authorName = type === 'artists' ? item.name : item.artist.name;
        const cover = type === 'albums' ? item.cover_medium : type === 'artists' ? item.picture_big : item.album.cover_medium;
        const audioSrc = type === 'tracks' ? item.preview : null;

        div.innerHTML = type === 'artists' ? `
            <img class="imageArtist" src="${cover}" alt="Cover">
            <div class="p-[10px]">
                <p class="author text-[18px] text-black">${authorName}</p>
            </div>
        ` : type === 'tracks' ? `
            <div class="overlay"></div>
            <button class="play-button">▶</button>
            <img class="w-full object-cover" src="${cover}" alt="Cover">
            <audio src="${audioSrc}"></audio>
            <div class="p-[10px]">
                <p class="title text-[12px] font-[600]">${title}</p>
                <p class="author text-[10px] text-gray-400">${authorName}</p>
            </div>
        ` : `
            <img class="w-full object-cover" src="${cover}" alt="Cover">
            <div class="p-[10px]">
                <p class="title text-[12px] font-[600]">${title}</p>
                <p class="author text-[10px] text-gray-400">${authorName}</p>
            </div>
        `;
        container.appendChild(div);
    });
}

// ====== AUDIO PLAY LOGIC ======
document.addEventListener('click', async (e) => {
    if(e.target.classList.contains('play-button')){
        const card = e.target.closest('.card');
        const audio = card.querySelector('audio');
        if(!audio) return; // защита от пустого <audio>

        const title = card.querySelector('.title').textContent;
        const authorName = card.querySelector('.author').textContent;
        const cover = card.querySelector('img').src;

        playCard(audio, e.target, title, authorName, cover);
    }
});

// ====== RANDOM TRACK FOR HEADER ======
async function getRandomTrack(){
    const query = 'a';
    const limit = 1;
    const offset = Math.floor(Math.random() * 1000);
    const randUrl = `${proxyUrl}${searchUrl}?q=${query}&limit=${limit}&offset=${offset}`;
    const randValue = await sendRequest("GET", randUrl);
    return randValue.data[0];
}

// ====== HEADER PLAY BUTTON ======
buttonHeaderPlay.addEventListener('click', async () => {
    if(!player.audio){
        const trackData = await getRandomTrack();
        const audio = new Audio(trackData.preview);
        playHeader(audio, buttonHeaderPlay, trackData.title, trackData.artist.name, trackData.album.cover_medium);
    } else if(player.audio.paused){
        player.audio.play();
        updateHeaderIcon(true);
        if(player.currentButtonCard) player.currentButtonCard.textContent = '⏸';
    } else {
        player.audio.pause();
        updateHeaderIcon(false);
        if(player.currentButtonCard) player.currentButtonCard.textContent = '▶';
    }
});

// ====== PLAY CARD ======
function playCard(audio, buttonCard, title, authorName, cover){
    if(player.audio && player.audio !== audio){
        player.audio.pause();
        buttonCard.textContent = '▶';
        updateHeaderIcon(false);
    }
    player.audio = audio;
    if(audio.paused){
        audio.play();
        buttonCard.textContent = '⏸';
        updateHeaderIcon(true);
        updateHeader(title, authorName, cover);
        player.currentButtonCard = buttonCard;
    } else {
        audio.pause();
        buttonCard.textContent = '▶';
        updateHeaderIcon(false);
    }
}

// ====== PLAY HEADER ======
function playHeader(audio, buttonHeader, title, authorName, cover){
    if(player.audio && player.audio !== audio){
        player.audio.pause();
        if(player.currentButtonCard) player.currentButtonCard.textContent = '▶';
    }
    player.audio = audio;
    if(audio.paused){
        audio.play();
        updateHeaderIcon(true);
        if(player.currentButtonCard) player.currentButtonCard.textContent = '⏸';
        updateHeader(title, authorName, cover);
        player.currentButtonHeader = buttonHeader;
        player.isPlaying = true;
    } else {
        audio.pause();
        updateHeaderIcon(false);
        if(player.currentButtonCard) player.currentButtonCard.textContent = '▶';
        player.isPlaying = false;
    }
}

// ====== UPDATE HEADER ICON ======
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

// ====== UPDATE HEADER INFO ======
function updateHeader(title, authorName, cover){
    track.textContent = title;
    author.textContent = authorName;
    imgHeader.src = cover;
}

// ====== SEND REQUEST ======
async function sendRequest(method, url, body = null){
    const options = { method };
    if(body){
        options.body = JSON.stringify(body);
        options.headers = {'Content-Type':'application/json'};
    }
    const response = await fetch(url, options);
    if(!response.ok){
        const err = await response.json();
        throw new Error(err.message || 'Error');
    }
    return response.json();
}
