const trackFavList = JSON.parse(localStorage.getItem('favouriteList'));
const trackListFavourite = document.getElementById( "favouriteTrackList")
const playRandPlaylist = document.getElementById( "playRandPlaylist" )
let favouritePlaylist
console.log(trackFavList);
document.addEventListener('DOMContentLoaded', () => {
    checkPlaying()
})
function favouritePlaylistCreate(favouriteList) {
    favouritePlaylist = favouriteList
    console.log(favouritePlaylist)
    console.log(Array.isArray(favouriteList))
    trackListFavourite.innerHTML = favouritePlaylist.map((track, index) =>
        `<div class="trackAlbum allTrackList trackPlaylist flex justify-between items-center w-full">
                    <div class="flex gap-[15px] items-center">
                    <audio src="${track.audio}"></audio>
                    <button class="btnToPlay">▶</button>
                    <span>${index+1}</span>
                    <div class="w-[40px] rounded-lg overflow-hidden">
                    <img class="coverAlbum" src="${track.cover}" alt=""></div>
                    <h4>${track.title}</h4>
                    </div>
                    
                    <div class="flex gap-[15px] items-center justify-center">
                    <span class="artistPlaylist hidden sm:block">${track.artistName}</span>
                    <img class="addToFavourite" src="../src/icons/favourite.svg" alt="favourite">
                    </div>
                </div>`
    ).join('');
updateIcons()

}
let lastIndex = -1;
playRandPlaylist.addEventListener('click', () => {
    let trackIndex;
    if (favouritePlaylist){
        do {
            trackIndex = Math.floor(Math.random() * favouritePlaylist.length);
        } while (trackIndex === lastIndex && favouritePlaylist.length > 1);
        lastIndex = trackIndex;
        const track = favouritePlaylist[trackIndex];
        if (track){
            const tracks = document.querySelectorAll('.trackAlbum');
            const trackElement = tracks[trackIndex];
            console.log(tracks);
            console.log(trackElement)
            const audio = new Audio(track.audio);
            const title = track.title;
            const button = trackElement.querySelector('.btnToPlay');
            const authorName = track.artistName;
            const cover = track.cover;
            playTrack('album', audio, button, title, authorName, cover);
        }
    }
})




if (trackFavList) {
    favouritePlaylistCreate(trackFavList);
}