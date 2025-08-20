document.addEventListener('DOMContentLoaded', async () => {
    const getCharts = await sendRequest('GET', proxyUrl + getChartsUrl);
    document.querySelectorAll('.chart-section').forEach(section => {
        const type = section.dataset.type;
        const container = section.querySelector('.scroll-container');
        console.log(getCharts)
        createCards(container, getCharts[type].data, type);
        section.querySelectorAll('.scroll-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                scrollContainer(container, btn.dataset.dir);
            });
        });
    });
});

function scrollContainer(container, dir) {
    const card = container.querySelector('.card, .cardArtists');
    const distance = card ? card.offsetWidth + 16 : 320;
    container.scrollBy({ left: dir === 'left' ? -distance : distance, behavior: 'smooth' });
}

function createCards(container, items, type) {
    items.forEach(item => {
        const div = document.createElement('div');
        div.classList.add(type === 'artists' ? 'cardArtists' : 'card');
        div.classList.add(type === 'albums'? 'album': null);
        if (type === 'albums') {
            div.dataset.artist = item.artist.name;
            div.dataset.title = item.title;
            div.dataset.tracklist = item.tracklist;
            div.dataset.cover = item.cover_big;
        }
        const title = type === 'artists' ? null : item.title;
        const authorName = type === 'artists' ? item.name
            : type === 'playlists' ? item.user.name
                : type === 'podcasts' ? null
                    : type === 'albums' || type === 'tracks' ? item.artist.name
                        : '';
        const cover = type === 'albums' ? item.cover_medium
            : type === 'artists' ? item.picture_big
                : type === 'playlists' ? item.picture_big
                    : type === 'podcasts' ? item.picture_big
                        : item.album.cover_medium;
        const audioSrc = type === 'tracks' ? item.preview : null;

        div.innerHTML = type === 'artists' ? `
            <img class="imageArtist" src="${cover}" alt="Cover">
            <div class="p-[10px]">
                <p class="author text-[18px] text-black">${authorName}</p>
            </div>
        ` : type === 'tracks' ? `
            <div class="overlay"></div>
            <button class="play-button">▶</button>
            <img class="w-full object-cover" src="${cover}" alt="Cover">
            <audio src="${audioSrc}"></audio>
            <div class="p-[10px]">
                <p class="title text-[12px] font-[600]">${title}</p>
                <p class="author text-[10px] text-gray-400">${authorName}</p>
            </div>
        ` : type === 'albums' ? `
            <div class="overlay"></div>
            <button class="openBtn">↗️</button>
            <img class="w-full object-cover" src="${cover}" alt="Cover">
            <div class="p-[10px]">
                <p class="title text-[12px] font-[600]">${title}</p>
                <p class="author text-[10px] text-gray-400">${authorName}</p>
            </div>
        ` : `
            <img class="w-full object-cover" src="${cover}" alt="Cover">
            <div class="p-[10px]">
                <p class="title text-[12px] font-[600]">${title}</p>
                <p class="author text-[10px] text-gray-400">${authorName}</p>
            </div>
        `;
        container.appendChild(div);
    });
}


