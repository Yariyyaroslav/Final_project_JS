const player = {
    audio: null,
    currentButtonCard: null,
    currentButtonAlbum: null,
    title: null,
    authorName: null,
    cover: null,
    volume: 0.5,
};


function playTrack(type, audio, button, title, authorName, cover) {
    if (player.audio && player.audio !== audio) {
        player.audio.pause();
        player.audio.removeEventListener('ended', trackEnd);
        player.audio.removeEventListener('timeupdate', timeTrackValue);
        if (player.currentButtonCard) {
            player.currentButtonCard.textContent = '▶';
        }
        if (player.currentButtonAlbum) {
            player.currentButtonAlbum.textContent = '▶';
        }
        updateHeaderIcon(false);
    }
    audio.volume = player.volume;
    player.audio = audio;
    player.title = title;
    player.authorName = authorName;
    player.cover = cover;

    function trackEnd() {
        console.log("end");
        nextTrack();
    }
    function timeTrackValue() {
        const progress = player.audio.currentTime / player.audio.duration;
        const containerWidth = document.querySelector('.progressContainer').offsetWidth;
        timeTrack.style.width = (progress * containerWidth) + 'px';
    }
    player.audio.addEventListener('ended', trackEnd);
    player.audio.addEventListener('timeupdate', timeTrackValue);

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
        const title = nextCard.querySelector('.title').innerText;
        const authorName = nextCard.querySelector('.author').innerText;
        const cover = nextCard.querySelector('img').src;
        playTrack('card', audio, nextCard.querySelector('.play-button'), title, authorName, cover)
    } else if (player.currentButtonAlbum) {
            const currentTrack = player.currentButtonAlbum.closest('.trackAlbum');
            let nextTrack = currentTrack.nextElementSibling;
            if (!nextTrack) {
                nextTrack = currentTrack.parentElement.firstElementChild;
            }
            const audio = nextTrack.querySelector('audio');
            const title = nextTrack.querySelector('h4').innerText;
            playTrack('album', audio, nextTrack.querySelector('.btnToPlay'), title, player.authorName, player.cover);
        } else {
            const trackData = await getRandomTrack();
            const audio = new Audio(trackData.preview);
            playTrack('header', audio, null, trackData.title, trackData.artist.name, trackData.album.cover_medium)
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
            const title = previousCard.querySelector('.title').innerText;
            const authorName = previousCard.querySelector('.author').innerText;
            const cover = previousCard.querySelector('img').src;
            playTrack('card', audio, previousCard.querySelector('.play-button'), title, authorName, cover)
        } else if (player.currentButtonAlbum) {
            const currentTrack = player.currentButtonAlbum.closest('.trackAlbum');
            let previousCard = currentTrack.previousElementSibling;
            if (!previousCard) {
                previousCard = currentTrack.parentElement.lastElementChild;
            }
            const audio = previousCard.querySelector('audio');
            const title = previousCard.querySelector('h4').innerText;
            playTrack('album', audio, previousCard.querySelector('.btnToPlay'), title, player.authorName, player.cover)
        } else {
            const trackData = await getRandomTrack();
            const audio = new Audio(trackData.preview);
            playTrack('header', audio, null, trackData.title, trackData.artist.name, trackData.album.cover_medium)
        }
}
