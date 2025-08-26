let allTracks = JSON.parse(localStorage.getItem("trackListCurrentArtist"));
const trackList = document.getElementById('trackList');
console.log(allTracks)
let artist = allTracks[0].artist.name;

console.log()
trackList.innerHTML = allTracks.map((track, index) =>
    `<div class="trackAlbum allTrackList flex gap-[15px] w-full">
                    <audio src="${track.preview}"></audio>
                    <button class="btnToPlay">▶</button>
                    <span>${index+1}</span>
                    <div class="w-[40px] rounded-lg overflow-hidden">
                    <img class="coverAlbum" src="${track.album.cover_medium}" alt=""></div>
                    <h4>${track.title}</h4>
                </div>`
).join('');

