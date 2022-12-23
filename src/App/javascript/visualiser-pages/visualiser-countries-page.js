import { generateRandomLightColours } from "../helper/helper-functions.js";

let alertSetTimeoutId = undefined;

function csvParseTotalCountries(csvFile) {
  function calculateTotal(string) {
    /*finds all countries and puts them into an array*/
    let countriesArray = string.split("\n")[1].split(",");
    // Removes first element from array
    countriesArray.shift();

    let installationsPerCountry = [];
    /*subtract one at the end as the last line of all csv files are empty line*/
    let lengthOfCsvFile = string.split("\n").length - 1;

    let numberOfCountries = countriesArray.length;
    for (let i = 0; i < numberOfCountries; i++) {
      /*inserts each country into the array and creates a counter for the country starting at 0*/

      let n = 0;
      /* index starts at 2 as we dont need first two rows.*/
      for (let j = 2; j < lengthOfCsvFile; j++) {
        n += parseInt(string.split("\n")[j].split(",")[i + 1]);
      }
      installationsPerCountry.push(n);
    }

    return [countriesArray, installationsPerCountry];
  }
  const file = csvFile.files[0];
  const reader = new FileReader();
  if (file) {
    reader.readAsText(file);
  }
  // This load occurs asynchrounously
  reader.addEventListener("load", () => {
    /*
        Once the reader loads a file successfully we then parse
      */
    let calculateTotalResultArray = calculateTotal(reader.result);
    if (
      checkGraphCountriesValidation(reader.result.split("\n")[0].split(",")[0])
    ) {
      displayGraphCountries();
    } else {
      document.getElementById("placeholder-countries").style.display = "block";
      document.getElementById("myChartCountries").style.display = "none";
      return;
    }

    let ctx = document.getElementById("myChartCountries").getContext("2d");
    const randomColours = generateRandomLightColours(
      calculateTotalResultArray[0].length
    );

    // Canvas already in use fix
    let chartStatus = Chart.getChart("myChartCountries");
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }
    let delayed;
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: calculateTotalResultArray[0],
        datasets: [
          {
            label: "Dataset 1",
            data: calculateTotalResultArray[1],
            backgroundColor: randomColours,
            borderColor: ["white"],
            borderWidth: 2,
          },
        ],
      },
      options: {
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (
              context.type === "data" &&
              context.mode === "default" &&
              !delayed
            ) {
              delay = context.dataIndex * 50 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Countries by Number of Installations",
          },
        },
      },
    });
    document.getElementById("placeholder-countries").style.display = "none";
    document.getElementById("myChartCountries").style.display = "block";
  });
}

document
  .querySelector("#submit-countries")
  .addEventListener("click", function () {
    const csvFile = document.getElementById("countries-file");
    // Input is empty (No file Choosen)
    if (csvFile.value.length == 0) {
      document.getElementById("placeholder-countries").style.display = "block";
      document.getElementById("myChartCountries").style.display = "none";
    } else {
      // Gets rid of placeholder for countries graph
      window.scrollTo(0, 105);
      clearTimeout(alertSetTimeoutId);
      csvParseTotalCountries(csvFile);
      // [{country: 'Canada', value: 101} ... {country: 'Malaysia', value: 21}]
    }
  });

function checkGraphCountriesValidation(firstRowvalue) {
  const alert = document.getElementById("alert");
  if (firstRowvalue === "Totals By Breakout") {
    return true;
  } else if (firstRowvalue === "Totals") {
    alert.style.opacity = 1;
    alert.innerText = `The choosen file is a installations csv file. Please select the correct countries file, or switch to the Total installations tab`;
    alert.classList.add("alert-warning");
    alertSetTimeoutId = alertTimeout("alert");
  } else {
    alert.style.opacity = 1;
    alert.innerText = `The choosen file is not in proper format of a countries csv file. Please select the correct file`;
    alert.classList.add("alert-danger");
    alertSetTimeoutId = alertTimeout("alert");
  }
}

function displayGraphCountries() {
  let x = document.getElementById("chartDivCountries");
  if (x.style.display === "none") {
    x.style.display = "block";
  }
}

// Disabled button if has no input
document.querySelector("#countries-file").addEventListener("change", () => {
  if (document.getElementById("countries-file").files.length !== 0) {
    document.getElementById("submit-countries").removeAttribute("disabled");
  } else {
    document.getElementById("submit-countries").click();
    document.getElementById("submit-countries").setAttribute("disabled", true);
  }
});

//Placeholder animated graph for countries graph
document.addEventListener("DOMContentLoaded", (event) => {
  const ctx = document
    .getElementById("placeholder-countries-image")
    .getContext("2d");
  const data = {
    datasets: [
      {
        label: "Dataset 1",
        data: [1, 2.5, 5],
        borderColor: ["white"],
        borderWidth: 2,
        backgroundColor: ["rgb(224,224,224)"],
      },
    ],
  };
  let delayed;
  let myChart = new Chart(ctx, {
    type: "doughnut",
    data: data,
    options: {
      animation: {
        delay: (context) => {
          let delay = 0;
          if (
            context.type === "data" &&
            context.mode === "default" &&
            !delayed
          ) {
            delay = 5000;
          }
          return delay;
        },

        loop: true,
      },
      events: [],
    },
  });

  myChart.options.animation.duration = 0;
  myChart.update();
});
