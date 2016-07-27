linksForm.addEventListener('submit', _onLinksFormSubmit, false);
linksFormInputs.forEach((input) => {
        input.addEventListener('focus', _onInputFocus, false);
});

function _onInputFocus (e) {
    e.target.setSelectionRange(0, e.target.value.length);
}

function _onLinksFormSubmit (e) {
    e.preventDefault();

    overlay.show();
    loader.show();

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
            createSub(subInput.value)
        ]).then((res) => {
            initCanvas();
            showPlayer();

            subtitles = parseSrt(res[2]);

            loader.hide();
            overlay.hide();
        }).catch((err) => {
            loader.hide();
            modalAlert.show(`<h4>Error:</h4>${err}`);
        });
    } else {
        loader.hide();
        overlay.hide();
    }
}

function createSub (src) {
    return new Promise((resolve, reject) => {
        try {
            let subReq = new XMLHttpRequest();

            subReq.addEventListener('readystatechange', (e) => {
                if (subReq.readyState === 4 && subReq.status === 200) {
                    resolve(subReq.responseText);
                }
            });

            subReq.open('GET', src, false);
            subReq.send();
        } catch (e) {
            reject(e);
        }
    });
}

function createVideo (src) {
    return new Promise((resolve, reject) => {
        try {
            video = document.createElement('video');
            video.setAttribute('crossorigin', 'anonymous');
            video.setAttribute('preload', true);

            video.src = corsProxy + src;
            video.defaultMuted = true;
            video.style.visibility = 'hidden';

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
                document.querySelector('body').appendChild(video);

                videoSizeRatio = video.videoWidth / video.videoHeight;
			    videoWidth = parseInt(getComputedStyle(video).width).toFixed();
			    videoHeight = videoWidth / videoSizeRatio;
                video.classList.add('player__video');
                video.style.display = 'none';

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
