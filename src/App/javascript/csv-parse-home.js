import { uploadCheck, alertTimeout } from "./helper/helper-functions.js";

// BIG REFACTOR
// This should only contain the csv parse function
// extract the queryselectors to their own files
let alertSetTimeoutId = undefined;
document
  .querySelector("#Total-installs-button")
  .addEventListener("click", () => {
    document.getElementById("install-csv-upload").click();
  });

/*
  Event listener for the Total installs container, i.e the big pulsing circle for uploading
*/
document.querySelector("#install-csv-upload").addEventListener("change", () => {
  const csv = document.getElementById("install-csv-upload");
  const file = csv.files[0].name;
  const alert = document.getElementById("alert");

  clearTimeout(alertSetTimeoutId);
  if (uploadCheck(file) === -1) {
    // Show alert
    alert.style.opacity = 1;
    alert.innerText = `${file} is not a csv file.`;
    alert.classList.add("alert-danger");
    alertSetTimeoutId = alertTimeout("alert");
  } else {
    document
      .getElementById("Total-installs-container")
      .style.setProperty("visibility", "hidden", "important");
    document
      .getElementById("calculated-total-container")
      .style.setProperty("display", "block", "important");

    // Show alert
    alert.style.opacity = 1;
    alert.innerText = `${file} uploaded!`;
    alert.classList.add("alert-success");
    sessionStorage.setItem("current-csv-name", file);
    alertSetTimeoutId = alertTimeout("alert");
    // So parse is either successful or fails based on format of csv
    // If it passes, hide the blinking circle and do animation and present number of installs
    csvParseTotalInstalls(csv);
    document.getElementById("install-csv-upload").value = "";
  }
});

function csvParseTotalInstalls(csvFile) {
  let total = 0;
  function calculateTotal(str, total) {
    /*
        Takes in the string given by the reader, creates an array (lines)
        split by new lines. Then it iterates through the array and removes
        the date range to isolate the number value.
        Returns the total number of installations.
      */

    if (str.split(",")[0] !== "Totals") {
      console.log(str.split(",")[0]);
      return false;
    }

    let lines = str.split("\n");
    for (let i = 0; i < lines.length; i++) {
      lines[i] = lines[i].replace(/.*,/g, "");
      if (/^\d+/.test(lines[i])) {
        total += Number(lines[i]);
      }
    }
    return total;
  }

  const file = csvFile.files[0];
  const reader = new FileReader();

  reader.addEventListener(
    "load",
    () => {
      /*
        Once the reader loads a file successfully we then parse
      */
      if (calculateTotal(reader.result, total) === false) {
        document
          .getElementById("Total-installs-container")
          .style.setProperty("visibility", "visible", "important");
        document
          .getElementById("calculated-total-container")
          .style.setProperty("display", "none", "important");
        const alert = document.getElementById("alert");
        alert.style.opacity = 1;
        alert.classList.add("alert-danger");
        alert.innerText = `The choosen file is not in the format of an installations csv file. Please select the correct file`;
        alertSetTimeoutId = alertTimeout("alert");
        return;
      }
      const total_downloads = calculateTotal(reader.result, total);
      /*
        Create the downloads text area div.
        If first time uploading.
      */

      if (document.getElementById("Total-installs-total-div") === null) {
        const total_div = document.createElement("div");
        total_div.innerText = total_downloads + " downloads";
        total_div.id = "Total-installs-total-div";
        total_div.style.fontSize = "2rem";
        const home_container = document.getElementById(
          "calculated-total-container"
        );
        home_container.appendChild(total_div);
      } else {
        document.getElementById("Total-installs-total-div").innerText =
          total_downloads + " downloads";
      }

      document
        .getElementById("clear-data-button")
        .style.setProperty("display", "block", "important");

      // Do animation with lines
      const lines = document.getElementsByClassName("line");
      for (let i = 0; i < lines.length; i++) {
        lines[i].classList.add("visible");
        lines[i].classList.add("lineAnimation" + String(Number(i) + 1));
      }
    },
    false
  );

  if (file) {
    reader.readAsText(file);
  }
}

document.getElementById("clear-data-button").addEventListener("click", () => {
  document
    .getElementById("Total-installs-container")
    .style.setProperty("visibility", "visible", "important");
  document
    .getElementById("calculated-total-container")
    .style.setProperty("display", "none", "important");
});
