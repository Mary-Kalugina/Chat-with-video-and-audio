export default class ModalMediaPermission {
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
    document
      .querySelector(".modal-cancel")
      .addEventListener("click", this.closeModal);
  }

  closeModal() {
    document.querySelector(".modal").remove();
  }
}
