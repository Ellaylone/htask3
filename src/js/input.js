const linksForm = document.querySelector('.links-form');
const linksEl = document.querySelector('.links');
const playerEl = document.querySelector('.player');
const submitEl = document.querySelector('.links-form__submit');

let isSubtitleShown = false;
let subtitles;
let subTimeout;

linksForm.addEventListener('change', _onInputChange, false);
submitEl.addEventListener('click', checkInputs, false);

function _onInputChange (e) {
    var reader = new FileReader();

    switch (true) {
    case e.target.classList.contains('links-form__video'):
        reader.readAsDataURL(e.target.files[0]);
        reader.addEventListener('load', (e) => {
            createVideo(reader.result);
        });
        break;
    case e.target.classList.contains('links-form__sub'):
        reader.readAsText(e.target.files[0]);
        reader.addEventListener('load', (e) => {
            subtitles = parseSrt(reader.result);
        });
        break;
    case e.target.classList.contains('links-form__audio'):
        reader.readAsDataURL(e.target.files[0]);
        reader.addEventListener('load', (e) => {
            createAudio(reader.result);
        });
        break;
    default:
        break;
    }
}

function checkInputs (e) {
    e.preventDefault();
    let inputs = document.querySelectorAll('.links-form__input');
    let validation = true;

    inputs.forEach((input) => {
        if(input.value === ''){
            validation = false;
        }
    });

    if(validation) {
        showPlayer();
        initCanvas();
    }
}

function createVideo (src) {
    video = document.createElement('video');
    video.src = src;
    video.defaultMuted = true;
    video.classList.add('player__video');
    video.width = 700;
    video.height = 400;
    
    document.querySelector('.hidden-elements').appendChild(video);

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
}

function createAudio (src) {
    audio = document.createElement('audio');
	audio.src = src;
	audio.autoplay = false;
    audio.classList.add('player__audio');

    document.querySelector('.hidden-elements').appendChild(audio);
}
