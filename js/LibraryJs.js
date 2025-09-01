const gridArtists = document.getElementById('gridArtists');
const trackFavList = JSON.parse(localStorage.getItem('favouriteList'));

document.addEventListener('DOMContentLoaded', () => {
    checkPlaying()
})
let artistsFav = [];

function createArtistArr(trackFavList) {
    trackFavList.forEach(trackFav => {
        if (!artistsFav.includes(trackFav.artistName)) {
            artistsFav.push(trackFav.artistName);
        }
    });
}
async function createArtistGrid() {
    let artistsArr = []
    const responses = await Promise.all(artistsFav.map(artistName => sendRequest('GET', proxyUrl + `https://api.deezer.com/search/artist?q=${encodeURIComponent(artistName)}&limit=1`)))
    responses.forEach(response => {
        artistsArr.push(response.data[0])
    })
    console.log(artistsArr);

    gridArtists.innerHTML = artistsArr.map(artist =>
    `
    <div
     data-artist="${artist.name}"
     data-picture="${artist.picture_big}"
     data-id="${artist.id}" class="flex flex-col items-center justify-center cardArtists">
    <img class="imageArtist" src="${artist.picture_big}" alt="Cover">
    <div>
    <p class="author text-[16px] text-black line-clamp-1">${artist.name}</p>
    </div>
    </div>
    `
    ).join('');
}
if (trackFavList) {
    createArtistArr(trackFavList)
    createArtistGrid();
}
