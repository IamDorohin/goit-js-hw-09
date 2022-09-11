import flatpickr from "flatpickr";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import "flatpickr/dist/flatpickr.min.css";

const refs = {
    startBtn: document.querySelector('[data-start]'),
    input: document.querySelector('input#datetime-picker'),
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
}

refs.startBtn.disabled = true;

let selectedDate = null;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        selectedDate = selectedDates[0].getTime();

        if(selectedDate < options.defaultDate) {
            Notify.warning('Please choose a date in the future');
        } else {
            refs.startBtn.disabled = false;
        }
    },
};

flatpickr(refs.input, options);

const timer = {
    timerId: null,
    
    start() {
        this.timerId = setInterval(() => {
            const currentDate = Date.now();
            const deltaTime = selectedDate - currentDate;

            if (deltaTime <= 0) {
                return;
            };

            const time = convertMs(deltaTime);
            updateClockFace(time);
        }, 1000)
    }
}

refs.startBtn.addEventListener('click', () => {
    timer.start();
});

const addLeadingZero = value => {
    if (value < 10) {
      return String(value).padStart(2, '0');
    }
    return value;
  };

  function updateClockFace(time) {
    refs.days.textContent = addLeadingZero(time.days);
    refs.hours.textContent = addLeadingZero(time.hours);
    refs.minutes.textContent = addLeadingZero(time.minutes);
    refs.seconds.textContent = addLeadingZero(time.seconds);
  };

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
