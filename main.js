/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/ChatRender.js
class ChatRender {
  constructor() {
    this.chat = document.querySelector(".chat");
    this.intervalId = null;
    this.totalTime = 0;
  }
  renderMsg(html) {
    this.chat.insertAdjacentHTML("beforeend", html);
    this.clearInput();
    this.scroll();
  }
  textMsg(gps, message) {
    let msg = `<div class="msg">
    <div class="time">${this.time()}</div>
    <p>${message}</p>
    <div class="gps">${gps}</div>
    </div>`;
    this.renderMsg(msg);
  }
  mediaMsg(tag, gps, data) {
    let msg = `<div class="msg">
    <div class="time">${this.time()}</div>
    <${tag} src="${data}" controls></${tag}>
    <div class="gps">${gps}</div>
    </div>`;
    this.renderMsg(msg);
    this.normalInput();
  }
  normalInput() {
    this.stopTimer();
    document.querySelector(".btns").classList.remove("hidden");
    document.querySelector(".media-btns").classList.add("hidden");
  }
  clearInput() {
    const input = document.querySelector(".chat-input");
    input.value = "";
  }
  scroll() {
    let message = document.querySelector(".chat");
    message.scrollTop = message.scrollHeight;
  }
  addMediaBtns() {
    document.querySelector(".btns").classList.add("hidden");
    document.querySelector(".media-btns").classList.remove("hidden");
  }
  startTimer() {
    if (!this.intervalId) {
      this.intervalId = setInterval(this.updateTimer.bind(this), 1000);
    }
  }
  updateTimer() {
    this.totalTime++;
    const minutes = Math.floor(this.totalTime / 60);
    const seconds = this.totalTime % 60;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    document.querySelector(".timer").innerText = `${formattedMinutes}:${formattedSeconds}`;
  }
  stopTimer() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.totalTime = 0;
    document.querySelector(".timer").textContent = "00:00";
  }
  time() {
    let month = new Date().getMonth();
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    if (month.toString().length === 1) {
      month = "0" + month.toString();
    }
    if (hours.toString().length === 1) {
      hours = "0" + hours.toString();
    }
    if (minutes.toString().length === 1) {
      minutes = "0" + minutes.toString();
    }
    return new Date().getDate() + "." + month + "." + new Date().getFullYear() + "   " + hours + ":" + minutes;
  }
}
;// CONCATENATED MODULE: ./src/js/ModalGPS.js

class ModalGPS {
  constructor() {
    this.html = `<div class="modal">
    <div>
      <p>Что-то пошло не так.</p>
      <p>К сожалению, нам не удалось определить ваше местоположение, пожалуйста, дайтеразрешение на использование геолокации, либо введите координаты вручную.</p>
      <p>Широта и долгота через запятую</p>
      <input class="modal-input">
      <button type="button" class="modal-btn modal-cancel">Cancel</button>
      <button type="button" class="modal-btn modal-ok">Ok</button>
    </div>
  </div>`;
    this.msg = null;
    this.msgType = null;
    this.chat = new ChatRender();
  }
  showModal(msg, type) {
    if (document.querySelector(".modal")) {
      return;
    }
    this.msg = msg;
    this.msgType = type;
    document.body.insertAdjacentHTML("afterbegin", this.html);
    this.listeners();
  }
  listeners() {
    document.querySelector(".modal-cancel").addEventListener("click", this.closeModal.bind(this));
    document.querySelector(".modal-ok").addEventListener("click", this.checkValue.bind(this));
  }
  saveGPS(gps) {
    if (this.msgType === "p") {
      this.chat.textMsg(gps, this.msg);
    } else {
      this.chat.mediaMsg(this.msgType, gps, this.msg);
    }
    this.closeModal();
  }
  checkValue() {
    const input = document.querySelector(".modal").querySelector(".modal-input");
    const regex = /^\[?-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\]?$/;
    if (!input.value || !regex.test(input.value)) {
      input.style.border = "2px solid red";
      return;
    }
    if (!input.value.startsWith("[")) {
      input.value = "[" + input.value;
    }
    if (!input.value.endsWith("]")) {
      input.value = input.value + "]";
    }
    this.saveGPS(input.value);
  }
  closeModal() {
    document.querySelector(".modal").remove();
  }
}
;// CONCATENATED MODULE: ./src/js/NotificationGPS.js

