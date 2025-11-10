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