import { uploadCheck, alertTimeout } from "./helper/helper-functions.js";

// BIG REFACTOR
// This should only contain the csv parse function
// extract the queryselectors to their own files

// document.querySelector('#submit-installations').addEventListener('click', csvParse);

document
  .querySelector("#Total-installs-container")
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
  if (uploadCheck(file) === -1) {
    // Show alert
    alert.style.opacity = 1;
    alert.innerText = `${file} is not a csv file.`;
    alert.classList.add("alert-danger");
    alertTimeout("alert");
    return;
  } else {
    // Have check if they upload the same file! Using sessionStorage for checks
    if (sessionStorage.getItem("current-csv-name") === file) {
      // Show alert
      alert.style.opacity = 1;
      alert.classList.add("alert-warning");
      alert.innerText = `${file} was just uploaded!`;
      alertTimeout("alert");
      document.getElementById("install-csv-upload").value = "";
    } else {
      // Show alert
      alert.style.opacity = 1;
      alert.innerText = `${file} uploaded!`;
      alert.classList.add("alert-success");
      sessionStorage.setItem("current-csv-name", file);
      alertTimeout("alert");
      // So parse is either successful or fails based on format of csv
      // If it passes, hide the blinking circle and do animation and present number of installs
      csvParseTotalInstalls(csv);
      document.getElementById("install-csv-upload").value = "";
    }
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
      const total_downloads = calculateTotal(reader.result, total);
      const total_installs_container = document.getElementById(
        "Total-installs-container"
      );
      total_installs_container.classList.add("total-installs-hidden");
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

      /*
        I don't know why adding classes with opacity changes did not do what
        the code below does. Wasted so much time on this.
      */
      total_installs_container.addEventListener("mouseover", () => {
        total_installs_container.style.opacity = 1;
        document
          .getElementById("calculated-total-container")
          .addEventListener("mouseover", () => {
            document.getElementById(
              "calculated-total-container"
            ).style.opacity = 0;
            total_installs_container.style.opacity = 1;
          });
        document.getElementById("calculated-total-container").style.opacity = 0;
      });
      total_installs_container.addEventListener("mouseleave", () => {
        total_installs_container.style.opacity = 0;
        document.getElementById("calculated-total-container").style.opacity = 1;
      });

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

// document
//   .querySelector("#submit-countries")
//   .addEventListener("click", function () {
//     const csvFile = document.getElementById("countries-file");

//     //selects the visualiser container page
//     const ac = document.querySelector("#visualiser-container");
//     const file = csvFile.files[0];

//     const reader = new FileReader();

//     reader.addEventListener(
//       "load",
//       () => {
//         // this will then display a text file
//         const result = document.createTextNode(reader.result);

//         ac.appendChild(result);
//       },
//       false
//     );

//     if (file) {
//       reader.readAsText(file);
//     }
//   });

function csvParseTotalCountries(csvFile) {
  function calculateTotal(string) {
    /*finds all countries and puts them into an array*/
    // console.log(string);
    let countriesArray = string.split("\n")[1].split(",");
    // Removes first element from array
    countriesArray.shift();
    //console.log(countriesArray);

    // console.log(countriesArray);
    // console.log(string.split("\n")[3].split(","));

    let installationsPerCountry = [];
    /*subtract one at the end as the last line of all csv files are empty line*/
    let lengthOfCsvFile = string.split("\n").length - 1;

    let numberOfCountries = countriesArray.length;
    for (let i = 0; i < numberOfCountries; i++) {
      /*inserts each country into the array and creates a counter for the country starting at 0*/
      // arr1.push({
      //   country: countriesArray[i],
      //   value: 0,
      // });
      // countriesArray.push(String(countriesArray[i]));

      let n = 0;
      /* index starts at 2 as we dont need first two rows.*/
      for (let j = 2; j < lengthOfCsvFile; j++) {
        n += parseInt(string.split("\n")[j].split(",")[i + 1]);
        //arr1[i].push(j)
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
    let x = calculateTotal(reader.result);

    displayGraphCountries();

    let ctx = document.getElementById("myChartCountries").getContext("2d");
    const randomColours = generateRandomLightColours(x[0].length);

    // Canvas already in use fix
    let chartStatus = Chart.getChart("myChartCountries");
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }
    let delayed;
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: x[0],
        datasets: [
          {
            label: "Dataset 1",
            data: x[1],
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
  });
}

document
  .querySelector("#submit-countries")
  .addEventListener("click", function () {
    const csvFile = document.getElementById("countries-file");
    // Input is empty (No file Choosen)
    if (csvFile.value.length == 0) {
      // Gets rid of placeholder for countries graph
      document.getElementById("placeholder-countries").style.display = "block";
      document.getElementById("myChartCountries").style.display = "none";
    } else {
      // Gets rid of placeholder for countries graph
      document.getElementById("placeholder-countries").style.display = "none";
      document.getElementById("myChartCountries").style.display = "block";
    }
    csvParseTotalCountries(csvFile);
    // [{country: 'Canada', value: 101} ... {country: 'Malaysia', value: 21}]
  });

function csvParseTotalInstallations(csvFile) {
  function calculateTotal(string) {
    /*finds all countries and puts them into an array*/
    //console.log(string)
    //let countriesArray = string.split("\n")[0].split(',');
    //console.log(countriesArray)
    //countriesArray.shift()
    //console.log(countriesArray)
    //console.log(string.split("\n")[2].split(',')[0])

    let arrayOfDates = [];
    let arrayOfInstalls = [];

    /*subtract one at the end as the last line of all csv files are empty line*/
    let lengthOfCsvFile = string.split("\n").length - 1;

    /* index starts at 2 as we dont need first two rows.*/
    for (let j = 2; j < lengthOfCsvFile; j++) {
      //arrayOfDates[i]['value'] += parseInt(string.split("\n")[j].split(',')[i+1])
      arrayOfDates.push(String(string.split("\n")[j].split(",")[0]));

      arrayOfInstalls.push(parseInt(string.split("\n")[j].split(",")[1]));
    }
    //console.log(arrayOfDates)
    //console.log(arrayOfInstalls)

    //console.log([arrayOfDates, arrayOfInstalls]);

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

    let x = calculateTotal(reader.result);
    displayGraphInstallations();

    let ctx = document.getElementById("myChartInstallations").getContext("2d");
    const randomColours = generateRandomLightColours(x[0].length);

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
        labels: x[0],
        datasets: [
          {
            label: "Number Of Installs",
            data: x[1],
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

    const quarterDict = returnQuarterDict(x);
    // console.log(quarterDict);
    const quarterChartData = (quarterDict) => {
      let xAxisLabel = [];
      const years = Object.keys(quarterDict);
      const quarters = ["Q1", "Q2", "Q3", "Q4"];
      for (let i = 0; i < years.length; i++) {
        // console.log(years[i]);
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
  });
}

document
  .querySelector("#submit-installations")
  .addEventListener("click", function () {
    const csvFile = document.getElementById("installations-file");
    if (csvFile.value.length == 0) {
      // Gets rid of placeholder for countries graph
      document.getElementById("placeholder-installs").style.display = "block";
      document.getElementById("myChartInstallations").style.display = "none";
      document.getElementById("chartDivInstallationsQuarters").style.display =
        "none";
    } else {
      // Gets rid of placeholder for countries graph
      document.getElementById("placeholder-installs").style.display = "none";
      document.getElementById("myChartInstallations").style.display = "block";
      document.getElementById("chartDivInstallationsQuarters").style.display =
        "block";
    }
    csvParseTotalInstallations(csvFile);
  });

// Helper functions
function displayGraphCountries() {
  let x = document.getElementById("chartDivCountries");
  if (x.style.display === "none") {
    x.style.display = "block";
  }
}

function displayGraphInstallations() {
  let x = document.getElementById("chartDivInstallations");
  let y = document.getElementById("chartDivInstallationsQuarters");
  if (x.style.display === "none") {
    x.style.display = "block";
    y.style.display = "block";
  }
}

function generateRandomLightColours(numberOfColours) {
  function getRandomColor() {
    let letters = "BCDEF".split("");
    let color = "#";
    for (let i = 1; i <= 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  }

  let x = [];
  for (let j = 0; j < numberOfColours; j++) {
    x.push(getRandomColor());
  }

  return x;
}

//Placeholder images for countries graph
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
      // responsive: true,
      // maintainAspectRatio: false,
      events: [],
      // plugins: {
      //   legend: {
      //     display: false,
      //     position: "top",
      //   },
      // },
    },
  });

  myChart.options.animation.duration = 0;
  myChart.update();
});

// Placeholder images for installs graph
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

document.querySelector("#countries-file").addEventListener("change", () => {
  if (document.getElementById("countries-file").files.length !== 0) {
    document.getElementById("submit-countries").removeAttribute("disabled");
  } else {
    document.getElementById("submit-countries").click();
    document.getElementById("submit-countries").setAttribute("disabled", true);
  }
});
