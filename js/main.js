document.addEventListener('click', (e) => {
    console.log(e.target)
})


document.addEventListener('DOMContentLoaded', () => {
    player.volume = JSON.parse(localStorage.getItem('volume'));
    volumeSlider.value = player.volume*100;
})

let musicIsPlaying = getCookie("musicIsPlaying")

function checkPlaying(){
    if (musicIsPlaying === "true" && getCookie("audio")) {
        playTrack("album", new Audio(getCookie("audio")), null, getCookie("title"), getCookie("authorName"), getCookie("cover"));
        player.audio.currentTime = getCookie("currentTime");
        player.audio.volume = JSON.parse(localStorage.getItem('volume'));
    }else if(musicIsPlaying === "false" && getCookie("audio")){
        player.audio = new Audio(getCookie("audio"));
        player.type = 'header'
        player.button = null;
        player.title = getCookie("title")
        player.cover = getCookie("cover")
        player.audio.currentTime = getCookie("currentTime");
        player.authorName = getCookie("authorName")
        updateHeader(player.title, player.authorName, player.cover)
    }
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('play-button')) {
        const card = e.target.closest('.card');
        const audio = card.querySelector('audio');
        const title = card.querySelector('.title').textContent;
        const authorName = card.querySelector('.author').textContent;
        const cover = card.querySelector('img').src;
        playTrack('card', audio, e.target, title, authorName, cover);
    }
});

function setPlayingMusic(player){
    setCookie("authorName", player.authorName);
    setCookie("cover", player.cover);
    setCookie("title", player.title);
    setCookie("audio", player.audio.src);
    setCookie("type", player.type);
}

document.addEventListener('click', (e)=>{
    if (e.target.classList.contains('openBtn')||e.target.classList.contains('openBtn-playlist')) {
        const currentAlbum = e.target.closest('.album');
        const artistName = currentAlbum.dataset.artist;
        const albumName = currentAlbum.dataset.title;
        const albumTrackList = currentAlbum.dataset.tracklist;
        const cover = currentAlbum.dataset.cover;
        const albumData = {albumName, artistName, albumTrackList, cover};
        localStorage.setItem('currentAlbum', JSON.stringify(albumData));
        console.log('clicked')
        window.location.href = '../album/album.html'
    }
})

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('imageArtist')) {
        const currentArtist = e.target.closest('.cardArtists');
        const artistName = currentArtist.dataset.artist;
        const cover = currentArtist.dataset.picture;
        const id = currentArtist.dataset.id;
        const artistData = {artistName, cover, id};
        localStorage.setItem('currentArtist', JSON.stringify(artistData));
        window.location.href = '../Artist/artist.html'
    }
})

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btnToPlay')) {
        const trackElement = e.target.closest('.trackAlbum');
        const audio = trackElement.querySelector('audio');
        const buttonAlbum = e.target;
        let cover
        if (trackElement.classList.contains('allTrackList')) {
        cover = trackElement.querySelector('.coverAlbum').src
        }
        let artistPlaylist
        if(trackElement.classList.contains('trackPlaylist')) {
            artistPlaylist = trackElement.querySelector('.artistPlaylist').innerText;
        }
        const title = trackElement.querySelector('h4').innerText;
        playTrack("album", audio, buttonAlbum, title, artistPlaylist || artist, cover || coverAlbum);
    }
});
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btnToPlayPlayList')) {
        const trackElement = e.target.closest('.trackPlaylist');
        const audio = trackElement.querySelector('audio');
        console.log(audio);
        const buttonAlbum = e.target;
        let cover = trackElement.querySelector('.coverAlbum').src;
        let artistPlaylist = trackElement.querySelector('.artistPlaylist').innerText;
        const title = trackElement.querySelector('h4').innerText;
        playTrack("album", audio, buttonAlbum, title, artistPlaylist, cover);
    }
});


const regOverlay = document.getElementById('regOverlay');
const regBtn = document.getElementById('regBtn');
const signUp = document.getElementById('signUp');
regBtn.addEventListener('click', () => {
    regOverlay.classList.remove('hidden');
    regOverlay.classList.add('flex');
});
signUp.addEventListener('click', () => {
    setCookie("signUp", true);
    setCookie("firstname", document.getElementById('firstname').value);
    setCookie("lastname", document.getElementById('lastname').value);
    setCookie("email", document.getElementById('email').value);
    setCookie("password", document.getElementById('password').value);
    regOverlay.classList.remove('flex');
    regOverlay.classList.add('hidden');
    regBtn.innerHTML =  `${getCookie("firstname")} ${getCookie("lastname")}`;
});
document.addEventListener('click', (e) => {
    if (!regOverlay.classList.contains('hidden') && !e.target.closest('#regOverlay > div') && e.target !== regBtn) {
        regOverlay.classList.remove('flex');
        regOverlay.classList.add('hidden');
    }
});
document.addEventListener('DOMContentLoaded', () => {
    if (getCookie("signUp")) {
        regBtn.innerHTML = `${getCookie("firstname")} ${getCookie("lastname")}`;
    }
});
let favouriteSongs = JSON.parse(localStorage.getItem('favouriteList')) || [];

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('addToFavourite')) {
        let favBtn = e.target
        let track = favBtn.closest('.trackAlbum');
        const albumData = JSON.parse(localStorage.getItem('currentAlbum'));
        let trackData = {
            title: track.querySelector('h4').innerText,
            audio: track.querySelector('audio').src,
            cover: albumData.cover,
            albumName: albumData.albumName,
            artistName: albumData.artistName,
        }
        const exist = favouriteSongs.some(song => song.title === trackData.title);
    if (!exist) {
        favouriteSongs.push(trackData)
        console.log('pushed')
        console.log(favouriteSongs)
        favBtn.src = '../src/icons/favouriteFilled.svg'
    }else{
        const index = favouriteSongs.findIndex(song => song.title === trackData.title);
        favouriteSongs.splice(index, 1)
        favBtn.src = '../src/icons/favourite.svg'
        console.log('deleted')
        console.log(favouriteSongs)
        location.reload();
    }
    }
    localStorage.setItem('favouriteList', JSON.stringify(favouriteSongs));
});

function updateIcons(){
        document.querySelectorAll('.addToFavourite').forEach(favBtn => {
            const track = favBtn.closest('.trackAlbum');
            const title = track.querySelector('h4').innerText;
            const exist = favouriteSongs.some(song => song.title === title);
            if (exist) {
                favBtn.src = '../src/icons/favouriteFilled.svg';
            }
        });

}

//https://cors-anywhere.herokuapp.com/corsdemo