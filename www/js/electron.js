const { webFrame } = require('electron'); 

const electronApp = document.getElementById('electron-app');
const zoomLevelSpan = document.getElementById('current-value');
const defaultZoomLevel = 0.69;

const getFactorInPercent = (value) => `${parseInt(value) * 100} %`;

document.getElementById('zoom').addEventListener('input', () => {
    let value = this.value;

    webFrame.setZoomFactor(parseInt(value));
    zoomLevelSpan.innerHTML = getFactorInPercent(value);
}, false);

document.addEventListener('DOMContentLoaded', () => {
    electronApp.style.display = 'block';
    webFrame.setZoomFactor(defaultZoomLevel);
    zoomLevelSpan.innerHTML = getFactorInPercent(webFrame.getZoomFactor());
}, false);
