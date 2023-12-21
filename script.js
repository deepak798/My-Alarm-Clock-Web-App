// Updated variable names
let clockDisplay = document.querySelector(".clock-display");
const hourField = document.getElementById("hourField");
const minuteField = document.getElementById("minuteField");
const secondField = document.getElementById("secondField");
const alarmList = document.querySelector(".alarmList");
const addAlarmButton = document.getElementById("addAlarmButton");
let alarmData = [];
let alarmAudio = new Audio("./assets/alarm.mp3");
let defaultHour = 0,
  defaultMinute = 0,
  defaultSeconds = 0,
  alarmCounter = 0;

// Append zeroes for single digit
const formatWithZero = (value) => (value < 10 ? "0" + value : value);

// Search for value in object
const findAlarmObject = (parameter, value) => {
  let alarmObject,
    objIndex,
    exists = false;
  alarmData.forEach((alarm, index) => {
    if (alarm[parameter] == value) {
      exists = true;
      alarmObject = alarm;
      objIndex = index;
      return false;
    }
  });
  return [exists, alarmObject, objIndex];
};

// Display Time
function updateClockDisplay() {
  let date = new Date();
  let [hours, minutes, seconds] = [
    formatWithZero(date.getHours()),
    formatWithZero(date.getMinutes()),
    formatWithZero(date.getSeconds()),
  ];

  // Display time
  clockDisplay.innerHTML = `${hours}:${minutes}:${seconds}`;

  // Alarm
  alarmData.forEach((alarm, index) => {
    if (alarm.isActive) {
      if (`${alarm.alarmHour}:${alarm.alarmMinute}:${alarm.alarmSecond}` === `${hours}:${minutes}:${seconds}`) {
        alarmAudio.play();
        alarmAudio.loop = true;
      }
    }
  });
}

const sanitizeInputValue = (inputValue) => {
  inputValue = parseInt(inputValue);
  if (inputValue < 10) {
    inputValue = formatWithZero(inputValue);
  }
  return inputValue;
};

hourField.addEventListener("input", () => {
  hourField.value = sanitizeInputValue(hourField.value);
});

minuteField.addEventListener("input", () => {
  minuteField.value = sanitizeInputValue(minuteField.value);
});

secondField.addEventListener("input", () => {
  secondField.value = sanitizeInputValue(secondField.value);
});

// Create alarm div
const addAlarmToUI = (alarmObj) => {
  // Keys from object
  const { id, alarmHour, alarmMinute,alarmSecond } = alarmObj;
  // Alarm div
  let alarmDiv = document.createElement("div");
  alarmDiv.classList.add("alarm");
  alarmDiv.setAttribute("data-id", id);
  alarmDiv.innerHTML = `<span>${alarmHour}: ${alarmMinute}: ${alarmSecond}</span>`;

  // Checkbox
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.addEventListener("click", (e) => {
    if (e.target.checked) {
      activateAlarm(e);
    } else {
      deactivateAlarm(e);
    }
  });
  alarmDiv.appendChild(checkbox);

  // Delete button
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", (e) => removeAlarmFromUI(e));
  alarmDiv.appendChild(deleteButton);

  alarmList.appendChild(alarmDiv);
};

// Set Alarm
addAlarmButton.addEventListener("click", () => {
  alarmCounter += 1;

  // Alarm object
  let alarmObj = {};
  alarmObj.id = `${alarmCounter}_${hourField.value}_${minuteField.value}_${secondField.value}`;
  alarmObj.alarmHour = hourField.value;
  alarmObj.alarmMinute = minuteField.value;
  alarmObj.alarmSecond= secondField.value;
  alarmObj.isActive = false;

  alarmData.push(alarmObj);
  addAlarmToUI(alarmObj);
  hourField.value = formatWithZero(defaultHour);
  minuteField.value = formatWithZero(defaultMinute);
  secondField.value = formatWithZero(defaultSeconds);
});

// Start Alarm
const activateAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = findAlarmObject("id", searchId);
  if (exists) {
    alarmData[index].isActive = true;
  }
};

// Stop alarm
const deactivateAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = findAlarmObject("id", searchId);
  if (exists) {
    alarmData[index].isActive = false;
    alarmAudio.pause();
  }
};

// Delete alarm
const removeAlarmFromUI = (e) => {
  let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
  let [exists, obj, index] = findAlarmObject("id", searchId);
  if (exists) {
    e.target.parentElement.parentElement.remove();
    alarmData.splice(index, 1);
  }
};

window.onload = () => {
  setInterval(updateClockDisplay);
  defaultHour = 0;
  defaultMinute = 0;
  defaultSeconds = 0;
  alarmCounter = 0;
  alarmData = [];
  hourField.value = formatWithZero(defaultHour);
  minuteField.value = formatWithZero(defaultMinute);
  secondField.value = formatWithZero(defaultSeconds);
};
