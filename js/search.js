let search = document.getElementById('searchMain');
let container_search_info = document.getElementById('searchInfo');

search.addEventListener('input', async () => {
    const query = search.value;
    if (!query) {
        container_search_info.style.display = 'none';
        return;
    }
    const getSearchResults = await sendRequest('GET', proxyUrl + searchUrl + `?q=${encodeURIComponent(query)}&limit=6`);
    createSearchResults(getSearchResults.data);
    console.log(getSearchResults)
});

search.addEventListener('click', () => {
    if (search.value) {
        container_search_info.style.display = 'flex';
    }
});

container_search_info.addEventListener('click', (e) => e.stopPropagation());

document.addEventListener('click', (e) => {
    if (!e.target.closest('#searchInfo') && !e.target.closest('#searchMain')) {
        container_search_info.style.display = 'none';
    }
});

function createSearchResults(items) {
    container_search_info.style.display = 'flex';
    container_search_info.innerHTML = items.map(item => `
        <div class="searchResultCard" data-artist="${item.artist.name}" data-title="${item.album.title}" data-tracklist="${item.album.tracklist}" data-cover="${item.album.cover_big}">
        <div class="overlayAlbum"></div>
        <div class="searchImgButton">
        <img class="searchResultCardImage" src="${item.album.cover_small}" alt="photo">
            <div class="playButtonSearch">▶</div></div>
            <div class="flex flex-col gap-[4px] max-w-[100px] w-full">
                <span class="Track text-[16px]">${item.title}</span>
                <span class="author text-[12px]">${item.artist.name}</span>
            </div>
        </div>
    `).join('');
}

container_search_info.addEventListener('click', (e) => {
    if (e.target.classList.contains('playButtonSearch')) {
        const currentAlbum = e.target.closest('.searchResultCard');
        const artistName = currentAlbum.dataset.artist;
        const albumName = currentAlbum.dataset.title;
        const albumTrackList = currentAlbum.dataset.tracklist;
        const cover = currentAlbum.dataset.cover;
        const albumData = {albumName, artistName, albumTrackList, cover};
        localStorage.setItem('currentAlbum', JSON.stringify(albumData));
        window.location.href = '../album/album.html'
    }
})