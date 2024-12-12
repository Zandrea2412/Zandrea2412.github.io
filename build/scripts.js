const songs = [
    {
        title: "Song 1",
        mp3: "../a1.mp3",
        image: "../a1.png"
    },
    {
        title: "Song 2",
        mp3: "../a2.mp3",
        image: "../a2.png"
    },
    {
        title: "Song 3",
        mp3: "../a3.mp3",
        image: "../a3.jpg"
    }
    // Aggiungi altre canzoni come preferisci
];

function getRandomSong(songs) {
    const randomIndex = Math.floor(Math.random() * songs.length);
    return songs[randomIndex];
}

function stopAudioAfterDuration(audioElement, durationInSeconds) {
    setTimeout(() => {
        audioElement.pause();
        pausa();
    }, durationInSeconds * 1000);
}

function pausa() {
    const icon = playButton.querySelector('i');
    icon.classList.remove('fa-pause');
    icon.classList.add('fa-play');
    playButton.classList.toggle('active');
}

const todaySong = getRandomSong(songs);

document.getElementById('songTitle').textContent = todaySong.title;
document.getElementById('audioElement').src = todaySong.mp3;
document.getElementById('imageElement').src = "https://via.placeholder.com/400x400.png?text=?";

const audioElement = document.getElementById('audioElement');
audioElement.volume = 0.1; // Imposta il volume al 10%
const volumeControl = document.getElementById('volumeControl');
const playButton = document.getElementById('playButton');
const guessInput = document.getElementById('guessInput');
const previewList = document.getElementById('previewList');

let startTime;  // Variabile per memorizzare il punto iniziale

volumeControl.addEventListener('input', function () {
    audioElement.volume = volumeControl.value;
});

playButton.addEventListener('click', function () {
    const icon = playButton.querySelector('i');
    playButton.classList.toggle('active');

    if (playButton.classList.contains('active')) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');

        if (!startTime) {  // Se startTime non è già stato impostato
            audioElement.addEventListener('loadedmetadata', function () {
                const duration = audioElement.duration;
                startTime = Math.random() * (duration - 10);  // Imposta startTime una volta
                audioElement.currentTime = startTime;
                audioElement.play();
                stopAudioAfterDuration(audioElement, 10);
            }, { once: true });

            if (audioElement.readyState >= 2) {
                const duration = audioElement.duration;
                startTime = Math.random() * (duration - 10);  // Imposta startTime una volta
                audioElement.currentTime = startTime;
                audioElement.play();
                stopAudioAfterDuration(audioElement, 10);
            }
        } else {
            audioElement.currentTime = startTime;
            audioElement.play();
            stopAudioAfterDuration(audioElement, 10);
        }

    } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        audioElement.pause();
    }
});

function updatePreviewList(query) {
    if (query.length > 0) {
        previewList.classList.add('visible');
        previewList.innerHTML = '';
        const filteredSongs = songs.filter(song => song.title.toLowerCase().includes(query.toLowerCase()));
        filteredSongs.forEach(song => {
            const item = document.createElement('div');
            item.className = 'preview-item';
            item.innerHTML = `<img src="${song.image}" alt="${song.title}"><span>${song.title}</span>`;
            item.addEventListener('click', function () {
                guessInput.value = song.title;
                previewList.innerHTML = '';
                previewList.classList.remove('visible');
            });
            previewList.appendChild(item);
        });
    } else {
        previewList.innerHTML = '';
        previewList.classList.remove('visible');
    }
}

guessInput.addEventListener('input', function () {
    const query = guessInput.value;
    updatePreviewList(query);
});

guessInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        submitGuess();
    }
});

function submitGuess() {
    const userGuess = guessInput.value.trim();
    const result = document.getElementById('result');
    if (userGuess.toLowerCase() === todaySong.title.toLowerCase()) {
        result.textContent = "Corretto! La canzone è " + todaySong.title;
        document.getElementById('songTitle').style.display = 'block';
        document.getElementById('imageElement').src = todaySong.image; // Mostra l'immagine della canzone
    } else {
        result.textContent = "Sbagliato. Riprova!";
    }
}
