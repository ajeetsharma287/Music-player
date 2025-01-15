const play = document.querySelector(".play");
previous = document.querySelector(".prev");
next = document.querySelector(".next");
//
trackImage = document.querySelector(".track-image");
title = document.querySelector(".title");
artist = document.querySelector("#artist");
//
trackCurrentTime = document.querySelector(".current-time");
trackDuration = document.querySelector(".duration-time");
slider = document.querySelector(".duration-timer");
//
showVolume = document.querySelector("#show-volume");
volumeIcon = document.querySelector("#volume-icon");
currentVolume = document.querySelector("#volume");
//
autoPlayBtn = document.querySelector(".play-all");
//
hamBurger = document.querySelector(".fa-bars");
closeIcon = document.querySelector(".fa-times");
//
musicPlaylist = document.querySelector(".music-playlist");
pDiv = document.querySelector(".playlist-div");
playlist = document.querySelector(".playlist");
//

let timer;
let autoplay = 0;
let indexTrack = 0;
let songIsPlaying = false;
let track = document.createElement("audio");

//All EventListeners
play.addEventListener("click", justPlay);
next.addEventListener("click", nextsong);
previous.addEventListener("click", prevSong);
autoPlayBtn.addEventListener("click", autoPlayToggle);
volumeIcon.addEventListener("click", muteSound);
currentVolume.addEventListener("change", changeVolume);
slider.addEventListener("change", changeDuration);
track.addEventListener("timeupdated", songTimeUpdate);
hamBurger.addEventListener("click", showPlaylist);
closeIcon.addEventListener("click", hidePlaylist);
// Load Track

function loadTrack(indexTrack) {
  clearInterval(timer);
  resetSlider();

  track.src = tracklist[indexTrack].path;
  trackImage.src = tracklist[indexTrack].img;
  title.innerHTML = tracklist[indexTrack].name;
  artist.innerHTML = tracklist[indexTrack].singer;

  track.load();

  timer = setInterval(updateSlider, 1000);
}
loadTrack(indexTrack);

// Play Song or Pause Song

function justPlay() {
  if (songIsPlaying == false) {
    playTrack();
  } else {
    pauseTrack();
  }
}

//Play Song

function playTrack() {
  track.play();
  songIsPlaying = true;
  play.innerHTML = '<i class="fa fa-pause"></i>';
}

//Pause Song

function pauseTrack() {
  track.pause();
  songIsPlaying = false;
  play.innerHTML = '<i class="fas fa-play"></i>';
}

//Next Song

function nextsong() {
  if (indexTrack < tracklist.length - 1) {
    indexTrack++;
    loadTrack(indexTrack);
    playTrack();
  } else {
    indexTrack = 0;
    loadTrack(indexTrack);
    playTrack();
  }
}

//Previous Song

function prevSong() {
  if (indexTrack > 0) {
    indexTrack--;
    loadTrack(indexTrack);
    playTrack();
  } else {
    indexTrack = tracklist.length - 1;
    loadTrack(indexTrack);
    playTrack();
  }
}

//Mute Sound

function muteSound() {
  track.volume = 0;
  showVolume.innerHTML = 0;
  currentVolume.value = 0;
}
// Change Volume

function changeVolume() {
  showVolume.value = currentVolume.value;
  track.volume = currentVolume.value / 100;
}

// Change Duration

function changeDuration() {
  let sliderPosition = track.duration * (slider.value / 100);
  track.currentTime = sliderPosition;
}

// Auto play

function autoPlayToggle() {
  if (autoplay == 0) {
    autoplay = 1;
    autoPlayBtn.style.background = "#db6400";
  } else {
    autoplay = 0;
    autoPlayBtn.style.background = "#ccc";
  }
}

//Reset Slider
function resetSlider() {
  slider.value = 0;
}

// Update Song Slider , New Song play after end of song ,Track replay when track is end.
function updateSlider() {
  let position = 0;

  if (!isNaN(track.duration)) {
    position = track.currentTime * (100 / track.duration);
    slider.value = position;
  }

  if (track.ended) {
    play.innerHTML = '<i class="fas fa-play"></i>';
    if (autoplay == 1 && indexTrack < tracklist.length - 1) {
      indexTrack++;
      loadTrack(indexTrack);
      playTrack();
    } else if (autoplay == 1 && indexTrack == tracklist.length - 1) {
      indexTrack = 0;
      loadTrack(indexTrack);
      playTrack();
    }
  }
}

//Update currentsong time
function songTimeUpdate() {
  if (track.duration) {
    let curmins = Math.floor(track.currentTime / 60);
    let cursecs = Math.floor(track.currentTime - curmins * 60);
    let durmins = Math.floor(track.duration / 60);
    let dursecs = Math.floor(track.duration - durmins * 60);

    if (dursecs < 10) {
      dursecs = "0" + dursecs;
    }
    if (durmins < 10) {
      durmins = "0" + durmins;
    }
    if (curmins < 10) {
      curmins = "0" + curmins;
    }
    if (cursecs < 10) {
      cursecs = "0" + cursecs;
    }
    trackCurrentTime.innerHTML = curmins + ":" + cursecs;
    trackDuration.innerHTML = durmins + ":" + dursecs;
  } else {
    trackCurrentTime.innerHTML = "00" + ":" + "00";
    trackDuration.innerHTML = "00" + ":" + "00";
  }
}
// Ensure the event listener is correctly set up
track.addEventListener("timeupdate", songTimeUpdate);

//Show Playlist

function showPlaylist() {
  musicPlaylist.style.transform = "translateX(0)";
}

//Hide Playlist

function hidePlaylist() {
  musicPlaylist.style.transform = "translateX(-100%)";
}

//Display Playlist

let counter = 1;
function displayTracks() {
  for (let i = 0; i < tracklist.length; i++) {
    console.log(tracklist[i].name);
    let div = document.createElement("div");
    div.classList.add("playlist");
    div.innerHTML = `
        <span class="song-index">${counter++}</span>
                <p class="single-song">${tracklist[i].name}</p>
    
    `;
    pDiv.appendChild(div);
  }
  playFromPlaylist();
}
displayTracks();

//Play Track from Playlist

function playFromPlaylist() {
  pDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("single-song")) {
      // alert(e.target.innerText);
      const indexNum = tracklist.findIndex((item) => {
        return item.name === e.target.innerText;
      });
      loadTrack(indexNum);
      playTrack();
      hidePlaylist();
    }
  });
}
