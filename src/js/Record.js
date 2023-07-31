import NotificationGPS from "./NotificationGPS";
import ChatRender from "./ChatRender";
import ModalGPS from "./ModalGPS";
import ModalMediaPermission from "./ModalMediaPermission";

export default class Record {
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
                audio: true,
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
                video: true,
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
        
        this.recorder.addEventListener("dataavailable", (event) => {
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

        if(this.tag === "video") {
          this.showVideo();   
        };
    }

    stopRecord() {
        this.recorder.stop();
        this.stream.getTracks().forEach((track) => track.stop());
        this.removeTempVideo();
    }

    getRecordData() {
        const blob = new Blob(this.chunks);
        let data = URL.createObjectURL(blob);
        this.GPS.checkPermission()
        .then((gps) => {
          this.chat.mediaMsg(this.tag, gps, data);
        })
        .catch(() => {
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
        videoElement.srcObject  = this.stream;
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