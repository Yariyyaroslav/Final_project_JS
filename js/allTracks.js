let allTracks = JSON.parse(localStorage.getItem("trackListCurrentArtist"));
const trackList = document.getElementById('trackList');
console.log(allTracks)
let artist = allTracks[0].artist.name;
document.addEventListener('DOMContentLoaded', () => {
    checkPlaying()
})
trackList.innerHTML = allTracks.map((track, index) =>
    `<div class="trackAlbum allTrackList flex justify-between w-full">
                   <div class="flex gap-[15px] items-center justify-center">
                    <audio src="${track.preview}"></audio>
                    <button class="btnToPlay">▶</button>
                    <span>${index+1}</span>
                    <div class="w-[40px] rounded-lg overflow-hidden">
                    <img class="coverAlbum" src="${track.album.cover_medium}" alt=""></div>
                    <h4>${track.title}</h4>
</div>
                    <img class="addToFavourite" src="../src/icons/favourite.svg" alt="favourite">
                </div>`
).join('');
updateIcons()
document.addEventListener('DOMContentLoaded', () => {
    if (getCookie("signUp")) {
        regBtn.innerHTML = `${getCookie("firstname")} ${getCookie("lastname")}`;
    }
});