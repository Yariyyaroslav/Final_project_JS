const album = document.getElementById('album');
const trackAlbumList = document.getElementById('trackAlbumList');
const albumData = JSON.parse(localStorage.getItem('currentAlbum'));
const playRandAlbum = document.getElementById('playRand');
let artist = '';
let coverAlbum = '';
let albumTrackData


document.addEventListener('DOMContentLoaded', () => {
    checkPlaying()
})
async function albumInfo({ artistName, albumName, cover, albumTrackList }) {
    artist = artistName;
    coverAlbum = cover;
    album.querySelector('img').src = cover;
    album.querySelector('h1').innerText = albumName;
    album.querySelector('h2').innerText = artistName;

    const albumTracks = await sendRequest('GET', proxyUrl + albumTrackList);
    albumTrackData = albumTracks.data;

    trackAlbumList.innerHTML = albumTrackData.map((track, index) => `
       <div class="trackAlbum flex justify-between w-full">
         <div class="flex gap-[15px] ">
         <audio src="${track.preview}"></audio>
         <button class="btnToPlay">▶</button>
         <span>${index+1}</span>
         <h4>${track.title}</h4>
</div>
         <img class="addToFavourite" src="../src/icons/favourite.svg" alt="favourite">
       </div>`).join('');
    updateIcons()
}


if (albumData) {
    albumInfo(albumData);
}

playRandAlbum.addEventListener('click', (e) => {
    console.log(albumTrackData)
    let trackIndex;
    if (albumTrackData) {
        trackIndex = Math.floor(Math.random() * albumTrackData.length);
        const track = albumTrackData[trackIndex];
        if (track) {
            const audio = new Audio(track.preview);
            const title = track.title;
            const tracks = document.querySelectorAll('.trackAlbum');
            const trackElement = tracks[trackIndex];
            const buttonAlbum = trackElement.querySelector('.btnToPlay');
            const authorName = track.artist.name;
            playTrack("album", audio, buttonAlbum, title, authorName, coverAlbum);
        }
    }
})
document.addEventListener('DOMContentLoaded', () => {
    if (getCookie("signUp")) {
        regBtn.innerHTML = `${getCookie("firstname")} ${getCookie("lastname")}`;
    }
});