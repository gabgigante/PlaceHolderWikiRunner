const seconds = document.getElementById('seconds');
const minutes = document.getElementById('minutes');
let countSec = 0;
let countMins = 0;

const timer = setInterval(() => {
  countSec++;
  if (countSec > 59) {
    countSec = 0;
    countMins++;
  }
  seconds.textContent = countSec < 10 ? '0' + countSec : countSec;
  minutes.textContent = countMins < 10 ? '0' + countMins : countMins;
}, 1000);
