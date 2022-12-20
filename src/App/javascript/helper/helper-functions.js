export function uploadCheck(file) {
  /*
    Use regular expressions to check file extension.
    Returns -1 if false.
  */
  return file.search(/\.csv/g);
}

export function alertTimeout(id) {
  /*
    After a period hide alert
  */
  return setTimeout(() => {
    document.getElementById(id).style.opacity = 0;
    document.getElementById(id).classList.remove("alert-danger");
    document.getElementById(id).classList.remove("alert-warning");
    document.getElementById(id).classList.remove("alert-success");
  }, 5000);
}
