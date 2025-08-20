const player = {
    audio: null,
    currentButtonCard: null,
    currentButtonAlbum: null,
    title: null,
    authorName: null,
    cover: null,
};

function playTrack(type, audio, button, title, authorName, cover) {
    if (player.audio && player.audio !== audio) {
        player.audio.pause();
        if (player.currentButtonCard) {
            player.currentButtonCard.textContent = '▶';
        }
        if (player.currentButtonAlbum) {
            player.currentButtonAlbum.textContent = '▶';
        }
        updateHeaderIcon(false);
    }
    player.audio = audio;
    player.title = title;
    player.authorName = authorName;
    player.cover = cover;

    if (audio.paused) {
        audio.play();
        updateHeaderIcon(true);
        updateHeader(title, authorName, cover);
        if (type !== "header") {
            button.textContent = '⏸';
        }
        if (type === "card") {
            player.currentButtonCard = button;
        }
        if (type === "album") {
            player.currentButtonAlbum = button;
        }
        if (type === "header") {
            if (player.currentButtonCard) {
                player.currentButtonCard.textContent = '⏸';
            }
            if (player.currentButtonAlbum) {
                player.currentButtonAlbum.textContent = '⏸';
            }
        } else {
            updateHeaderIcon(true);
        }

    } else {
        audio.pause();
        updateHeaderIcon(false);
        if (type !== "header") {
            button.textContent = '▶';
        }
        if (type === "header") {
            if (player.currentButtonCard) {
                player.currentButtonCard.textContent = '▶';
            }
            if (player.currentButtonAlbum) {
                player.currentButtonAlbum.textContent = '▶';
            }
        } else {
            updateHeaderIcon(false);
        }
    }
}


async function nextTrack() {

    if (player.currentButtonCard) {
        const currentCard = player.currentButtonCard.closest('.card');
        let nextCard = currentCard.nextElementSibling;

        if (!nextCard) {
            nextCard = currentCard.parentElement.firstElementChild;
        }

        const audio = nextCard.querySelector('audio');
        const title = nextCard.querySelector('.title').textContent;
        const authorName = nextCard.querySelector('.author').textContent;
        const cover = nextCard.querySelector('img').src;
        playCard(audio, nextCard.querySelector('.play-button'), title, authorName, cover);
    }

    else if (player.currentButtonHeader) {
        const trackData = await getRandomTrack();
        const audio = new Audio(trackData.preview);
        playHeader(audio, player.currentButtonHeader, trackData.title, trackData.artist.name, trackData.album.cover_medium);
    }
}

async function previousTrack() {

    if (player.currentButtonCard) {
        const currentCard = player.currentButtonCard.closest('.card');
        let previousCard = currentCard.previousElementSibling;
        if (!previousCard) {
            previousCard = currentCard.parentElement.lastElementChild;
        }

        const audio = previousCard.querySelector('audio');
        const title = previousCard.querySelector('.title').textContent;
        const authorName = previousCard.querySelector('.author').textContent;
        const cover = previousCard.querySelector('img').src;
        playCard(audio, previousCard.querySelector('.play-button'), title, authorName, cover);
    }

    else if (player.currentButtonHeader) {
        const trackData = await getRandomTrack();
        const audio = new Audio(trackData.preview);
        playHeader(audio, player.currentButtonHeader, trackData.title, trackData.artist.name, trackData.album.cover_medium);
    }
}
