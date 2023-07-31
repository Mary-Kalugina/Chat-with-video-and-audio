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
    this.msgType = type;
    document.body.insertAdjacentHTML("afterbegin", this.html);
    this.listeners();
  }

  listeners() {
    document
      .querySelector(".modal-cancel")
      .addEventListener("click", this.closeModal.bind(this));
    document
      .querySelector(".modal-ok")
      .addEventListener("click", this.checkValue.bind(this));
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
    const input = document
      .querySelector(".modal")
      .querySelector(".modal-input");
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
