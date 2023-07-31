import NotificationGPS from "./NotificationGPS";
import ChatRender from "./ChatRender";
import ModalGPS from "./ModalGPS";
import Record from "./Record";

const record = new Record();
const modal = new ModalGPS();
const chat = new ChatRender();
const GPS = new NotificationGPS();

document.querySelector(".input-group").addEventListener("click", (e) => {
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
    GPS.checkPermission()
      .then((gps) => {
        chat.textMsg(gps, msg);
      })
      .catch(() => {
        modal.showModal(msg, "p");
      });
  }
});
