const getQueryDate7 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate() - 7

  return [year, month, day].map(formatNumber).join('-')
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
  getQueryDate7: getQueryDate7
}
