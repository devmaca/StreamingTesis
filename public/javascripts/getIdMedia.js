
var loggerVid = document.getElementById("areaVid");

function logVid(message) {
  loggerVid.innerHTML = loggerVid.innerHTML + message + "<br/>";
}

var loggerAud = document.getElementById("areaAud");
function logAud(message) {
  loggerAud.innerHTML = loggerAud.innerHTML + message + "<br/>";
}

function setInputMic(number, deviceId) {
  switch (number) {
    case 1:
      if (document.getElementById("aud1").value.length > 0) return;
      document.getElementById("aud1").value = `${deviceId}`;
      break;
    case 2:
      if (document.getElementById("aud2").value.length > 0) return;
      document.getElementById("aud2").value = `${deviceId}`;
      break;

    default:
      break;
  }
}
function setInputCam(number, deviceId) {
  switch (number) {
    case 1:
      if (document.getElementById("vid1").value.length > 0) return;
      document.getElementById("vid1").value = `${deviceId}`;
      break;
    case 2:
      if (document.getElementById("vid2").value.length > 0) return;
      document.getElementById("vid2").value = `${deviceId}`;
      break;
    default:
      break;
  }
}

async function getIdMediaDevices() {
  try {
    navigator.mediaDevices;
    navigator.mediaDevices.enumerateDevices;
  } catch (error) {
    console.log(error);
  }
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log("enumerateDevices() not supported.");
  } else {
    navigator.mediaDevices
      .enumerateDevices()
      .then(function (devices) {
        let numberCam = 0;
        let numberMic = 0;
        devices.forEach(function (device) {
          if (device.deviceId.length > 16) {
            if (device.kind == "audioinput") {
              numberMic++;
              setInputMic(numberMic, device.deviceId);
              logAud(
                `Nro. ${numberMic} =>` +
                  device.kind +
                  ": " +
                  device.label +
                  " id = " +
                  device.deviceId
              );
            }
            if (device.kind == "videoinput") {
              numberCam++;
              setInputCam(numberCam, device.deviceId);
              logVid(
                `Nro. ${numberCam} =>` +
                  device.kind +
                  ": " +
                  device.label +
                  " id = " +
                  device.deviceId
              );
            }
          }
          //mostrando cada video
        });
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message);
      });
  }
}
getIdMediaDevices();
async function getMediaDevice() {
  await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  getIdMediaDevices();
}
