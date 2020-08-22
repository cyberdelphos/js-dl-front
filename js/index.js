const loginBtn = document.getElementById('login-button');
const downloadBtn = document.getElementById('download-button');
const dataBtn = document.getElementById('data-button');
const logoutBtn = document.getElementById('logout-button');
const autoDownloadBtn = document.getElementById('autodownload-button');
let usrToken = '';

loginBtn.addEventListener('click', mfa);
downloadBtn.addEventListener('click', download);
autoDownloadBtn.addEventListener('click', autoDownload);
logoutBtn.addEventListener('click', logout);
dataBtn.addEventListener('click', data);

function mfa() {
  console.log('authenticate');

  fetch('http://localhost:3000/authenticate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "username": 'usuario',
      "password": 'password'
    })
  }).then(response=> response.json()).then(response => {
    console.log(response);
    updateToken(response.token);
    resetError();
  }).catch(errorHandler);
}

function updateToken(token) {
  usrToken = token;
  document.getElementById('token-container').textContent = token ? `Token: ${token}` : 'No token';
}

function download() {
  console.log('download');
  downloadFunction(genLink);
}

function autoDownload() {
  console.log('auto - download');
  downloadFunction(intentDownloadLink);
}

function downloadFunction(callback) {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${usrToken}`);
  fetch('http://localhost:3000/downloads/wsu-js-cheat-sheet.pdf', { headers })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la petición')
      }
      return response.blob();
    })
    .then(blobby => {
      const windowUrl = window.URL || window.webkitURL;
      const objectUrl = windowUrl.createObjectURL(blobby);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.textContent = 'Descarga lista';
      anchor.download = 'file.pdf';
      resetError();
      callback(anchor,windowUrl,objectUrl);
    })
    .catch(errorHandler);
}

function genLink(anchor, windowUrl, objectUrl) {
  document.getElementById('response-container').appendChild(anchor);
  anchor.addEventListener('click', () => {
    setTimeout(() => {
      document.getElementById('response-container').removeChild(anchor);
      windowUrl.revokeObjectURL(objectUrl);
    }, 0);
  });
}

function intentDownloadLink(anchor, windowUrl, objectUrl) {
  anchor.click();
  windowUrl.revokeObjectURL(objectUrl);
}

function data() {
  fetch('http://localhost:3000/data', {
    headers: {
      'Authorization': `Bearer ${usrToken}`
    }
  }).then(response => response.text()).then(response => {
    console.log(response);
    document.getElementById('response-container').innerHTML = response;
    resetError();
  }).catch(errorHandler);
}

function logout() {
  updateToken();
  resetError();
  document.getElementById('response-container').textContent = null;
}

function resetError() {
  const errCont = document.getElementById('error-container');
  errCont.innerHTML = null;
}

function errorHandler(error) {
  console.log(typeof error);
  const errCont = document.getElementById('error-container');
  errCont.textContent = error;
}
