import { generateRandomLightColours } from "../helper/helper-functions.js";

let alertSetTimeoutId = undefined;

function csvParseTotalInstallations(csvFile) {
  function calculateTotal(string) {
    /*finds all countries and puts them into an array*/
    let arrayOfDates = [];
    let arrayOfInstalls = [];

    /*subtract one at the end as the last line of all csv files are empty line*/
    let lengthOfCsvFile = string.split("\n").length - 1;

    /* index starts at 2 as we dont need first two rows.*/
    for (let j = 2; j < lengthOfCsvFile; j++) {
      arrayOfDates.push(String(string.split("\n")[j].split(",")[0]));

      arrayOfInstalls.push(parseInt(string.split("\n")[j].split(",")[1]));
    }
    return [arrayOfDates, arrayOfInstalls];
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
      checkGraphInstallationsValidation(
        reader.result.split("\n")[0].split(",")[0]
      )
    ) {
      displayGraphInstallations();
    } else {
      document.getElementById("placeholder-installs").style.display = "block";
      document.getElementById("myChartInstallations").style.display = "none";
      document.getElementById("chartDivInstallationsQuarters").style.display =
        "none";
      return;
    }

    let ctx = document.getElementById("myChartInstallations").getContext("2d");
    const randomColours = generateRandomLightColours(
      calculateTotalResultArray[0].length
    );

    let ctx2 = document
      .getElementById("myChartInstallationsQuarters")
      .getContext("2d");

    // Canvas already in use fix
    let chartStatus = Chart.getChart("myChartInstallations");
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }
    let chartStatus2 = Chart.getChart("myChartInstallationsQuarters");
    if (chartStatus2 != undefined) {
      chartStatus2.destroy();
    }
    const returnQuarterDict = (inputArray) => {
      var quarterDict = {};
      for (let i = 0; i < inputArray[0].length; i++) {
        const year = inputArray[0][i].split("/")[2];
        if (year in quarterDict === false) {
          quarterDict[year] = [0, 0, 0, 0];
        }
      }

      for (let i = 0; i < inputArray[0].length; i++) {
        const month = inputArray[0][i].split("/")[0];
        const year = inputArray[0][i].split("/")[2];
        if (month === "1" || month === "2" || month === "3") {
          quarterDict[year][0] += inputArray[1][i];
        } else if (month === "4" || month === "5" || month === "6") {
          quarterDict[year][1] += inputArray[1][i];
        } else if (month === "7" || month === "8" || month === "9") {
          quarterDict[year][2] += inputArray[1][i];
        } else if (month === "10" || month === "11" || month === "12") {
          quarterDict[year][3] += inputArray[1][i];
        }
      }
      return quarterDict;
    };

    new Chart(ctx, {
      type: "line",
      data: {
        labels: calculateTotalResultArray[0],
        datasets: [
          {
            label: "Number Of Installs",
            data: calculateTotalResultArray[1],
            backgroundColor: randomColours,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Number of Installations of Chrome Extension",
          },
        },
      },
    });

    const quarterDict = returnQuarterDict(calculateTotalResultArray);
    const quarterChartData = (quarterDict) => {
      let xAxisLabel = [];
      const years = Object.keys(quarterDict);
      const quarters = ["Q1", "Q2", "Q3", "Q4"];
      for (let i = 0; i < years.length; i++) {
        for (let j = 0; j < quarters.length; j++) {
          xAxisLabel.push(String(years[i]).concat(" ", quarters[j]));
        }
      }
      let xAxisLabelValues = [];
      const values = Object.values(quarterDict);
      for (let i = 0; i < values.length; i++) {
        for (let j = 0; j < values[i].length; j++) {
          xAxisLabelValues.push(values[i][j]);
        }
      }
      return [xAxisLabel, xAxisLabelValues];
    };
    const quarterChartLabels = quarterChartData(quarterDict);
    new Chart(ctx2, {
      type: "bar",
      data: {
        labels: quarterChartLabels[0],
        datasets: [
          {
            label: "Number Of Installs",
            data: quarterChartLabels[1],
            backgroundColor: randomColours,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Number of Installations of Chrome Extension per Quarters",
          },
        },
      },
    });
    document.getElementById("placeholder-installs").style.display = "none";
    document.getElementById("myChartInstallations").style.display = "block";
    document.getElementById("chartDivInstallationsQuarters").style.display =
      "block";
  });
}

document
  .querySelector("#submit-installations")
  .addEventListener("click", function () {
    const csvFile = document.getElementById("installations-file");
    // Input is empty (No file Choosen)
    if (csvFile.value.length == 0) {
      document.getElementById("placeholder-installs").style.display = "block";
      document.getElementById("myChartInstallations").style.display = "none";
      document.getElementById("chartDivInstallationsQuarters").style.display =
        "none";
    } else {
      // Gets rid of placeholder for installations graph
      window.scrollTo(0, 105);

      csvParseTotalInstallations(csvFile);
      clearTimeout(alertSetTimeoutId);
    }
  });

function displayGraphInstallations() {
  let x = document.getElementById("chartDivInstallations");
  let y = document.getElementById("chartDivInstallationsQuarters");
  if (x.style.display === "none") {
    x.style.display = "block";
    y.style.display = "block";
  }
}

function checkGraphInstallationsValidation(firstRowvalue) {
  const alert = document.getElementById("alert");
  if (firstRowvalue === "Totals") {
    return true;
  } else if (firstRowvalue === "Totals By Breakout") {
    alert.style.opacity = 1;
    alert.innerText = `The choosen file is a countries csv file. Please select the correct installations file, or switch to the Countries tab`;
    alert.classList.add("alert-warning");
    alertSetTimeoutId = alertTimeout("alert");
  } else {
    alert.style.opacity = 1;
    alert.innerText = `The choosen file is not in proper format of a installations csv file. Please select the correct file`;
    alert.classList.add("alert-danger");
    alertSetTimeoutId = alertTimeout("alert");
  }
}

// Disabled button if has no input
document.querySelector("#installations-file").addEventListener("change", () => {
  if (document.getElementById("installations-file").files.length !== 0) {
    document.getElementById("submit-installations").removeAttribute("disabled");
  } else {
    document.getElementById("submit-installations").click();
    document
      .getElementById("submit-installations")
      .setAttribute("disabled", true);
  }
});

// Placeholder animated graph for installs graph
document.addEventListener("DOMContentLoaded", (event) => {
  const ctx1 = document
    .getElementById("placeholder-installs-image")
    .getContext("2d");
  const data1 = {
    labels: ["", "", "", "", "", ""],
    datasets: [
      {
        label: "My First Dataset",
        data: [15, 17, 16, 19, 17, 17.5],
        borderColor: "rgb(224,224,224)",
        tension: 0.1,
      },
    ],
  };

  new Chart(ctx1, {
    type: "line",
    data: data1,
    options: {
      animations: {
        tension: {
          duration: 1000,
          easing: "linear",
          from: 1,
          to: 0,
          loop: true,
        },
      },
      events: [],
      responsive: false,
      plugins: {
        legend: {
          display: false,
          position: "top",
        },
      },
      scales: {
        y: {
          display: false,
        },
      },
    },
  });
});
