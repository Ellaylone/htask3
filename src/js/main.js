window.addEventListener('load', (e) => {
    setTimeout(() => {
        loader.hide();
        overlay.hide();
    }, 2000);
});

window.addEventListener('resize', (e) => {
    if(loopId) {
        onCanvasClick('pause');
    }
    canvasStartState();
}, false);

function Modal (el) {
    this.element = el;
    this.status = false
}

Modal.prototype.hide = function () {
    this.element.classList.add('hidden');
    this.status = false;
}

Modal.prototype.show = function () {
    this.element.classList.remove('hidden');
    this.status = true;
}

Modal.prototype.toggle = function () {
    this.element.classList.toggle('hidden');
    if(this.element.classList.contains('hidden')) {
        this.status = false;
    } else {
        this.status = true;
    }
}

function ModalAlert (el) {
    Modal.apply(this, arguments);
    this.contentEl = this.element.querySelector('.alert__content');
    this.closeEl = this.element.querySelector('.close');

    this.closeEl.addEventListener('click', this.hide.bind(this), false);
}

ModalAlert.prototype = Object.create(Modal.prototype);
ModalAlert.prototype.constructor = ModalAlert;

ModalAlert.prototype.show = function (content) {
    this.setContent(content);
    Modal.prototype.show.apply(this, arguments);
}

ModalAlert.prototype.setContent = function (content) {
    this.contentEl.innerHTML = content;
}


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

let loaderStatus = false;
    
let loader = new Modal(document.querySelector('.loader-wrap'));
let overlay = new Modal(document.querySelector('.overlay'));
let modalAlert = new ModalAlert(document.querySelector('.alert'));
overlay.element.addEventListener('click', (e) => {
    if(modalAlert.status){
        modalAlert.hide();
        overlay.hide();
    }
}, false);

let corsProxy = 'http://cors.io/?u=';

function showPlayer () {
    linksEl.classList.add('hidden');
    playerEl.classList.remove('hidden');
}

function initCanvas () {
    canvasStartState();

    canvas.addEventListener('click', (e) => {
        let clickedX = e.pageX - e.target.offsetLeft;
        let clickedY = e.pageY - e.target.offsetTop;
        
        controlElements.some((el) => {
            if (clickedX < el.right && clickedX > el.left && clickedY > el.top && clickedY < el.bottom) {
                onCanvasClick(el.type);

            }
        });
    }, false);
}

function onCanvasClick (elType) {
    if(elType == 'start'){
        if(!isSubtitleShown) {
            video.play();
        } else {
            drawSub(subtitles[subtitleIndex]);
            startSubTimeout();
        }
        audio.play();
        createPauseElement();        
    } else {
        if(!isSubtitleShown){
            video.pause();
            stopDrawLoop();
            drawCenterPlayButton(canvasControlsColor);
        } else {
            drawSub(subtitles[subtitleIndex]);
            stopSubTimeout();
        }
        audio.pause();
        controlElements = [];
        createStartElement();
    }
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

function canvasResize () {
    let canvasWidth, canvasHeight;
    if(window.screen.width < window.screen.height) {
        if(window.screen.width > videoWidth) {
            canvasWidth = videoWidth;
        } else {
            canvasWidth = window.screen.width;
        }
        canvasHeight = canvasWidth / videoSizeRatio;
    } else {
        if(window.screen.height > videoHeight) {
            canvasHeight = videoHeight;
        } else {
            canvasHeight = window.screen.height;
        }
        canvasWidth = canvasHeight * videoSizeRatio;
    }
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}

function canvasStartState () {
    canvasResize();
    drawBackground(canvasBgColor);
    drawCenterPlayButton(canvasControlsColor);
}
