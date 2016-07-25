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

    this.closeEl.addEventListener('click', (e) => {
        console.log(this);
    }, false);
}

ModalAlert.prototype.show = function (content) {
    this.setContent(content);
    Modal.prototype.show.apply(this, arguments);
}

ModalAlert.prototype.setContent = function (content) {
    this.contentEl.innerHTML = content;
}
