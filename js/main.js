document.addEventListener('DOMContentLoaded', () => {
    player.volume = JSON.parse(localStorage.getItem('volume'));
    volumeSlider.value = player.volume*100;
})

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
    console.log(e.target)
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
        const title = trackElement.querySelector('h4').innerText;
        playTrack("album", audio, buttonAlbum, title, artist, cover || coverAlbum);
    }
});


//https://cors-anywhere.herokuapp.com/corsdemo