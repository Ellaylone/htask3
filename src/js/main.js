// main
const canvasBgColor = '#000',
      canvasControlsColor = '#fff',
      canvasFontColor = '#fff',
      canvasFontSize = 24,
      canvasLineHeight = 12;

const linksForm = document.querySelector('.links-form'),
      linksEl = document.querySelector('.links'),
      playerEl = document.querySelector('.player'),
      submitEl = document.querySelector('.links-form__submit'),

      linksFormInputs = document.querySelectorAll('.links-form__input'),
      videoInput = document.querySelector('.links-form__video'),
      audioInput = document.querySelector('.links-form__audio'),
      subInput = document.querySelector('.links-form__sub');

const fps = 1000 / 60;

let video, canvas, audio;
canvas = document.querySelector('.player__canvas');

let controlElements = [],
    reader = new FileReader(),
    srt;

let videoWidth,
    videoHeight,
    videoSizeRatio;

let isSubtitleShown = false,
    subtitles,
    subTimeout,
    subtitleIndex = 0;

let ctx = canvas.getContext('2d');
let loopId;

let loaderStatus = false,
    overlayEl = document.querySelector('.overlay'),
    loaderWrapEl = document.querySelector('.loader-wrap');

let corsProxy = 'http://cors.io/?u=';

function showPlayer () {
    linksEl.classList.add('hidden');
    playerEl.classList.remove('hidden');
}

function initCanvas () {
    canvas = document.querySelector('.player__canvas');
    canvasStartState();

    canvas.addEventListener('click', (e) => {
        let clickedX = e.pageX - e.target.offsetLeft;
        let clickedY = e.pageY - e.target.offsetTop;
        controlElements.some((el) => {
            if (clickedX < el.right && clickedX > el.left && clickedY > el.top && clickedY < el.bottom) {
                if(el.type == 'pause'){
                    if(!isSubtitleShown){
                        video.pause();
                        stopDrawLoop();
                        drawCenterPlayButton(canvasControlsColor);
                    } else {
                        stopSubTimeout();
                    }
                    audio.pause();
                    controlElements = [];
                    createStartElement();
                } else {
                    if(!isSubtitleShown) {
                        video.play();
                    } else {
                        startSubTimeout();
                    }
                    audio.play();
                    createPauseElement();   
                }
            }
        });
    }, false);
}

function createStartElement () {
    controlElements = [{
        type: 'start',
        top: 0,
        left: 0,
        right: canvas.width,
        bottom: canvas.height
    }];
}

function createPauseElement () {
    controlElements = [{
        type: 'pause',
        top: 0,
        left: 0,
        right: canvas.width,
        bottom: canvas.height
    }];
}

function canvasStartState () {
    video.width = canvas.width = video.offsetWidth;
    video.height = canvas.height = video.offsetHeight;
    let ctx = canvas.getContext('2d');
    drawBackground(canvasBgColor);
    drawCenterPlayButton(canvasControlsColor);
}

function toggleOverlay () {
    
}

function showAlert (msg) {
    
}

function hideAlert () {
    
}

function toggleLoader () {
    switch (loaderStatus) {
    case true:
        loaderStatus = false;
        overlayEl.classList.add('hidden');
        loaderWrapEl.classList.add('hidden');
        break;
    default:
        loaderStatus = true;
        overlayEl.classList.remove('hidden');
        loaderWrapEl.classList.remove('hidden');
        break;
    }
}
