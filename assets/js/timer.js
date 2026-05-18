//test javascript file used in tandem with index-test.html
const seconds = document.getElementById("seconds");
const minutes = document.getElementById("minutes");
let countSec = 0;
let countMins = 0;

setInterval(() => {
  countSec++;
  if (countSec > 59) {
    countSec = 0;
    countMins++;
  }
  seconds.textContent = countSec < 10 ? "0" + countSec : countSec;
  minutes.textContent = countMins < 10 ? "0" + countMins : countMins;
}, 1000);

let count = 0; // just need count

setInterval(() => {
  count++;

  seconds.textContent = String(count % 60).padStart(2, "0");

  minutes.textContent = String(Math.floor(count)).padStart(2, "0");
}, 1000);
