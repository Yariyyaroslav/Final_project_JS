const artistData = JSON.parse(localStorage.getItem("currentArtist"));
const artistScroll = document.querySelector('.scroll-container-artist')
const artistImg = document.querySelector('.artistImg');
const artistNameMain = document.getElementById('artistName');
const albumContainer = document.querySelector('.scroll-container-albums-artist')
const artistsContainer = document.querySelector('.scroll-container-artists-artist')
const songsScroll = document.getElementById('songsScroll');
const albumsScroll = document.getElementById('albumsScroll');
const artistsScroll = document.getElementById('artistsScroll');
const allTracksButton = document.getElementById('allTracksButton');
let artist = '';
let artistTrackList
let albumList
let artistList
document.addEventListener('DOMContentLoaded', () => {
    checkPlaying()
})
allTracksButton.addEventListener('click', () => {
    localStorage.setItem("trackListCurrentArtist", JSON.stringify(artistTrackList));
    window.location.href = '../Artist/allTracks.html'
})
artistsScroll.querySelectorAll('.scroll-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const dir = btn.dataset.dir;
        const distance = 320;
        scrollContainerArtist(artistsContainer, dir, distance)
    })
})


songsScroll.querySelectorAll('.scroll-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const dir = btn.dataset.dir;
        const distance = 1185;
        scrollContainerArtist(artistScroll, dir, distance)
    })
})

albumsScroll.querySelectorAll('.scroll-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const dir = btn.dataset.dir;
        const distance = 320;
        scrollContainerArtist(albumContainer, dir, distance)
    })
})

function scrollContainerArtist(container, dir, distance) {
    container.scrollBy({ left: dir === 'left' ? -distance : distance, behavior: 'smooth' });
}


async function artistInfo({artistName, cover, id}) {
    const songUrl = `https://api.deezer.com/artist/${id}/top?limit=50`
    artist = artistName
    artistNameMain.innerText = artistName;
    artistImg.src = cover;
    const artistTracks = await sendRequest("GET", proxyUrl+songUrl);
    artistTrackList = artistTracks.data;
    songChunk(artistTrackList);
}

async function albumsInfo({artistName, cover, id}){
    const albumUrl = `https://api.deezer.com/artist/${id}/albums`
    const albums = await sendRequest("GET", proxyUrl+albumUrl);
    albumList = albums.data;
    albumContainer.innerHTML = albumList.map(album =>
        `<div class="album flex flex-col bg-colorArtistBack justify-between flex-shrink-0 w-[300px] rounded-lg overflow-hidden relative"
            data-artist="${artist}"
            data-title="${album.title}"
            data-trackList="${album.tracklist}"
            data-cover="${album.cover_big}">
            <div class="overlay"></div>
            <button class="openBtn">▶</button>
            <img class="w-full object-cover" src="${album.cover_big}" alt="Cover">
            <div class="p-[12px] flex flex-col gap-[3px]">
                <p class="title line-clamp-1">${album.title}</p>
                <p class="author text-gray-400 line-clamp-1">${album.release_date}</p>
            </div>
         </div>`).join('');
}

async function getSameArtists({artistName, cover, id}) {
    const relatedUrl = `https://api.deezer.com/artist/${id}/related`
    const artists = await sendRequest('GET', proxyUrl+relatedUrl);
    artistList = artists.data;
    console.log(artistList);
    artistsContainer.innerHTML = artistList.map(artist =>`
    <div class="cardArtists"
    data-artist="${artist.name}"
    data-picture="${artist.picture_medium}"
    data-id="${artist.id}"
    >
    <img class="imageArtist" src="${artist.picture_medium}" alt="Cover">
            <div>
                <p class="author text-[16px] text-black line-clamp-1 font-[500]">${artist.name}</p>
            </div>
      </div>
    `).join('');
}



function songChunk(data){
    for(let i = 0; i < 27; i += 9){
        const chunk = data.slice(i, i+9);
        const grid = document.createElement('div');
        grid.className = 'gridSongs w-[1165px] grid grid-cols-3 gap-4 shrink-0';
        grid.innerHTML = chunk.map(song =>
            `
                <div class="trackArtist flex gap-[10px] w-[360px] py-[10px] px-[10px] rounded-lg justify-between items-center bg-colorArtistBack relative">
                    <div class="flex gap-[10px] justify-center items-center">
                    <audio src="${song.preview}"></audio>
                    <div class="overlayArtist"></div>
                        <div class="relative">
                        <div class="playButtonTrackArtist">▶</div>
                        <img class="max-w-[40px] rounded-lg cover" src="${song.album.cover_medium}" alt="songImg">
                        </div>
                        <div class="flex flex-col gap-[3px]">
                            <span class="text-[13px] font-[500] title">${song.title}</span>
                            <span class="text-[12px] font-[400] albumName">${song.album.title}</span>
                        </div>
                    </div>
                    <div>...</div>
                </div>`).join('');
        artistScroll.appendChild(grid);
    }
}



document.addEventListener('click', (e)=>{
    if (e.target.classList.contains('playButtonTrackArtist')){
        const currentTrack = e.target.closest('.trackArtist');
        const audio = currentTrack.querySelector('audio');
        const title = currentTrack.querySelector('.title').textContent;
        const cover = currentTrack.querySelector('.cover').src;
        const buttonArtist = e.target;
        playTrack("artist", audio, buttonArtist, title, artist, cover);
    }
})

document.addEventListener('DOMContentLoaded', () => {
    if (getCookie("signUp")) {
        regBtn.innerHTML = `${getCookie("firstname")} ${getCookie("lastname")}`;
    }
});
if(artistData){
    artistInfo(artistData);
    albumsInfo(artistData);
    getSameArtists(artistData);
}
