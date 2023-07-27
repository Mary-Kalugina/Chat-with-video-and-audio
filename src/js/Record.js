import NotificationGPS from "./NotificationGPS";
import ChatRender from "./ChatRender";
import ModalGPS from "./ModalGPS";

export default class Record {
    constructor() {
        this.recorder = null;
        this.recordingStoppedWithOk = false;
        this.GPS = new NotificationGPS();
        this.chat = new ChatRender();
        this.modal = new ModalGPS();
        this.chunks = [];
        this.stream = null;
    }
//     const videoPlayer = document.querySelector(".video");
// const record = document.querySelector(".record");
// const stop = document.querySelector(".stop");

// record.addEventListener("click", async () => {
//   const stream = await navigator.mediaDevices.getUserMedia({
//     video: true,
//   });

//   // videoPlayer.srcOject = stream;

//   // videoPlayer.addEventListener("canplay", () => {
//   //   videoPlayer.play();
//   // });

//   const this.recorder = new MediaRecorder(stream);
//   const chunks = [];

//   this.recorder.addEventListener("start", () => {
//     console.log("start");
//   });

//   this.recorder.addEventListener("dataavailable", (event) => {
//     chunks.push(event.data);
//   });

//   this.recorder.addEventListener("stop", () => {
//     const blob = new Blob(chunks);

//     videoPlayer.src = URL.createObjectURL(blog);
//   });

//   this.recorder.start();

//   stop.addEventListener("click", () => {
//     this.recorder.stop();
//     stream.getTracks().forEach((track) => track.stop());
//   });
// });

// const audioPlayer = document.querySelector(".audio");

    async startAudio() {
        this.listenBtns();
        this.stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });
        this.recorder = new MediaRecorder( this.stream);
        
        this.recorder.addEventListener("start", () => {
            console.log("start");
        });
        
        this.recorder.addEventListener("dataavailable", (event) => {
            this.chunks.push(event.data);
        });
        
        this.recorder.addEventListener("stop", (btn) => {
            if (btn === "ok") {
                this.getAudioData();
            } else {
                this.chat.normalInput();
            }
            });
        
        this.recorder.start();
    }

    stopAudio() {
        this.recorder.stop();
        this.stream.getTracks().forEach((track) => track.stop());
    }

    getAudioData() {
        const blob = new Blob(this.chunks);
        let data = URL.createObjectURL(blob);
        this.GPS.checkPermission()
        .then((gps) => {
          this.chat.mediaMsg("audio", gps, data);
        })
        .catch(() => {
          this.modal.showModal(data, "audio");
        });
    }

    listenBtns() {
        document.querySelector(".ok").addEventListener("click", () => {
           this.recordingStoppedWithOk = true; 
           this.stopAudio(); 
        } );
        document.querySelector(".cancel").addEventListener("click", () => {
            this.recordingStoppedWithOk = false; 
            this.stopAudio(); 
         } );
    }
}