class NotificationGPS {
  constructor() {
    this.modal = new ModalGPS();
  }
  checkPermission() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (data) {
          const {
            latitude,
            longitude
          } = data.coords;
          resolve("[" + latitude + ", " + longitude + "]");
        }, () => {
          reject("Geolocation request failed or was denied.");
        }, {
          enableHighAccuracy: true
        });
      } else {
        reject("Geolocation is not supported in this browser.");
      }
    });
  }
}
;// CONCATENATED MODULE: ./src/js/ModalMediaPermission.js
class ModalMediaPermission {
  constructor() {
    this.html = `<div class="modal">
  <div>
  <p>Give permission in your brouser for audio/video recording, please.</p>
  <button type="button" class="modal-btn modal-cancel">Cancel</button>
  </div>
  </div>`;
  }
  showModal() {
    if (document.querySelector(".modal")) {
      return;
    }
    document.body.insertAdjacentHTML("afterbegin", this.html);
    this.listeners();
  }
  listeners() {
    document.querySelector(".modal-cancel").addEventListener("click", this.closeModal);
  }
  closeModal() {
    document.querySelector(".modal").remove();
  }
}
;// CONCATENATED MODULE: ./src/js/Record.js




class Record {
  constructor() {
    this.recorder = null;
    this.recordingStoppedWithOk = false;
    this.GPS = new NotificationGPS();
    this.chat = new ChatRender();
    this.modal = new ModalGPS();
    this.mediamodal = new ModalMediaPermission();
    this.chunks = [];
    this.stream = null;
    this.tag = null;
  }
  async startAudioRecord() {
    try {
      this.tag = "audio";
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      this.startRecord();
    } catch {
      this.mediamodal.showModal();
    }
  }
  async startVideoRecord() {
    try {
      this.tag = "video";
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });
      this.startRecord();
    } catch {
      this.mediamodal.showModal();
    }
  }
  startRecord() {
    this.recorder = new MediaRecorder(this.stream);
    this.listenBtns();
    this.recorder.addEventListener("start", () => {
      console.log("start");
    });
    this.recorder.addEventListener("dataavailable", event => {
      this.chunks.push(event.data);
    });
    this.recorder.addEventListener("stop", () => {
      if (this.recordingStoppedWithOk) {
        this.getRecordData();
      } else {
        this.chat.normalInput();
      }
    });
    this.recorder.start();
    this.chat.addMediaBtns();
    this.chat.startTimer();
    if (this.tag === "video") {
      this.showVideo();
    }
    ;
  }
  stopRecord() {
    this.recorder.stop();
    this.stream.getTracks().forEach(track => track.stop());
    this.removeTempVideo();
  }
  getRecordData() {
    const blob = new Blob(this.chunks);
    let data = URL.createObjectURL(blob);
    this.GPS.checkPermission().then(gps => {
      this.chat.mediaMsg(this.tag, gps, data);
    }).catch(() => {
      this.modal.showModal(data, this.tag);
    });
  }
  listenBtns() {
    document.querySelector(".ok").addEventListener("click", () => {
      this.recordingStoppedWithOk = true;
      this.stopRecord();
    });
    document.querySelector(".cancel").addEventListener("click", () => {
      this.recordingStoppedWithOk = false;
      this.stopRecord();
    });
  }
  showVideo() {
    const videoElement = document.createElement("video");
    videoElement.srcObject = this.stream;
    videoElement.classList = "temp";
    videoElement.addEventListener("canplay", () => {
      videoElement.play();
    });
    const chatElement = document.querySelector(".chat");
    chatElement.appendChild(videoElement);
  }
  removeTempVideo() {
    if (document.querySelector(".temp")) {
      document.querySelector(".temp").remove();
    }
  }
}
;// CONCATENATED MODULE: ./src/js/app.js




const record = new Record();
const modal = new ModalGPS();
const chat = new ChatRender();
const GPS = new NotificationGPS();
document.querySelector(".input-group").addEventListener("click", e => {
  let audio = document.querySelector(".audio");
  let video = document.querySelector(".video");
  if (e.target === video) {
    record.startVideoRecord();
  } else if (e.target === audio) {
    record.startAudioRecord();
  }
});
const input = document.querySelector(".chat-input");
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    let msg = input.value;
    GPS.checkPermission().then(gps => {
      chat.textMsg(gps, msg);
    }).catch(() => {
      modal.showModal(msg, "p");
    });
  }
});
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;