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
  var total = 0;
  function calculateTotal(str, total) {
    /*
        Takes in the string given by the reader, creates an array (lines) 
        split by new lines. Then it iterates through the array and removes 
        the date range to isolate the number value. 
        Returns the total number of installations.
      */

    var lines = str.split("\n");

    for (var i = 0; i < lines.length; i++) {
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
      for (var i = 0; i < lines.length; i++) {
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
    var countriesArray = string.split("\n")[1].split(",");
    // Removes first element from array
    countriesArray.shift();
    //console.log(countriesArray);

    // console.log(countriesArray);
    // console.log(string.split("\n")[3].split(","));

    var installationsPerCountry = [];
    /*subtract one at the end as the last line of all csv files are empty line*/
    var lengthOfCsvFile = string.split("\n").length - 1;

    var numberOfCountries = countriesArray.length;
    for (var i = 0; i < numberOfCountries; i++) {
      /*inserts each country into the array and creates a counter for the country starting at 0*/
      // arr1.push({
      //   country: countriesArray[i],
      //   value: 0,
      // });
      // countriesArray.push(String(countriesArray[i]));

      let n = 0;
      /* index starts at 2 as we dont need first two rows.*/
      for (var j = 2; j < lengthOfCsvFile; j++) {
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

    var ctx = document.getElementById("myChartCountries").getContext("2d");
    const randomColours = generateRandomLightColours(x[0].length);

    // Gets rid of placeholder for countries graph
    document.getElementById("placeholder-countries").style.display = "none";
    document.getElementById("myChartCountries").style.display = "block";

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

    csvParseTotalCountries(csvFile);
    // [{country: 'Canada', value: 101} ... {country: 'Malaysia', value: 21}]
  });

function csvParseTotalInstallations(csvFile) {
  function calculateTotal(string) {
    /*finds all countries and puts them into an array*/
    //console.log(string)
    //var countriesArray = string.split("\n")[0].split(',');
    //console.log(countriesArray)
    //countriesArray.shift()
    //console.log(countriesArray)
    //console.log(string.split("\n")[2].split(',')[0])

    var arrayOfDates = [];
    var arrayOfInstalls = [];

    /*subtract one at the end as the last line of all csv files are empty line*/
    var lengthOfCsvFile = string.split("\n").length - 1;

    /* index starts at 2 as we dont need first two rows.*/
    for (var j = 2; j < lengthOfCsvFile; j++) {
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

    var ctx = document.getElementById("myChartInstallations").getContext("2d");
    const randomColours = generateRandomLightColours(x[0].length);

    // Gets rid of placeholder for countries graph
    document.getElementById("placeholder-installs").style.display = "none";
    document.getElementById("myChartInstallations").style.display = "block";

    // Canvas already in use fix
    let chartStatus = Chart.getChart("myChartInstallations");
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }

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
  });
}

document
  .querySelector("#submit-installations")
  .addEventListener("click", function () {
    const csvFile = document.getElementById("installations-file");

    csvParseTotalInstallations(csvFile);
  });

// Helper functions
function displayGraphCountries() {
  var x = document.getElementById("chartDivCountries");
  if (x.style.display === "none") {
    x.style.display = "block";
  }
}

function displayGraphInstallations() {
  var x = document.getElementById("chartDivInstallations");
  if (x.style.display === "none") {
    x.style.display = "block";
  }
}

function generateRandomLightColours(numberOfColours) {
  function getRandomColor() {
    var letters = "BCDEF".split("");
    var color = "#";
    for (var i = 1; i <= 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  }

  var x = [];
  for (var j = 0; j < numberOfColours; j++) {
    x.push(getRandomColor());
  }

  return x;
}

//Placeholder images for countries and installs graphs
addEventListener("DOMContentLoaded", (event) => {
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
        backgroundColor: ["rgb(220,220,220)"],
      },
    ],
  };

  new Chart(ctx, {
    type: "doughnut",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      events: [],
      plugins: {
        legend: {
          display: false,
          position: "top",
        },
      },
    },
  });
});

addEventListener("DOMContentLoaded", (event) => {
  const ctx1 = document
    .getElementById("placeholder-installs-image")
    .getContext("2d");
  const data1 = {
    labels: ["", "", "", "", "", ""],
    datasets: [
      {
        label: "My First Dataset",
        data: [5, 10, 35, 20, 40, 45, 55],
        borderColor: "rgb(220,220,220)",
        tension: 0.1,
      },
    ],
  };

  new Chart(ctx1, {
    type: "line",
    data: data1,
    options: {
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
