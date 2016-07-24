linksForm.addEventListener('submit', _onLinksFormSubmit, false);
linksFormInputs.forEach((input) => {
        input.addEventListener('focus', _onInputFocus, false);
});

function _onInputFocus (e) {
    e.target.setSelectionRange(0, e.target.value.length);
}

function _onLinksFormSubmit (e) {
    e.preventDefault();
    toggleLoader();
    let inputs = document.querySelectorAll('.links-form__input');
    let validation = true;

    inputs.forEach((input) => {
        if(input.value === ''){
            validation = false;
        }
    });

    if(validation) {
        Promise.all([
            createVideo(videoInput.value),
            createAudio(audioInput.value),
            fetch(subInput.value)
        ]).then((res) => {
            initCanvas();
            showPlayer();
            toggleLoader();
        }).catch((err) => {
            toggleLoader();
            console.log(err);
        });
    } else {
        toggleLoader();
    }
}

function createVideo (src) {
    return new Promise((resolve, reject) => {
        try {
            video = document.createElement('video');
            video.setAttribute('crossorigin', 'anonymous');
            video.setAttribute('preload', true);

            video.src = corsProxy + src;
            video.defaultMuted = true;
            video.classList.add('player__video');

            video.addEventListener('play', startDrawLoop, false);

            video.addEventListener('pause', stopDrawLoop, false);

            video.addEventListener('timeupdate', (e) => {
                let time = (e.target.currentTime * 1000).toFixed();
                if (typeof subtitles[subtitleIndex] !== 'undefined' && time >= subtitles[subtitleIndex].endTime) {
                    if (!isSubtitleShown) {
                        showSub(subtitles[subtitleIndex]);
                        startSubTimeout();
                    }
                }
            });

            video.addEventListener('ended', (e) => {
                audio.pause();
                stopDrawLoop();
            }, false);

            video.addEventListener('loadeddata', (e) => {
                document.querySelector('.hidden-elements').appendChild(video);
                videoSizeRatio = video.videoWidth / video.videoHeight;
			    videoWidth = parseInt(getComputedStyle(video).width).toFixed();
			    videoHeight = videoWidth / videoSizeRatio;

                resolve(video);
            }, false);
        } catch(e) {
            reject(e);
        }
    });
}

function createAudio (src) {
    return new Promise((resolve, reject) => {
        try {
            audio = document.createElement('audio');
            audio.setAttribute('crossorigin', 'anonymous');
	        audio.src = corsProxy + src;
	        audio.autoplay = false;
            audio.classList.add('player__audio');

            audio.addEventListener('loadeddata', (e) => {
                document.querySelector('.hidden-elements').appendChild(audio);
                resolve(audio);
            });
        } catch(e) {
            reject(e);
        }
    });    
}
