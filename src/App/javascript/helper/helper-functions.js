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
    document.getElementById(id).classList.remove("alert-success");
    document.getElementById(id).classList.remove("alert-danger");
    document.getElementById(id).classList.remove("alert-warning");
  }, 5000);
}

export function generateRandomLightColours(numberOfColours) {
  function getRandomColor() {
    let letters = "BCDEF".split("");
    let color = "#";
    for (let i = 1; i <= 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  }

  let coloursArray = [];
  for (let j = 0; j < numberOfColours; j++) {
    coloursArray.push(getRandomColor());
  }

  return coloursArray;
}
