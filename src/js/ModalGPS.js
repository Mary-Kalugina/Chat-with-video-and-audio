import ChatRender from "./ChatRender";

export default class ModalGPS {
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
    this.type = type;
    document.body.insertAdjacentHTML("afterbegin", this.html);
    this.listeners();
  }

  listeners() {
    document
      .querySelector(".modal-cancel")
      .addEventListener("click", this.closeModal.bind(this));
    document
      .querySelector(".modal-ok")
      .addEventListener("click", this.saveGPS.bind(this));
  }

  saveGPS() {
    let input = document.querySelector(".modal").querySelector(".modal-input");
    if (!input.value) {
      return;
    }
    const regex = /^\[?-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\]?$/;

    if (regex.test(input.value)) {
      if (this.type === "p") {
        this.chat.textMsg(input.value, this.msg);
      } else if (this.type === "audio") {
        this.chat.mediaMsg("audio", input.value, this.msg);
      }
      //video
      this.closeModal();
    } else {
      input.style.border = "2px red solid";
    }
  }

  closeModal() {
    document.querySelector(".modal").remove();
  }
}
