// format date as MM/DD/YYYY
const format_date = (date) => {
  console.log(date);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};


module.exports = { format_date };
