const buttonHeaderPlay = document.getElementById('buttonHeaderPlay');
const nextButton = document.getElementById('nextButton');
const prevButton = document.getElementById('previousButton');
const volumeSlider = document.getElementById('range');
let track = document.querySelector('.track');
let author = document.querySelector('.author');
let imgHeader = document.querySelector('.imgHeader');


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

buttonHeaderPlay.addEventListener('click', async () => {
    if (!player.audio) {
        const trackData = await getRandomTrack();
        const audio = new Audio(trackData.preview);
        playTrack("header", audio, null, trackData.title, trackData.artist.name, trackData.album.cover_medium);
    } else {
        playTrack("header", player.audio, null, player.title, player.authorName, player.cover);
    }
});


function updateHeader(title, authorName, cover) {
    track.textContent = title;
    author.textContent = authorName;
    imgHeader.src = cover;
}
let volumeValue
volumeSlider.addEventListener('input', () => {
    volumeValue = volumeSlider.value;
    if (player.audio) {
        player.audio.volume = volumeValue / 100;
    }
});

prevButton.addEventListener('click', previousTrack)
nextButton.addEventListener('click', nextTrack);

async function getRandomTrack() {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz'
    let randomIndex = Math.floor(Math.random() * alphabet.length);
    let query = alphabet[randomIndex];
    const limit = 1;
    const randUrl = `${proxyUrl}${searchUrl}?q=${query}&limit=${limit}`;
    const randValue = await sendRequest("GET", randUrl);
    return randValue.data[0];
}
