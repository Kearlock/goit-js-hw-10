// Описаний в документації
import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

// Initialization of the timer
let endTime = null;
let currentTime = null;
const input = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');

startBtn.disabled = true;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose: selectedDates => closeHandler(selectedDates),
};

// Function to initialize the flatpickr instance
const flatpickrInstance = flatpickr('#datetime-picker', options);

// Function to convert milliseconds to days, hours, minutes, and seconds
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

// Function to start the timer and update the display every second
const timer = endTime => {
  const timerId = setInterval(() => {
    const currentTime = new Date();
    const deltaTime = endTime - currentTime;
    if (deltaTime <= 0) {
      clearInterval(timerId);
      startBtn.disabled = true;
      input.disabled = false;
      return;
    }
    const time = convertMs(deltaTime);
    updateTime(time);
  }, 1000);
};

// Function to update the timer display
function updateTime({ days, hours, minutes, seconds }) {
  const refs = {
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
  };

  const formatted = {
    days: addZero(days),
    hours: addZero(hours),
    minutes: addZero(minutes),
    seconds: addZero(seconds),
  };

  for (const key in refs) {
    if (refs[key].textContent !== formatted[key]) {
      refs[key].textContent = formatted[key];
    }
  }
}

// Function to add leading zero to numbers less than 10
function addZero(value) {
  return String(value).padStart(2, '0');
}

// Function to handle the opening of the date picker
function closeHandler(selectedDates) {
  const selectedDate = selectedDates[0];
  const currentDate = new Date();
  if (selectedDate < currentDate) {
    iziToast.show({
      message: 'Please choose a date in the future',
      messageColor: '#2e2f42',
      backgroundColor: '#e74c3c',
      position: 'topCenter',
      transitionIn: 'bounceInDown',
      transitionOut: 'bounceOutUp',
      timeout: 1500,
    });
    startBtn.disabled = true;
    return;
  }
  startBtn.disabled = false;
  startBtn.addEventListener('click', () => {
    timer(selectedDate);
    startBtn.disabled = true;
    input.disabled = true;
  });
}
