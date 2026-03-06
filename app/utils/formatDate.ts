export const formatDate = (date: any) => {
  const newDate = new Date(date);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formattedDate = `${
    monthNames[newDate.getMonth()]
  } ${newDate.getDate()}, ${newDate.getFullYear()}`;

  return formattedDate;
};
