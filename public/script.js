const socket = io('/')
const videoGrid = document.getElementById('video-grid')

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
})

let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream =>{
    myVideoStream = stream;
    addVideoStream(myVideo, stream)
   
    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
          addVideoStream(video, userVideoStream)
        })
      })

    socket.on('user-connected', (user_id) => {
        connectToNewUser(user_id, stream);     
    })

   
   
})

peer.on('open', id => {
    socket.emit('Join-room',ROOM_ID, id);    
})


const connectToNewUser = (user_id, stream) => {
    const call = peer.call(user_id, stream)
    const video = document.createElement('video')
    
    call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}

let chatText = $('input')

$('html').keydown((e) => {
    if(e.which == 13 && chatText.val().length !== 0) {
        console.log(chatText.val());
        socket.emit('chatMessages', chatText.val())
        chatText.val('')
    }
})

socket.on('message', (message) => {
    console.log(message);
    $('ul').append(`<li class="message"><b>User</b><br/>${message}</li>`)
    scrollToBottom()
})

const scrollToBottom = () => {
    let chatWindow = $('.main__chat_window')
    chatWindow.scrollTop(d.prop("scrollHeight"))
}

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false
        setUnmuteButton()
    }else{
        setMuteButton()
        myVideoStream.getAudioTracks()[0].enabled = true
    }
}


const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }

const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }

  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  