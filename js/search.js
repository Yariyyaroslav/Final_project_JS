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
        <div class="searchResultCard">
            <img class="searchResultCardImage" src="${item.album.cover_small}" alt="photo">
            <div class="flex flex-col gap-[4px] max-w-[100px] w-full">
                <span class="Track text-[16px]">${item.title}</span>
                <span class="author text-[12px]">${item.artist.name}</span>
            </div>
        </div>
    `).join('');
}
