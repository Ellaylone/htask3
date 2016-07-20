"use strict";function showPlayer(){linksEl.classList.add("hidden"),playerEl.classList.remove("hidden")}function initCanvas(){canvas=document.querySelector(".player__canvas"),canvasStartState(),canvas.addEventListener("click",function(t){var e=t.pageX-t.target.offsetLeft,a=t.pageY-t.target.offsetTop;controlElements.some(function(t){e<t.right&&e>t.left&&a>t.top&&a<t.bottom&&("pause"==t.type?(isSubtitleShown?stopSubTimeout():(video.pause(),stopDrawLoop()),audio.pause(),controlElements=[],createStartElement()):(isSubtitleShown?startSubTimeout():video.play(),audio.play(),createPauseElement()))})},!1)}function createStartElement(){controlElements=[{type:"start",top:0,left:0,right:canvas.width,bottom:canvas.height}]}function createPauseElement(){controlElements=[{type:"pause",top:0,left:0,right:canvas.width,bottom:canvas.height}]}function canvasStartState(){video.width=canvas.width=video.offsetWidth,video.height=canvas.height=video.offsetHeight;var t=canvas.getContext("2d");drawBackground(t,canvasBgColor),drawCenterPlayButton(t,canvasControlsColor)}function grayAndGrain(t){for(var e=t.data,a=void 0,i=0;i<e.length;i+=4){a=Math.random()+1;var o=e[i],n=e[i+1],s=e[i+2],r=.2126*o+.7152*n+.0722*s;e[i]=e[i+1]=e[i+2]=r*a}return t}function drawBackground(t,e){t.fillStyle=e,t.fillRect(0,0,canvas.width,canvas.height)}function drawCenterPlayButton(t,e){t.fillStyle=""+e;var a={width:35,height:50};a.points={top:{x:(canvas.width-a.width)/2,y:(canvas.height-a.height)/2},bottom:{x:(canvas.width-a.width)/2,y:(canvas.height+a.height)/2},right:{x:(canvas.width+a.width)/2,y:canvas.height/2}},controlElements.push({type:"start",top:a.points.top.y,left:a.points.top.x,bottom:a.points.bottom.y,right:a.points.right.x}),t.beginPath(),t.moveTo(a.points.top.x,a.points.top.y),t.lineTo(a.points.bottom.x,a.points.bottom.y),t.lineTo(a.points.right.x,a.points.right.y),t.fill()}function drawSkratches(){var t=Math.random()*(.8-.2);ctx.strokeStyle="rgba(255, 255, 255, "+t+")";var e=Math.floor(101*Math.random());if(e-=98,e>0)for(var a=0;a<e;a++)skratch()}function skratch(){ctx.beginPath();var t={x:Math.floor(Math.random()*(canvas.width-1)),y:Math.floor(Math.random()*(canvas.height-1))},e={x:t.x,y:Math.floor(Math.random()*(canvas.height-t.y))};ctx.moveTo(t.x,t.y),ctx.lineTo(e.x,e.y),ctx.stroke()}function startDrawLoop(){loopId||isSubtitleShown?"undefined"!=typeof subtitles[subtitleIndex]&&(subTimeout=setTimeout(hideSub,subtitles[subtitleIndex].timeLength/2)):loopId=setInterval(drawLoop,fps)}function stopDrawLoop(){loopId&&(clearInterval(loopId),loopId=void 0)}function drawLoop(){ctx.clearRect(0,0,canvas.width,canvas.height),ctx.drawImage(video,0,0,video.width,video.height);var t=ctx.getImageData(0,0,canvas.width,canvas.height),e=grayAndGrain(t);ctx.putImageData(e,0,0),drawSkratches()}function _onInputChange(t){var e=new FileReader;switch(!0){case t.target.classList.contains("links-form__video"):e.readAsDataURL(t.target.files[0]),e.addEventListener("load",function(t){createVideo(e.result)});break;case t.target.classList.contains("links-form__sub"):e.readAsText(t.target.files[0]),e.addEventListener("load",function(t){subtitles=parseSrt(e.result)});break;case t.target.classList.contains("links-form__audio"):e.readAsDataURL(t.target.files[0]),e.addEventListener("load",function(t){createAudio(e.result)})}}function checkInputs(t){t.preventDefault();var e=document.querySelectorAll(".links-form__input"),a=!0;e.forEach(function(t){""===t.value&&(a=!1)}),a&&(showPlayer(),initCanvas())}function createVideo(t){video=document.createElement("video"),video.src=t,video.defaultMuted=!0,video.classList.add("player__video"),video.width=videoWidth,video.height=videoHeight,document.querySelector(".hidden-elements").appendChild(video),video.addEventListener("play",startDrawLoop,!1),video.addEventListener("pause",stopDrawLoop,!1),video.addEventListener("timeupdate",function(t){var e=(1e3*t.target.currentTime).toFixed();"undefined"!=typeof subtitles[subtitleIndex]&&e>=subtitles[subtitleIndex].endTime&&(isSubtitleShown||(showSub(subtitles[subtitleIndex]),startSubTimeout()))}),video.addEventListener("ended",function(t){audio.pause(),stopDrawLoop()},!1)}function createAudio(t){audio=document.createElement("audio"),audio.src=t,audio.autoplay=!1,audio.classList.add("player__audio"),document.querySelector(".hidden-elements").appendChild(audio)}function parseSrt(t){var e={sec:1e3,min:60,hr:60},a=t.split("\n\n"),i=a.map(function(t){var a={},i=t.split("\n");a.number=parseInt(i[0]);var o=i[1].split(" --> "),n=o[0].split(":"),s=parseInt(n[2].split(",").join("")),r=parseInt(n[1])*e.min*e.sec,d=parseInt(n[0])*e.hr*e.min*e.sec;n=s+r+d,a.startTime=n;var c=o[1].split(":"),l=parseInt(c[2].split(",").join("")),u=parseInt(c[1])*e.min*e.sec,h=parseInt(c[0])*e.hr*e.min*e.sec;return c=l+u+h,a.endTime=c,a.timeLength=c-n,i.splice(0,2),a.content=i,a});return i}function showSub(t){isSubtitleShown=!0,video.pause(),drawSub(t)}function drawSub(t){ctx.fillStyle="black",ctx.fillRect(0,0,canvas.width,canvas.height),ctx.fillStyle="white",ctx.font="1.5em Oranienbaum, serif";var e=24*t.content.length+12*(t.content.length-1),a=(canvas.height-e)/2;t.content.forEach(function(t,e){var i=a+24*e+12*e,o=.1*canvas.width;ctx.fillText(t,o,i)})}function hideSub(){isSubtitleShown&&(isSubtitleShown=!1,subtitleIndex++,video.play()),clearTimeout(subTimeout),subTimeout=void 0,controlElements=[],createPauseElement()}function stopSubTimeout(){subTimeout&&(clearTimeout(subTimeout),subTimeout=void 0)}function startSubTimeout(){subTimeout=setTimeout(hideSub,subtitles[subtitleIndex].timeLength)}var canvasBgColor="#000",canvasControlsColor="#fff",canvasFontColor="#fff",canvasFontSize=24,canvasLineHeight=12,linksForm=document.querySelector(".links-form"),linksEl=document.querySelector(".links"),playerEl=document.querySelector(".player"),submitEl=document.querySelector(".links-form__submit"),fps=1e3/60,video=void 0,canvas=void 0,audio=void 0;canvas=document.querySelector(".player__canvas");var controlElements=[],reader=new FileReader,srt=void 0,videoWidth=700,videoHeight=400,isSubtitleShown=!1,subtitles=void 0,subTimeout=void 0,subtitleIndex=0,ctx=canvas.getContext("2d"),loopId=void 0;linksForm.addEventListener("change",_onInputChange,!1),submitEl.addEventListener("click",checkInputs,!1);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJkcmF3LmpzIiwiaW5wdXQuanMiLCJzdWJzLmpzIl0sIm5hbWVzIjpbInNob3dQbGF5ZXIiLCJsaW5rc0VsIiwiY2xhc3NMaXN0IiwiYWRkIiwicGxheWVyRWwiLCJyZW1vdmUiLCJpbml0Q2FudmFzIiwiY2FudmFzIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiY2FudmFzU3RhcnRTdGF0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiY2xpY2tlZFgiLCJwYWdlWCIsInRhcmdldCIsIm9mZnNldExlZnQiLCJjbGlja2VkWSIsInBhZ2VZIiwib2Zmc2V0VG9wIiwiY29udHJvbEVsZW1lbnRzIiwic29tZSIsImVsIiwicmlnaHQiLCJsZWZ0IiwidG9wIiwiYm90dG9tIiwidHlwZSIsImlzU3VidGl0bGVTaG93biIsInN0b3BTdWJUaW1lb3V0IiwidmlkZW8iLCJwYXVzZSIsInN0b3BEcmF3TG9vcCIsImF1ZGlvIiwiY3JlYXRlU3RhcnRFbGVtZW50Iiwic3RhcnRTdWJUaW1lb3V0IiwicGxheSIsImNyZWF0ZVBhdXNlRWxlbWVudCIsIndpZHRoIiwiaGVpZ2h0Iiwib2Zmc2V0V2lkdGgiLCJvZmZzZXRIZWlnaHQiLCJjdHgiLCJnZXRDb250ZXh0IiwiZHJhd0JhY2tncm91bmQiLCJjYW52YXNCZ0NvbG9yIiwiZHJhd0NlbnRlclBsYXlCdXR0b24iLCJjYW52YXNDb250cm9sc0NvbG9yIiwiZ3JheUFuZEdyYWluIiwiaW1hZ2VEYXRhIiwicGl4ZWxzIiwiZGF0YSIsInZhbHVlIiwiaSIsImxlbmd0aCIsIk1hdGgiLCJyYW5kb20iLCJyIiwiZyIsImIiLCJ2IiwiY29sb3IiLCJmaWxsU3R5bGUiLCJmaWxsUmVjdCIsInRyaWFuZ2xlIiwicG9pbnRzIiwieCIsInkiLCJwdXNoIiwiYmVnaW5QYXRoIiwibW92ZVRvIiwibGluZVRvIiwiZmlsbCIsImRyYXdTa3JhdGNoZXMiLCJzdHJva2VPcGFjaXR5Iiwic3Ryb2tlU3R5bGUiLCJhbW91bnRPZlNrcmF0Y2hlcyIsImZsb29yIiwic2tyYXRjaCIsInN0YXJ0UG9pbnQiLCJlbmRQb2ludCIsInN0cm9rZSIsInN0YXJ0RHJhd0xvb3AiLCJsb29wSWQiLCJzdWJ0aXRsZXMiLCJzdWJ0aXRsZUluZGV4Iiwic3ViVGltZW91dCIsInNldFRpbWVvdXQiLCJoaWRlU3ViIiwidGltZUxlbmd0aCIsInNldEludGVydmFsIiwiZHJhd0xvb3AiLCJmcHMiLCJjbGVhckludGVydmFsIiwidW5kZWZpbmVkIiwiY2xlYXJSZWN0IiwiZHJhd0ltYWdlIiwiZ2V0SW1hZ2VEYXRhIiwiaW1hZ2VEYXRhRmlsdGVyZWQiLCJwdXRJbWFnZURhdGEiLCJfb25JbnB1dENoYW5nZSIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJjb250YWlucyIsInJlYWRBc0RhdGFVUkwiLCJmaWxlcyIsImNyZWF0ZVZpZGVvIiwicmVzdWx0IiwicmVhZEFzVGV4dCIsInBhcnNlU3J0IiwiY3JlYXRlQXVkaW8iLCJjaGVja0lucHV0cyIsInByZXZlbnREZWZhdWx0IiwiaW5wdXRzIiwicXVlcnlTZWxlY3RvckFsbCIsInZhbGlkYXRpb24iLCJmb3JFYWNoIiwiaW5wdXQiLCJzcmMiLCJjcmVhdGVFbGVtZW50IiwiZGVmYXVsdE11dGVkIiwidmlkZW9XaWR0aCIsInZpZGVvSGVpZ2h0IiwiYXBwZW5kQ2hpbGQiLCJ0aW1lIiwiY3VycmVudFRpbWUiLCJ0b0ZpeGVkIiwiZW5kVGltZSIsInNob3dTdWIiLCJhdXRvcGxheSIsInRleHQiLCJ0aW1lQ29uc3QiLCJzZWMiLCJtaW4iLCJociIsInRlbXAiLCJzcGxpdCIsIm1hcCIsInJlcyIsInN1YnRpdGxlIiwibnVtYmVyIiwicGFyc2VJbnQiLCJzdGFydFRpbWUiLCJzdGFydFRpbWVTZWMiLCJqb2luIiwic3RhcnRUaW1lTWluIiwic3RhcnRUaW1lSHIiLCJlbmRUaW1lU2VjIiwiZW5kVGltZU1pbiIsImVuZFRpbWVIciIsInNwbGljZSIsImNvbnRlbnQiLCJzdWIiLCJkcmF3U3ViIiwiZm9udCIsInRleHRIZWlnaHQiLCJ0b3BQYWRkaW5nIiwiZmlsbFRleHQiLCJjbGVhclRpbWVvdXQiLCJjYW52YXNGb250Q29sb3IiLCJjYW52YXNGb250U2l6ZSIsImNhbnZhc0xpbmVIZWlnaHQiLCJsaW5rc0Zvcm0iLCJzdWJtaXRFbCIsInNydCJdLCJtYXBwaW5ncyI6IkFBQUEsWUFpQ0EsU0FBU0EsY0FDTEMsUUFBUUMsVUFBVUMsSUFBSSxVQUN0QkMsU0FBU0YsVUFBVUcsT0FBTyxVQUc5QixRQUFTQyxjQUNMQyxPQUFTQyxTQUFTQyxjQUFjLG1CQUNoQ0MsbUJBRUFILE9BQU9JLGlCQUFpQixRQUFTLFNBQUNDLEdBQzlCLEdBQUlDLEdBQVdELEVBQUVFLE1BQVFGLEVBQUVHLE9BQU9DLFdBQzlCQyxFQUFXTCxFQUFFTSxNQUFRTixFQUFFRyxPQUFPSSxTQUNsQ0MsaUJBQWdCQyxLQUFLLFNBQUNDLEdBQ2RULEVBQVdTLEVBQUdDLE9BQVNWLEVBQVdTLEVBQUdFLE1BQVFQLEVBQVdLLEVBQUdHLEtBQU9SLEVBQVdLLEVBQUdJLFNBQ2xFLFNBQVhKLEVBQUdLLE1BQ0VDLGdCQUlBQyxrQkFIQUMsTUFBTUMsUUFDTkMsZ0JBSUpDLE1BQU1GLFFBQ05YLG1CQUNBYyx1QkFFSU4sZ0JBR0FPLGtCQUZBTCxNQUFNTSxPQUlWSCxNQUFNRyxPQUNOQywyQkFJYixHQUdQLFFBQVNILHNCQUNMZCxrQkFDSU8sS0FBTSxRQUNORixJQUFLLEVBQ0xELEtBQU0sRUFDTkQsTUFBT2hCLE9BQU8rQixNQUNkWixPQUFRbkIsT0FBT2dDLFNBSXZCLFFBQVNGLHNCQUNMakIsa0JBQ0lPLEtBQU0sUUFDTkYsSUFBSyxFQUNMRCxLQUFNLEVBQ05ELE1BQU9oQixPQUFPK0IsTUFDZFosT0FBUW5CLE9BQU9nQyxTQUl2QixRQUFTN0Isb0JBQ0xvQixNQUFNUSxNQUFRL0IsT0FBTytCLE1BQVFSLE1BQU1VLFlBQ25DVixNQUFNUyxPQUFTaEMsT0FBT2dDLE9BQVNULE1BQU1XLFlBQ3JDLElBQUlDLEdBQU1uQyxPQUFPb0MsV0FB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QUt2RyxFQUFNLEdBQUtBLEVBQ3BDN0IsRUFBdUIsR0FBZmpCLE9BQU8rQixLQUNuQkksS0FBSW1ILFNBQVN2SSxFQUFJRSxFQUFNQyxLQUkvQixRQUFTK0QsV0FDRDVELGtCQUNBQSxpQkFBa0IsRUFDbEJ5RCxnQkFDQXZELE1BQU1NLFFBRVYwSCxhQUFheEUsWUFDYkEsV0FBYVEsT0FDYjFFLG1CQUNBaUIscUJBR0osUUFBU1Isa0JBQ0Z5RCxhQUNDd0UsYUFBYXhFLFlBQ2JBLFdBQWFRLFFBSXJCLFFBQVMzRCxtQkFDTG1ELFdBQWFDLFdBQVdDLFFBQVNKLFVBQVVDLGVBQWVJLFlIeEY5RCxHQUFNNUMsZUFBZ0IsT0FDaEJFLG9CQUFzQixPQUN0QmdILGdCQUFrQixPQUNsQkMsZUFBaUIsR0FDakJDLGlCQUFtQixHQUVuQkMsVUFBWTFKLFNBQVNDLGNBQWMsZUFDbkNSLFFBQVVPLFNBQVNDLGNBQWMsVUFDakNMLFNBQVdJLFNBQVNDLGNBQWMsV0FDbEMwSixTQUFXM0osU0FBU0MsY0FBYyx1QkFFbENtRixJQUFNLElBQU8sR0FFZjlELE1BQUEsT0FBT3ZCLE9BQUEsT0FBUTBCLE1BQUEsTUFDbkIxQixRQUFTQyxTQUFTQyxjQUFjLGtCQUVoQyxJQUFJVyxvQkFDQWlGLE9BQVMsR0FBSUMsWUFDYjhELElBQUEsT0FFQTNDLFdBQWEsSUFDYkMsWUFBYyxJQUVkOUYsaUJBQWtCLEVBQ2xCd0QsVUFBQSxPQUNBRSxXQUFBLE9BQ0FELGNBQWdCLEVBRWhCM0MsSUFBTW5DLE9BQU9vQyxXQUFXLE1BQ3hCd0MsT0FBQSxNRTlCSitFLFdBQVV2SixpQkFBaUIsU0FBVXlGLGdCQUFnQixHQUNyRCtELFNBQVN4SixpQkFBaUIsUUFBU29HLGFBQWEiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIG1haW5cbmNvbnN0IGNhbnZhc0JnQ29sb3IgPSAnIzAwMCcsXG4gICAgICBjYW52YXNDb250cm9sc0NvbG9yID0gJyNmZmYnLFxuICAgICAgY2FudmFzRm9udENvbG9yID0gJyNmZmYnLFxuICAgICAgY2FudmFzRm9udFNpemUgPSAyNCxcbiAgICAgIGNhbnZhc0xpbmVIZWlnaHQgPSAxMjtcblxuY29uc3QgbGlua3NGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxpbmtzLWZvcm0nKSxcbiAgICAgIGxpbmtzRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGlua3MnKSxcbiAgICAgIHBsYXllckVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllcicpLFxuICAgICAgc3VibWl0RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGlua3MtZm9ybV9fc3VibWl0Jyk7XG5cbmNvbnN0IGZwcyA9IDEwMDAgLyA2MDtcblxubGV0IHZpZGVvLCBjYW52YXMsIGF1ZGlvO1xuY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllcl9fY2FudmFzJyk7XG5cbmxldCBjb250cm9sRWxlbWVudHMgPSBbXSxcbiAgICByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpLFxuICAgIHNydDtcblxubGV0IHZpZGVvV2lkdGggPSA3MDAsXG4gICAgdmlkZW9IZWlnaHQgPSA0MDA7XG5cbmxldCBpc1N1YnRpdGxlU2hvd24gPSBmYWxzZSxcbiAgICBzdWJ0aXRsZXMsXG4gICAgc3ViVGltZW91dCxcbiAgICBzdWJ0aXRsZUluZGV4ID0gMDtcblxubGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xubGV0IGxvb3BJZDtcblxuXG5mdW5jdGlvbiBzaG93UGxheWVyICgpIHtcbiAgICBsaW5rc0VsLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgIHBsYXllckVsLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xufVxuXG5mdW5jdGlvbiBpbml0Q2FudmFzICgpIHtcbiAgICBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyX19jYW52YXMnKTtcbiAgICBjYW52YXNTdGFydFN0YXRlKCk7XG5cbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBsZXQgY2xpY2tlZFggPSBlLnBhZ2VYIC0gZS50YXJnZXQub2Zmc2V0TGVmdDtcbiAgICAgICAgbGV0IGNsaWNrZWRZID0gZS5wYWdlWSAtIGUudGFyZ2V0Lm9mZnNldFRvcDtcbiAgICAgICAgY29udHJvbEVsZW1lbnRzLnNvbWUoKGVsKSA9PiB7XG4gICAgICAgICAgICBpZiAoY2xpY2tlZFggPCBlbC5yaWdodCAmJiBjbGlja2VkWCA+IGVsLmxlZnQgJiYgY2xpY2tlZFkgPiBlbC50b3AgJiYgY2xpY2tlZFkgPCBlbC5ib3R0b20pIHtcbiAgICAgICAgICAgICAgICBpZihlbC50eXBlID09ICdwYXVzZScpe1xuICAgICAgICAgICAgICAgICAgICBpZighaXNTdWJ0aXRsZVNob3duKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZGVvLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9wRHJhd0xvb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3BTdWJUaW1lb3V0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYXVkaW8ucGF1c2UoKTtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbEVsZW1lbnRzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZVN0YXJ0RWxlbWVudCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFpc1N1YnRpdGxlU2hvd24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZGVvLnBsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0U3ViVGltZW91dCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGF1ZGlvLnBsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlUGF1c2VFbGVtZW50KCk7ICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0YXJ0RWxlbWVudCAoKSB7XG4gICAgY29udHJvbEVsZW1lbnRzID0gW3tcbiAgICAgICAgdHlwZTogJ3N0YXJ0JyxcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICByaWdodDogY2FudmFzLndpZHRoLFxuICAgICAgICBib3R0b206IGNhbnZhcy5oZWlnaHRcbiAgICB9XTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUGF1c2VFbGVtZW50ICgpIHtcbiAgICBjb250cm9sRWxlbWVudHMgPSBbe1xuICAgICAgICB0eXBlOiAncGF1c2UnLFxuICAgICAgICB0b3A6IDAsXG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICAgIHJpZ2h0OiBjYW52YXMud2lkdGgsXG4gICAgICAgIGJvdHRvbTogY2FudmFzLmhlaWdodFxuICAgIH1dO1xufVxuXG5mdW5jdGlvbiBjYW52YXNTdGFydFN0YXRlICgpIHtcbiAgICB2aWRlby53aWR0aCA9IGNhbnZhcy53aWR0aCA9IHZpZGVvLm9mZnNldFdpZHRoO1xuICAgIHZpZGVvLmhlaWdodCA9IGNhbnZhcy5oZWlnaHQgPSB2aWRlby5vZmZzZXRIZWlnaHQ7XG4gICAgbGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGRyYXdCYWNrZ3JvdW5kKGN0eCwgY2FudmFzQmdDb2xvcik7XG4gICAgZHJhd0NlbnRlclBsYXlCdXR0b24oY3R4LCBjYW52YXNDb250cm9sc0NvbG9yKTtcbn1cbiIsImZ1bmN0aW9uIGdyYXlBbmRHcmFpbiAoaW1hZ2VEYXRhKSB7XG4gICAgLy8g0L/QvtC70YPRh9Cw0LXQvCDQvtC00L3QvtC80LXRgNC90YvQuSDQvNCw0YHRgdC40LIsINC+0L/QuNGB0YvQstCw0Y7RidC40Lkg0LLRgdC1INC/0LjQutGB0LXQu9C4INC40LfQvtCx0YDQsNC20LXQvdC40Y9cbiAgICBsZXQgcGl4ZWxzID0gaW1hZ2VEYXRhLmRhdGE7XG4gICAgbGV0IHZhbHVlO1xuXG4gICAgLy8g0YbQuNC60LvQuNGH0LXRgdC60Lgg0L/RgNC10L7QsdGA0LDQt9GD0LXQvCDQvNCw0YHRgdC40LIsINC40LfQvNC10L3Rj9GPINC30L3QsNGH0LXQvdC40Y8g0LrRgNCw0YHQvdC+0LPQviwg0LfQtdC70LXQvdC+0LPQviDQuCDRgdC40L3QtdCz0L4g0LrQsNC90LDQu9C+0LJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBpeGVscy5sZW5ndGg7IGkgKz0gNCkge1xuICAgICAgICB2YWx1ZSA9IE1hdGgucmFuZG9tKCkgKyAxO1xuICAgICAgICBsZXQgciA9IHBpeGVsc1tpXTtcbiAgICAgICAgbGV0IGcgPSBwaXhlbHNbaSsxXTtcbiAgICAgICAgbGV0IGIgPSBwaXhlbHNbaSsyXTtcbiAgICAgICAgLy8gQ0lFIGx1bWluYW5jZSBmb3IgdGhlIFJHQlxuICAgICAgICAvLyBUaGUgaHVtYW4gZXllIGlzIGJhZCBhdCBzZWVpbmcgcmVkIGFuZCBibHVlLCBzbyB3ZSBkZS1lbXBoYXNpemUgdGhlbS5cbiAgICAgICAgbGV0IHYgPSAwLjIxMjYqciArIDAuNzE1MipnICsgMC4wNzIyKmI7XG5cbiAgICAgICAgcGl4ZWxzW2ldID0gcGl4ZWxzW2krMV0gPSBwaXhlbHNbaSsyXSA9IHYgKiB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW1hZ2VEYXRhO1xufTtcblxuZnVuY3Rpb24gZHJhd0JhY2tncm91bmQgKGN0eCwgY29sb3IpIHtcbiAgICBjdHguZmlsbFN0eWxlID0gY29sb3I7XG4gICAgY3R4LmZpbGxSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG59XG5cbmZ1bmN0aW9uIGRyYXdDZW50ZXJQbGF5QnV0dG9uIChjdHgsIGNvbG9yKSB7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGAke2NvbG9yfWA7XG4gICAgbGV0IHRyaWFuZ2xlID0ge1xuICAgICAgICB3aWR0aDogMzUsXG4gICAgICAgIGhlaWdodDogNTBcbiAgICB9O1xuXG4gICAgdHJpYW5nbGUucG9pbnRzID0ge1xuICAgICAgICB0b3A6IHtcbiAgICAgICAgICAgIHg6IChjYW52YXMud2lkdGggLSB0cmlhbmdsZS53aWR0aCkgLyAyLFxuICAgICAgICAgICAgeTogKGNhbnZhcy5oZWlnaHQgLSB0cmlhbmdsZS5oZWlnaHQpIC8gMlxuICAgICAgICB9LFxuICAgICAgICBib3R0b206IHtcbiAgICAgICAgICAgIHg6IChjYW52YXMud2lkdGggLSB0cmlhbmdsZS53aWR0aCkgLyAyLFxuICAgICAgICAgICAgeTogKGNhbnZhcy5oZWlnaHQgKyB0cmlhbmdsZS5oZWlnaHQpIC8gMlxuICAgICAgICB9LFxuICAgICAgICByaWdodDoge1xuICAgICAgICAgICAgeDogKGNhbnZhcy53aWR0aCArIHRyaWFuZ2xlLndpZHRoKSAvIDIsXG4gICAgICAgICAgICB5OiBjYW52YXMuaGVpZ2h0IC8gMlxuICAgICAgICB9LFxuICAgIH07XG5cbiAgICBjb250cm9sRWxlbWVudHMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdzdGFydCcsXG4gICAgICAgIHRvcDogdHJpYW5nbGUucG9pbnRzLnRvcC55LFxuICAgICAgICBsZWZ0OiB0cmlhbmdsZS5wb2ludHMudG9wLngsXG4gICAgICAgIGJvdHRvbTogdHJpYW5nbGUucG9pbnRzLmJvdHRvbS55LFxuICAgICAgICByaWdodDogdHJpYW5nbGUucG9pbnRzLnJpZ2h0LnhcbiAgICB9KTtcblxuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgubW92ZVRvKHRyaWFuZ2xlLnBvaW50cy50b3AueCwgdHJpYW5nbGUucG9pbnRzLnRvcC55KTtcbiAgICBjdHgubGluZVRvKHRyaWFuZ2xlLnBvaW50cy5ib3R0b20ueCwgdHJpYW5nbGUucG9pbnRzLmJvdHRvbS55KTtcbiAgICBjdHgubGluZVRvKHRyaWFuZ2xlLnBvaW50cy5yaWdodC54LCB0cmlhbmdsZS5wb2ludHMucmlnaHQueSk7XG4gICAgY3R4LmZpbGwoKTtcbn1cblxuZnVuY3Rpb24gZHJhd1NrcmF0Y2hlcyAoKSB7XG4gICAgbGV0IHN0cm9rZU9wYWNpdHkgPSBNYXRoLnJhbmRvbSgpICogKDAuOCAtIDAuMik7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gYHJnYmEoMjU1LCAyNTUsIDI1NSwgJHtzdHJva2VPcGFjaXR5fSlgO1xuXG4gICAgbGV0IGFtb3VudE9mU2tyYXRjaGVzID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDEwMCAtIDAgKyAxKSk7XG4gICAgYW1vdW50T2ZTa3JhdGNoZXMgLT0gOTg7XG4gICAgaWYoYW1vdW50T2ZTa3JhdGNoZXMgPiAwKXtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGFtb3VudE9mU2tyYXRjaGVzOyBpKyspe1xuICAgICAgICAgICAgc2tyYXRjaCgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBza3JhdGNoICgpIHtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgbGV0IHN0YXJ0UG9pbnQgPSB7XG4gICAgICAgIHg6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChjYW52YXMud2lkdGggLSAxKSksXG4gICAgICAgIHk6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChjYW52YXMuaGVpZ2h0IC0gMSkpXG4gICAgfTtcblxuICAgIGxldCBlbmRQb2ludCA9IHtcbiAgICAgICAgeDogc3RhcnRQb2ludC54LFxuICAgICAgICB5OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoY2FudmFzLmhlaWdodCAtIHN0YXJ0UG9pbnQueSkpXG4gICAgfTtcblxuICAgIGN0eC5tb3ZlVG8oc3RhcnRQb2ludC54LCBzdGFydFBvaW50LnkpO1xuICAgIGN0eC5saW5lVG8oZW5kUG9pbnQueCwgZW5kUG9pbnQueSk7XG4gICAgY3R4LnN0cm9rZSgpO1xufVxuXG5mdW5jdGlvbiBzdGFydERyYXdMb29wICgpIHtcbiAgICBpZighbG9vcElkICYmICFpc1N1YnRpdGxlU2hvd24pe1xuICAgICAgICBsb29wSWQgPSBzZXRJbnRlcnZhbChkcmF3TG9vcCwgZnBzKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzdWJ0aXRsZXNbc3VidGl0bGVJbmRleF0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHN1YlRpbWVvdXQgPSBzZXRUaW1lb3V0KGhpZGVTdWIsIHN1YnRpdGxlc1tzdWJ0aXRsZUluZGV4XS50aW1lTGVuZ3RoIC8gMik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzdG9wRHJhd0xvb3AgKCkge1xuICAgIGlmKGxvb3BJZCkge1xuICAgICAgICBjbGVhckludGVydmFsKGxvb3BJZCk7XG4gICAgICAgIGxvb3BJZCA9IHVuZGVmaW5lZDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYXdMb29wICgpIHtcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgY3R4LmRyYXdJbWFnZSh2aWRlbywgMCwgMCwgdmlkZW8ud2lkdGgsIHZpZGVvLmhlaWdodCk7XG4gICAgXG4gICAgbGV0IGltYWdlRGF0YSA9IGN0eC5nZXRJbWFnZURhdGEoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICBsZXQgaW1hZ2VEYXRhRmlsdGVyZWQgPSBncmF5QW5kR3JhaW4oaW1hZ2VEYXRhKTtcbiAgICBjdHgucHV0SW1hZ2VEYXRhKGltYWdlRGF0YUZpbHRlcmVkLCAwLCAwKTtcblxuICAgIGRyYXdTa3JhdGNoZXMoKTtcbn1cbiIsImxpbmtzRm9ybS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBfb25JbnB1dENoYW5nZSwgZmFsc2UpO1xuc3VibWl0RWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjaGVja0lucHV0cywgZmFsc2UpO1xuXG5mdW5jdGlvbiBfb25JbnB1dENoYW5nZSAoZSkge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG4gICAgc3dpdGNoICh0cnVlKSB7XG4gICAgY2FzZSBlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2xpbmtzLWZvcm1fX3ZpZGVvJyk6XG4gICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGUudGFyZ2V0LmZpbGVzWzBdKTtcbiAgICAgICAgcmVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZSkgPT4ge1xuICAgICAgICAgICAgY3JlYXRlVmlkZW8ocmVhZGVyLnJlc3VsdCk7XG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICBjYXNlIGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbGlua3MtZm9ybV9fc3ViJyk6XG4gICAgICAgIHJlYWRlci5yZWFkQXNUZXh0KGUudGFyZ2V0LmZpbGVzWzBdKTtcbiAgICAgICAgcmVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZSkgPT4ge1xuICAgICAgICAgICAgc3VidGl0bGVzID0gcGFyc2VTcnQocmVhZGVyLnJlc3VsdCk7XG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICBjYXNlIGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbGlua3MtZm9ybV9fYXVkaW8nKTpcbiAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZS50YXJnZXQuZmlsZXNbMF0pO1xuICAgICAgICByZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChlKSA9PiB7XG4gICAgICAgICAgICBjcmVhdGVBdWRpbyhyZWFkZXIucmVzdWx0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tJbnB1dHMgKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgbGV0IGlucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5saW5rcy1mb3JtX19pbnB1dCcpO1xuICAgIGxldCB2YWxpZGF0aW9uID0gdHJ1ZTtcblxuICAgIGlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgICAgICBpZihpbnB1dC52YWx1ZSA9PT0gJycpe1xuICAgICAgICAgICAgdmFsaWRhdGlvbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpZih2YWxpZGF0aW9uKSB7XG4gICAgICAgIHNob3dQbGF5ZXIoKTtcbiAgICAgICAgaW5pdENhbnZhcygpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlVmlkZW8gKHNyYykge1xuICAgIHZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcbiAgICB2aWRlby5zcmMgPSBzcmM7XG4gICAgdmlkZW8uZGVmYXVsdE11dGVkID0gdHJ1ZTtcbiAgICB2aWRlby5jbGFzc0xpc3QuYWRkKCdwbGF5ZXJfX3ZpZGVvJyk7XG4gICAgdmlkZW8ud2lkdGggPSB2aWRlb1dpZHRoO1xuICAgIHZpZGVvLmhlaWdodCA9IHZpZGVvSGVpZ2h0O1xuICAgIFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oaWRkZW4tZWxlbWVudHMnKS5hcHBlbmRDaGlsZCh2aWRlbyk7XG5cbiAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKCdwbGF5Jywgc3RhcnREcmF3TG9vcCwgZmFsc2UpO1xuXG4gICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcigncGF1c2UnLCBzdG9wRHJhd0xvb3AsIGZhbHNlKTtcblxuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ3RpbWV1cGRhdGUnLCAoZSkgPT4ge1xuICAgICAgICBsZXQgdGltZSA9IChlLnRhcmdldC5jdXJyZW50VGltZSAqIDEwMDApLnRvRml4ZWQoKTtcbiAgICAgICAgaWYgKHR5cGVvZiBzdWJ0aXRsZXNbc3VidGl0bGVJbmRleF0gIT09ICd1bmRlZmluZWQnICYmIHRpbWUgPj0gc3VidGl0bGVzW3N1YnRpdGxlSW5kZXhdLmVuZFRpbWUpIHtcbiAgICAgICAgICAgIGlmICghaXNTdWJ0aXRsZVNob3duKSB7XG4gICAgICAgICAgICAgICAgc2hvd1N1YihzdWJ0aXRsZXNbc3VidGl0bGVJbmRleF0pO1xuICAgICAgICAgICAgICAgIHN0YXJ0U3ViVGltZW91dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsIChlKSA9PiB7XG4gICAgICAgIGF1ZGlvLnBhdXNlKCk7XG4gICAgICAgIHN0b3BEcmF3TG9vcCgpO1xuICAgIH0sIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQXVkaW8gKHNyYykge1xuICAgIGF1ZGlvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXVkaW8nKTtcblx0YXVkaW8uc3JjID0gc3JjO1xuXHRhdWRpby5hdXRvcGxheSA9IGZhbHNlO1xuICAgIGF1ZGlvLmNsYXNzTGlzdC5hZGQoJ3BsYXllcl9fYXVkaW8nKTtcblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oaWRkZW4tZWxlbWVudHMnKS5hcHBlbmRDaGlsZChhdWRpbyk7XG59XG4iLCJmdW5jdGlvbiBwYXJzZVNydCAodGV4dCkge1xuICAgIGxldCB0aW1lQ29uc3QgPSB7XG4gICAgICAgIHNlYzogMTAwMCxcbiAgICAgICAgbWluOiA2MCxcbiAgICAgICAgaHI6IDYwXG4gICAgfTtcbiAgICBsZXQgdGVtcCA9IHRleHQuc3BsaXQoJ1xcblxcbicpO1xuXG4gICAgbGV0IHJlc3VsdCA9IHRlbXAubWFwKChlbCkgPT4ge1xuXG4gICAgICAgIGxldCByZXMgPSB7fTtcbiAgICAgICAgbGV0IHN1YnRpdGxlID0gZWwuc3BsaXQoJ1xcbicpO1xuXG4gICAgICAgIC8vID09PSBHZXQgc3VidGl0bGUncyBudW1iZXIgPT09XG4gICAgICAgIHJlcy5udW1iZXIgPSBwYXJzZUludChzdWJ0aXRsZVswXSk7XG5cbiAgICAgICAgbGV0IHRpbWUgPSBzdWJ0aXRsZVsxXS5zcGxpdCgnIC0tPiAnKTtcblxuICAgICAgICAvLyA9PT0gQ29udmVydCBzdGFydCB0aW1lIHRvIE1TID09PVxuICAgICAgICBsZXQgc3RhcnRUaW1lID0gdGltZVswXS5zcGxpdCgnOicpO1xuICAgICAgICBsZXQgc3RhcnRUaW1lU2VjID0gcGFyc2VJbnQoc3RhcnRUaW1lWzJdLnNwbGl0KCcsJykuam9pbignJykpO1xuICAgICAgICBsZXQgc3RhcnRUaW1lTWluID0gcGFyc2VJbnQoc3RhcnRUaW1lWzFdKSAqIHRpbWVDb25zdC5taW4gKiB0aW1lQ29uc3Quc2VjO1xuICAgICAgICBsZXQgc3RhcnRUaW1lSHIgPSBwYXJzZUludChzdGFydFRpbWVbMF0pICogdGltZUNvbnN0LmhyICogdGltZUNvbnN0Lm1pbiAqIHRpbWVDb25zdC5zZWM7XG4gICAgICAgIHN0YXJ0VGltZSA9IHN0YXJ0VGltZVNlYyArIHN0YXJ0VGltZU1pblx0KyBzdGFydFRpbWVIcjtcbiAgICAgICAgcmVzLnN0YXJ0VGltZSA9IHN0YXJ0VGltZTtcblxuICAgICAgICAvLyA9PT0gQ29udmVydCBlbmQgdGltZSB0byBNUyA9PT1cbiAgICAgICAgbGV0IGVuZFRpbWUgPSB0aW1lWzFdLnNwbGl0KCc6Jyk7XG4gICAgICAgIGxldCBlbmRUaW1lU2VjID0gcGFyc2VJbnQoZW5kVGltZVsyXS5zcGxpdCgnLCcpLmpvaW4oJycpKTtcbiAgICAgICAgbGV0IGVuZFRpbWVNaW4gPSBwYXJzZUludChlbmRUaW1lWzFdKSAqIHRpbWVDb25zdC5taW4gKiB0aW1lQ29uc3Quc2VjO1xuICAgICAgICBsZXQgZW5kVGltZUhyID0gcGFyc2VJbnQoZW5kVGltZVswXSkgKiB0aW1lQ29uc3QuaHIgKiB0aW1lQ29uc3QubWluICogdGltZUNvbnN0LnNlYztcbiAgICAgICAgZW5kVGltZSA9IGVuZFRpbWVTZWMgKyBlbmRUaW1lTWluXHQrIGVuZFRpbWVIcjtcbiAgICAgICAgcmVzLmVuZFRpbWUgPSBlbmRUaW1lO1xuXG4gICAgICAgIHJlcy50aW1lTGVuZ3RoID0gZW5kVGltZSAtIHN0YXJ0VGltZTtcblxuICAgICAgICAvLyA9PT0gSm9pbiBzdWJ0aXRsZSBjb250ZW50ID09PVxuICAgICAgICBzdWJ0aXRsZS5zcGxpY2UoMCwgMik7XG4gICAgICAgIHJlcy5jb250ZW50ID0gc3VidGl0bGU7XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHNob3dTdWIgKHN1Yikge1xuICAgIGlzU3VidGl0bGVTaG93biA9IHRydWU7XG5cbiAgICB2aWRlby5wYXVzZSgpO1xuICAgIGRyYXdTdWIoc3ViKTtcbn1cblxuZnVuY3Rpb24gZHJhd1N1YiAoc3ViKSB7XG4gICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgY3R4LmZpbGxSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XG4gICAgY3R4LmZvbnQgPSBgMS41ZW0gT3JhbmllbmJhdW0sIHNlcmlmYDtcblxuICAgIGxldCB0ZXh0SGVpZ2h0ID0gKHN1Yi5jb250ZW50Lmxlbmd0aCAqIDI0KSArICgoc3ViLmNvbnRlbnQubGVuZ3RoIC0gMSkgKiAxMik7XG4gICAgbGV0IHRvcFBhZGRpbmcgPSAoY2FudmFzLmhlaWdodCAtIHRleHRIZWlnaHQpIC8gMjtcblxuICAgIHN1Yi5jb250ZW50LmZvckVhY2goKGVsLCBpKSA9PiB7XG4gICAgICAgIGxldCB0b3AgPSB0b3BQYWRkaW5nICsgKDI0ICogaSkgKyAoMTIgKiBpKTtcbiAgICAgICAgbGV0IGxlZnQgPSAoY2FudmFzLndpZHRoICogMC4xKTtcbiAgICAgICAgY3R4LmZpbGxUZXh0KGVsLCBsZWZ0LCB0b3ApO1xuICAgIH0pOyBcbn1cblxuZnVuY3Rpb24gaGlkZVN1YiAoKSB7XG4gICAgaWYgKGlzU3VidGl0bGVTaG93bikge1xuICAgICAgICBpc1N1YnRpdGxlU2hvd24gPSBmYWxzZTtcbiAgICAgICAgc3VidGl0bGVJbmRleCsrO1xuICAgICAgICB2aWRlby5wbGF5KCk7XG4gICAgfVxuICAgIGNsZWFyVGltZW91dChzdWJUaW1lb3V0KTtcbiAgICBzdWJUaW1lb3V0ID0gdW5kZWZpbmVkO1xuICAgIGNvbnRyb2xFbGVtZW50cyA9IFtdO1xuICAgIGNyZWF0ZVBhdXNlRWxlbWVudCgpO1xufVxuXG5mdW5jdGlvbiBzdG9wU3ViVGltZW91dCAoKSB7XG4gICAgaWYoc3ViVGltZW91dCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoc3ViVGltZW91dCk7XG4gICAgICAgIHN1YlRpbWVvdXQgPSB1bmRlZmluZWQ7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzdGFydFN1YlRpbWVvdXQgKCkge1xuICAgIHN1YlRpbWVvdXQgPSBzZXRUaW1lb3V0KGhpZGVTdWIsIHN1YnRpdGxlc1tzdWJ0aXRsZUluZGV4XS50aW1lTGVuZ3RoKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
