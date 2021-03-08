const socket = io();
const videoGrid = document.getElementById("video-grid");
const ROOM_ID = document.getElementById("body").dataset.room;

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
      console.log("USER connected:", userID);
      addNewUser(userID, stream);
    });
    myPeer.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (userVideoStream) => {
        addVideoStream(userVideoStream);
      });
    });
  });

myPeer.on("open", (userID) => {
  socket.emit("join-room", ROOM_ID, userID);
});

socket.on("user-disconnected", (userID) => {
  console.log("USER disconnected:", userID);
});

function addVideoStream(stream) {
  const video = document.createElement("video");
  video.muted = true;
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}

function addNewUser(userID, stream) {
  const call = myPeer.call(userID, stream);
  call.on("stream", (userVideoStream) => {
    addVideoStream(userVideoStream);
  });
  // call.on("close")
}
