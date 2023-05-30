function generateDate(date1, date2) {
  date1 = new Date(date1);
  let timeDifference = date2 - date1;
  let timeDifferenceInSec = timeDifference / 1000;
  if (Math.round(timeDifferenceInSec) < 60) {
    return `${Math.round(timeDifferenceInSec)} seconds ago`;
  }
  let timeDifferenceInMin = timeDifferenceInSec / 60;
  if (Math.round(timeDifferenceInMin) < 60) {
    return `${Math.round(timeDifferenceInMin)} minutes ago`;
  }
  let timeDifferenceInHour = timeDifferenceInMin / 60;
  if (Math.round(timeDifferenceInHour) < 24) {
    return `${Math.round(timeDifferenceInHour)} hours ago`;
  }
  let timeDifferenceInDay = timeDifferenceInHour / 24;
  if (timeDifferenceInDay < 365) {
    // <Month><day> at <hh:min>
    return `${date1.toLocaleString('default', {
      month: 'short',
    })} ${date1.getDate()} at ${('0' + date1.getHours()).slice(-2)}:${('0' + date1.getMinutes()).slice(-2)}`;
  }
  // <Month><day>,<year> at <hh:min>
  return `${date1.toLocaleString('default', {
    month: 'short',
  })} ${date1.getDate()}, ${date1.getFullYear()} at ${('0' + date1.getHours()).slice(-2)}:${(
    '0' + date1.getMinutes()
  ).slice(-2)}`;
}

export default generateDate;
