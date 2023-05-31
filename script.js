const videoElement = document.getElementById('video')
const screenContainer = document.getSelection('screenContainer')
const button = document.getElementById('button')
let mediaStream

// Prompt to select media stream, pass to video element, then play 
async function selectMediaStream() {
  try {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia();
    videoElement.srcObject = mediaStream;
    videoElement.onloadedmetadata = () => {
      videoElement.play()
    }
    mediaStream.getVideoTracks()[0].onended = () => {
      // Prompt the user agian when the screen stops sharing
      selectMediaStream()
    }
  } catch (error) {
    // Catch Error Here
    console.log('whoops, error here:', error)
  }
}

function showScreenContainer() {
  // Create a new video element to display the stream in the container
  const screenVideoElement = document.createElement('video');
  screenVideoElement.srcObject = videoElement.srcObject;
  screenVideoElement.autoplay = true;
  screenVideoElement.playsinline = true;
  screenContainer.appendChild(screenVideoElement);
}

button.addEventListener('click', async () => {
  // Disable Button
  button.disabled = true
  // Start Picture in Picture
  try {
    await videoElement.requestPictureInPicture()

     //Reset Button
  button.disabled = false
  } catch (error) {
    // Prompt the user id the request is deined
    selectMediaStream()

    //Reset Button
  button.disabled = false
  }
})

// On Load
selectMediaStream();