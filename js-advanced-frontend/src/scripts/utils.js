export async function sortAccounts(arr, prop) {
  let copyArr = [...arr];
  return copyArr.sort(function(a,b) {
    if(a[prop] < b[prop]) return -1;
  })
}

export function monthDiff(dateFrom, dateTo) {
 return dateTo.getMonth() - dateFrom.getMonth() + 
   (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
}

export function formatDate(dateString) {
  const date = new Date(dateString);

  return (
    `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}.` +
    `${(date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)}` +
    `.${date.getFullYear()}`
  )
}