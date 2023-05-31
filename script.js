const videoElement = document.getElementById('video');
const screenContainer = document.getSelection('screenContainer');
const button = document.getElementById('button');
let mediaStream;

// Prompt to select media stream, pass to video element, then play 
async function selectMediaStream() {
  try {
    mediaStream = await navigator.mediaDevices.getDisplayMedia();
    videoElement.srcObject = mediaStream;
    videoElement.onloadedmetadata = () => {
      videoElement.play();
    };
    mediaStream.getVideoTracks()[0].onended = () => {
      // Reset the mediaStream object when screen sharing stops
      mediaStream = null;
      // Prompt the user to share screen again when the screen stops sharing
      button.disabled = false;
    };
  } catch (error) {
    // Catch Error Here
    console.log('whoops, error here:', error);
    mediaStream = null; // Reset the mediaStream object
    button.disabled = false; // Enable the start button to show the prompt again
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
  button.disabled = true;

  // Start Picture in Picture
  try {
    if (mediaStream && mediaStream.active) {
      await videoElement.requestPictureInPicture();
    } else {
      await selectMediaStream();
      await videoElement.requestPictureInPicture();
    }
  } catch (error) {
    // Catch Error Here
    console.log('whoops, error here:', error);
    button.disabled = false; // Enable the start button to show the prompt again
  }
});

// On Load
selectMediaStream();
