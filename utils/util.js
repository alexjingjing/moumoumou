const getQueryDate = (span, date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate() - span

  var newDate = new Date(year, month-1, day);
  const newYear = newDate.getFullYear()
  const newMonth = newDate.getMonth() + 1
  const newDay = newDate.getDate()
  
  return [newYear, newMonth, newDay].map(formatNumber).join('-')
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const isObjectEmpty = obj => {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

module.exports = {
  formatTime: formatTime,
  isObjectEmpty: isObjectEmpty,
  getQueryDate: getQueryDate
}
