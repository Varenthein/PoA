export function pad(number) {
  if(number < 10) return '0'+number
  else return number
}
export function getCurrentDate() {
  let currentDate = new Date()
  let day = pad(currentDate.getDate())
  let month =  pad(currentDate.getMonth() + 1)
  let year = currentDate.getFullYear()
  let hour = pad(currentDate.getHours())
  let minute = pad(currentDate.getMinutes())
  return `${year}-${month}-${day} ${hour}:${minute}:00`
}
