const myVideo = document.getElementById("myVideo");
console.log(myVideo);
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);
  });

function addVideoStream(video, stream) {
  video.muted = true;
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
}
