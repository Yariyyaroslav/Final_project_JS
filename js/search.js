let search = document.getElementById('searchMain');
let container_search_info = document.getElementById('searchInfo');
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}
search.addEventListener('input', debounce(handleSearch, 200))
async function handleSearch(){
    const query = search.value;
    if (!query) {
        container_search_info.style.display = 'none';
        return;
    }
    if (query.length < 2) {
        container_search_info.style.display = 'none';
        return;
    }
    const tracksRes = await sendRequest('GET', proxyUrl + `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=5`);
    const artistsRes = await sendRequest('GET', proxyUrl + `https://api.deezer.com/search/artist?q=${encodeURIComponent(query)}&limit=5`);
    let artists = artistsRes.data.filter(artist => artist.nb_fan >= 100);
    const tracks = tracksRes.data;
    const results = artists.concat(tracks);
    createSearchResults(results);
    console.log("Filtered Artists:", artists);
    console.log("Tracks:", tracksRes);
}
search.addEventListener('click', () => {
    if (search.value) {
        container_search_info.style.display = 'flex';
    }
});

container_search_info.addEventListener('click', function (e) {
    e.stopPropagation();
});

document.addEventListener('click', function (e) {
    if (!e.target.closest('#searchInfo') && !e.target.closest('#searchMain')) {
        container_search_info.style.display = 'none';
    }
});

function createSearchResults(items) {
    container_search_info.style.display = 'flex';

    container_search_info.innerHTML = items.map(function (item) {
        if (item.type === 'track') {
            return `
                <div class="searchResultCard track" 
                     data-artist="${item.artist.name}" 
                     data-title="${item.album.title}" 
                     data-tracklist="${item.album.tracklist}" 
                     data-cover="${item.album.cover_big}">
                    <div class="overlayAlbum"></div>
                    <div class="searchImgButton">
                        <img class="searchResultCardImage" src="${item.album.cover_small}" alt="track">
                        <div class="playButtonSearch">▶</div>
                    </div>
                    <div class="flex flex-col gap-[4px] max-w-[100px] w-full">
                        <span class="Track text-[16px]">${item.title}</span>
                        <span class="author text-[12px]">${item.artist.name}</span>
                    </div>
                </div>
            `;
        }

        if (item.type === 'artist') {
            return `
        <div class="searchResultCard artist" 
             data-artist="${item.name}" 
             data-id="${item.id}" 
             data-picture="${item.picture_big}">
            <div class="searchImgButton">
                <img class="searchResultCardImage" src="${item.picture_medium}" alt="${item.name}">
            </div>
            <div class="flex flex-col gap-[4px] max-w-[100px] w-full">
                <span class="author text-[14px]">${item.name}</span>
                <span class="fans text-[12px]">${item.nb_fan} fans</span>
            </div>
        </div>
    `;
        }

        return '';
    }).join('');
}

container_search_info.addEventListener('click', function (e) {
    const card = e.target.closest('.searchResultCard');
    if (!card) {
        return
    }
    if (card.classList.contains('track')) {
        const albumData = {
            albumName: card.dataset.title,
            artistName: card.dataset.artist,
            albumTrackList: card.dataset.tracklist,
            cover: card.dataset.cover
        };
        localStorage.setItem('currentAlbum', JSON.stringify(albumData));
        window.location.href = '../album/album.html';
    }
    if (card.classList.contains('artist')) {
        const artistData = {
            artistName: card.dataset.artist,
            cover: card.dataset.picture,
            id: card.dataset.id
        };
        localStorage.setItem('currentArtist', JSON.stringify(artistData));
        window.location.href = '../artist/artist.html';
    }
});

