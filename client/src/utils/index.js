export const daysLeft = (deadline) => {
  const difference = new Date(deadline).getTime() - Date.now();
  const remainingDays = difference / (1000 * 3600 * 24);

  return remainingDays.toFixed(0);
};

export const calculateBarPercentage = (goal, raisedAmount) => {
  const percentage = Math.round((raisedAmount * 100) / goal);

  return percentage;
};

export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};

export const calculateTimeLeft = (startDate, deadline) => {
  const now = new Date().getTime();
  const endTime = new Date(deadline).getTime();
  const startTime = new Date(startDate).getTime();

  if (now <= startTime) {
    return 0; // If the current time is before or at the start time, return 0%
  } else if (now >= endTime) {
    return 100; // If the current time is at or past the end time, return 100%
  } else {
    const totalTime = endTime - startTime;
    const elapsedTime = now - startTime;
    const percentage = (elapsedTime / totalTime) * 100;
    return percentage.toFixed(2); // Return the percentage with two decimal places
  }
}