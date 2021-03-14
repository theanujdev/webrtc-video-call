const socket = io();
const videoGrid = document.getElementById("video-grid");
const ROOM_ID = document.getElementById("body").dataset.room;
const peers = {};

const myPeer = new Peer(undefined, {
  host: "/",
  port: "3001",
});

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(stream);
    socket.on("user-connected", (userID) => {
      addNewUser(userID, stream);
    });
    myPeer.on("call", (call) => {
      call.answer(stream);
      const customVideo = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(userVideoStream, customVideo);
      });
    });
  });

myPeer.on("open", (userID) => {
  socket.emit("join-room", ROOM_ID, userID);
});

socket.on("user-disconnected", (userId) => {
  if (peers[userId]) peers[userId].close();
});

function addVideoStream(stream, video) {
  if (!video) {
    video = document.createElement("video");
  }
  video.muted = true;
  video.srcObject = stream;
  video.autoplay = true;
  // video.addEventListener("loadedmetadata", () => {
  //   video.play();
  // });
  videoGrid.append(video);
}

function addNewUser(userID, stream) {
  const call = myPeer.call(userID, stream);
  const customVideo = document.createElement("video");
  // add custom video element before stream event otherwise it receives two events
  call.on("stream", (userVideoStream) => {
    addVideoStream(userVideoStream, customVideo);
  });
  call.on("close", () => {
    customVideo.remove();
  });

  peers[userID] = call;
}
