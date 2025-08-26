const artistData = JSON.parse(localStorage.getItem("currentArtist"));
const artistScroll = document.querySelector('.scroll-container-artist')
const artistImg = document.querySelector('.artistImg');
const artistNameMain = document.getElementById('artistName');
const albumContainer = document.querySelector('.scroll-container-albums-artist')
const songsScroll = document.getElementById('songsScroll');
const albumsScroll = document.getElementById('albumsScroll');
let artist = '';
let artistTrackList
let albumList

songsScroll.querySelectorAll('.scroll-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const dir = btn.dataset.dir;
        const distance = 1185;
        scrollContainerArtist(artistScroll, dir, distance)
    })
})

albumsScroll.querySelectorAll('.scroll-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const dir = btn.dataset.dir;
        const distance = 200;
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
        `<div class="flex flex-col gap-[5px] bg-colorArtistBack"><img class="max-w-[200px] rounded-lg" src="${album.cover_medium}" alt="cover">
                    <span>${album.title}</span>
                        <span>${album.release_date}</span>
                    </div>`).join('');
}

function songChunk(data){
    console.log(data)
    for(let i = 0; i < 27; i += 9){
        const chunk = data.slice(i, i+9);
        const grid = document.createElement('div');
        grid.className = 'gridSongs w-[1165px] grid grid-cols-3 gap-4 shrink-0';
        console.log(chunk)
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


if(artistData){
    artistInfo(artistData);
    albumsInfo(artistData);
}
