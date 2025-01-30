const months: Record<number, string> = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December",
};

export function formatDate(date: Date): string {
  const newDate = new Date(date);
  const day = newDate.getDate();
  const month = newDate.getMonth();
  const year = newDate.getFullYear();
  const hours = String(newDate.getHours()).padStart(2, "0");
  const minutes = String(newDate.getMinutes()).padStart(2, "0");

  const formattedDate = `${day} ${months[month]} ${year} at ${hours} : ${minutes}`;
  // const timeElapsed = Math.floor((Date.now() - newDate.getTime()) / 3600000);
  // if (timeElapsed > 1 && timeElapsed < 24) {
  //   return `${timeElapsed} hours`;
  // }
  // if (timeElapsed < 1) {
  //   return `just now`;
  // }
  // if (timeElapsed >= 24 && timeElapsed < 48) {
  //   const timeElapsedInDays = Math.floor(timeElapsed / 24);
  //   return `${timeElapsedInDays} day`;
  // }
  const timeElapsed = Math.floor((Date.now() - newDate.getTime()) / 60000); // minutes
  if (timeElapsed >= 60 && timeElapsed < 1440) {
    const timeElapsedInhours = Math.floor(timeElapsed / 60);
    return `${timeElapsedInhours} ${timeElapsedInhours > 1 ? "hours" : "hour"}`;
  }
  if (timeElapsed >= 1 && timeElapsed < 60) {
    return `${timeElapsed} ${timeElapsed > 1 ? "minutes" : "minutes"}`;
  }
  if (timeElapsed < 1) {
    return `just now`;
  }
  if (timeElapsed >= 1440 && timeElapsed < 2880) {
    const timeElapsedInDays = Math.floor(timeElapsed / 1440);
    return `${timeElapsedInDays} ${timeElapsedInDays > 1 ? "days" : "day"}`;
  }
  return formattedDate;
}
