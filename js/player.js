const player = {
    audio: null,
    currentButtonCard: null,
    currentButtonAlbum: null,
    currentButtonArtist: null,
    title: null,
    type: null,
    authorName: null,
    cover: null,
    volume: 0.5,
};



function playTrack(type, audio, button, title, authorName, cover) {
    if (player.audio && player.audio !== audio) {
        setCookie('musicIsPlaying', false);
        player.audio.pause();
        player.audio.removeEventListener('ended', trackEnd);
        player.audio.removeEventListener('timeupdate', timeTrackValue);
        if (player.currentButtonCard) {
            player.currentButtonCard.textContent = '▶';
        }
        if (player.currentButtonAlbum) {
            player.currentButtonAlbum.textContent = '▶';
        }
        if (player.currentButtonArtist) {
            player.currentButtonArtist.textContent = '▶';
        }
        updateHeaderIcon(false);
    }

    player.type = type;
    audio.volume = player.volume;
    player.audio = audio;
    player.title = title;
    player.authorName = authorName;
    player.cover = cover;

    function trackEnd() {
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
        setCookie('musicIsPlaying', true);
        setPlayingMusic(player)
        audio.play();
        updateHeaderIcon(true);
        updateHeader(title, authorName, cover);
        if (type !== "header" && button) {
            button.textContent = '⏸';
        }
        if (type === "card") {
            player.currentButtonCard = button;
        }
        if (type === "album") {
            player.currentButtonAlbum = button;
        }
        if (type === "artist") {
            player.currentButtonArtist = button;
        }
        if (type === "header") {
            if (player.currentButtonCard) {
                player.currentButtonCard.textContent = '⏸';
            }
            if (player.currentButtonAlbum) {
                player.currentButtonAlbum.textContent = '⏸';
            }
            if (player.currentButtonArtist) {
                player.currentButtonArtist.textContent = '⏸';
            }
        } else {
            updateHeaderIcon(true);
        }

    } else {
        audio.pause();
        setCookie('musicIsPlaying', false);
        updateHeaderIcon(false);
        if (type !== "header"&& button) {
            button.textContent = '▶';
        }
        if (type === "header") {
            if (player.currentButtonCard) {
                player.currentButtonCard.textContent = '▶';
            }
            if (player.currentButtonAlbum) {
                player.currentButtonAlbum.textContent = '▶';
            }
            if (player.currentButtonArtist) {
                player.currentButtonArtist.textContent = '▶';
            }
        } else {
            updateHeaderIcon(false);
        }
    }
    setInterval(() => {
        setCookie('currentTime', player.audio.currentTime);
    })
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
        let cover
        if (nextTrack.classList.contains('allTrackList')) {
            cover = nextTrack.querySelector('.coverAlbum').src
        }
            const audio = nextTrack.querySelector('audio');
            const title = nextTrack.querySelector('h4').innerText;
            playTrack('album', audio, nextTrack.querySelector('.btnToPlay'), title, player.authorName, cover || player.cover);
        } else if(player.currentButtonArtist) {
        const currentTrack = player.currentButtonArtist.closest('.trackArtist');
        const currentGrid = currentTrack.closest('.gridSongs');
        const allGrids = [...document.querySelectorAll('.gridSongs')];
        const currentGridIndex = allGrids.indexOf(currentGrid);
        let nextTrack = currentTrack.nextElementSibling;
        if (!nextTrack) {
            let nextGrid = allGrids[currentGridIndex + 1];
            if (!nextGrid) {
                nextGrid = allGrids[0];
            }
            nextTrack = nextGrid.querySelector('.trackArtist');
        }
        const audio = nextTrack.querySelector('audio');
        const title = nextTrack.querySelector('.title').innerText;
        const cover = nextTrack.querySelector('.cover').src;
        console.log(cover)
        playTrack('artist', audio, nextTrack.querySelector('.playButtonTrackArtist'), title, player.authorName, cover)
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
            let cover
            if (previousCard.classList.contains('allTrackList')) {
                cover = previousCard.querySelector('.coverAlbum').src
            }
            const audio = previousCard.querySelector('audio');
            const title = previousCard.querySelector('h4').innerText;
            playTrack('album', audio, previousCard.querySelector('.btnToPlay'), title, player.authorName, cover || player.cover)
        } else if(player.currentButtonArtist) {
            const currentTrack = player.currentButtonArtist.closest('.trackArtist');
            const currentGrid = currentTrack.closest('.gridSongs');
            const allGrids = [...document.querySelectorAll('.gridSongs')];
            const currentGridIndex = allGrids.indexOf(currentGrid);
            let prevTrack = currentTrack.previousElementSibling;

            if (!prevTrack) {
                let prevGrid = allGrids[currentGridIndex - 1];
                if (!prevGrid) {
                    prevGrid = allGrids[allGrids.length - 1];
                }
                const tracksInPrevGrid = prevGrid.querySelectorAll('.trackArtist');
                prevTrack = tracksInPrevGrid[tracksInPrevGrid.length - 1];
            }
            const audio = prevTrack.querySelector('audio');
            const title = prevTrack.querySelector('.title').innerText;
            const cover = prevTrack.querySelector('.cover').src;
            console.log(cover)
            playTrack('artist', audio, prevTrack.querySelector('.playButtonTrackArtist'), title, player.authorName, cover)
        }else {
            const trackData = await getRandomTrack();
            const audio = new Audio(trackData.preview);
            playTrack('header', audio, null, trackData.title, trackData.artist.name, trackData.album.cover_medium)
        }
}
