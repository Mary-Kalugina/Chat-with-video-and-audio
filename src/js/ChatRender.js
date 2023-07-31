export default class ChatRender {
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
    document.querySelector(
      ".timer"
    ).innerText = `${formattedMinutes}:${formattedSeconds}`;
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
    return (
      new Date().getDate() +
      "." +
      month +
      "." +
      new Date().getFullYear() +
      "   " +
      hours +
      ":" +
      minutes
    );
  }
}
