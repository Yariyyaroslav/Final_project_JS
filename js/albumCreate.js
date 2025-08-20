const album = document.getElementById('album');
const trackAlbumList = document.getElementById('trackAlbumList');
const albumData = JSON.parse(localStorage.getItem('currentAlbum'));

let artist = '';
let coverAlbum = '';

async function albumInfo({ artistName, albumName, cover, albumTrackList }) {
    artist = artistName;
    coverAlbum = cover;
    album.querySelector('img').src = cover;
    album.querySelector('h1').innerText = albumName;
    album.querySelector('h2').innerText = artistName;

    const albumTracks = await sendRequest('GET', proxyUrl + albumTrackList);
    const albumTrackData = albumTracks.data;

    trackAlbumList.innerHTML = albumTrackData.map((track, index) => `
       <div class="trackAlbum flex gap-[15px] w-full">
         <audio src="${track.preview}"></audio>
         <button class="btnToPlay">▶</button>
         <span>${index+1}</span>
         <h4>${track.title}</h4>
       </div>`).join('');
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btnToPlay')) {
        const trackElement = e.target.closest('.trackAlbum');
        const audio = trackElement.querySelector('audio');
        const buttonAlbum = e.target;
        const title = trackElement.querySelector('h4').innerText;
        const authorName = artist;
        const cover = coverAlbum;

        playTrack("album", audio, buttonAlbum, title, authorName, cover);
    }
});

if (albumData) {
    albumInfo(albumData);
}
