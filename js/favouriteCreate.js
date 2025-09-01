const trackFavList = JSON.parse(localStorage.getItem('favouriteList'));
const trackListFavourite = document.getElementById( "favouriteTrackList")
let favouritePlaylist
console.log(trackFavList);
document.addEventListener('DOMContentLoaded', () => {
    checkPlaying()
})
function favouritePlaylistCreate(favouriteList) {
    favouritePlaylist = favouriteList
    console.log(favouritePlaylist)
    console.log(Array.isArray(favouriteList))
    trackListFavourite.innerHTML = favouritePlaylist.map((track, index) => `
       <div class="trackPlaylist flex justify-between w-full">
         <div class="flex gap-[15px] items-center justify-center">
         <audio src="${track.audio}"></audio>
         <button class="btnToPlayPlayList">▶</button>
         <span>${index+1}</span>
         <div class="w-[40px] rounded-lg overflow-hidden">
         <img class="coverAlbum" src="${track.cover}" alt=""></div>
         <h4>${track.title}</h4>
         
         </div>
         <div class="flex gap-[15px] items-center justify-center"><span class="artistPlaylist">${track.artistName}</span>
         <img class="addToFavourite" src="../src/icons/favourite.svg" alt="favourite"></div>
       </div>`).join('');

}

if (trackFavList) {
    favouritePlaylistCreate(trackFavList);
}