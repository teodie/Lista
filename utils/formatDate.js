export const formatDate_MM_DD_YYYY = (date) => {
  const dateInstance = new Date(date);
  const options = { day: "numeric", month: "numeric", year: 'numeric'}

  const formatedDate = dateInstance.toLocaleDateString("en-US", options);
  return formatedDate.replaceAll('/', "-")
}

export const formatDate_MM_DD = (date) => {
  const dateInstance = new Date(date);
  const options = { day: "2-digit", month: "short" }

  return dateInstance.toLocaleDateString("en-US", options);
}

export const formateDate_LongMM_DD_YYYY = (date) => {
  const dateInstance = new Date(date)

  const options = { month: 'long', day: 'numeric', year: 'numeric' }

  return dateInstance.toLocaleDateString('en-US', options)
}

export const formatTime_12HRS = (datetime) => {
  const datetimeInstance = new Date(datetime)
  const options = { hour12: true }

  return datetimeInstance.toLocaleTimeString('en-US', options)
}