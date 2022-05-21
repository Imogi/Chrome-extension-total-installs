import { uploadCheck, alertTimeout } from './helper/helper-functions.js';

// BIG REFACTOR
// This should only contain the csv parse function
// extract the queryselectors to their own files

// document.querySelector('#submit-installations').addEventListener('click', csvParse);

document.querySelector('#Total-installs-container').addEventListener('click', function(){
  document.getElementById("install-csv-upload").click();
})

document.querySelector('#Total-installs-container').addEventListener('change', () => {
  const csv = document.getElementById("install-csv-upload");
  const file = csv.files[0].name;
  if(uploadCheck(file) === -1){
    // Show alert
    document.getElementById('alert-danger').style.display = 'flex';
    document.getElementById('alert-danger').innerText = `${file} is not a csv file.`
    alertTimeout('alert-danger');
    return;
  }
  else{
    document.getElementById('alert-success').style.display = 'flex';
    document.getElementById('alert-success').innerText = `${file} uploaded!`
    alertTimeout('alert-success');
    // So parse is either successful or fails based on format of csv
    // If it passes, hide the blinking circle and do animation and present number of installs
    csvParseTotalInstalls(csv);
  }

})

function csvParseTotalInstalls(csvFile) {
    var total = 0;
    function calculateTotal(str, total) {
      /*
        Takes in the string given by the reader, creates an array (lines) 
        split by new lines. Then it iterates through the array and removes 
        the date range to isolate the number value. 
        Returns the total number of installations.
      */
      var lines = str.split('\n');
      for(var i=0; i<lines.length; i++){
        lines[i] = lines[i].replace(/.*,/g, '');
        if(/^\d+/.test(lines[i])){
          total += Number(lines[i]);
        }
      }
      return total; 
    }
    
    const file = csvFile.files[0];
    const reader = new FileReader();
   
    reader.addEventListener("load", () => {
      /*
        Once the reader loads a file successfully we then parse
      */
      const total_downloads = calculateTotal(reader.result, total);
      const total_installs_container = document.getElementById("Total-installs-container");
      total_installs_container.style.display = "none";
      const total_div = document.createElement("div");
      total_div.innerText = total_downloads;
      total_div.id = "Total-installs-total-div"
      total_div.style.fontSize = "2.5rem";
      const home_container = document.getElementById("home-container");
      home_container.appendChild(total_div);
      // Do animation with lines
      const lines = document.getElementsByClassName("line");
      for(var i=0; i<lines.length; i++){
        lines[i].style.display = "flex";
      }
    }, false);
    
    if(file){
      reader.readAsText(file);
    }
};



document.querySelector('#submit-countries').addEventListener('click', function () {
    const csvFile = document.getElementById("countries-file");
    //alert("Hello! I am an alert box!!");
    //alert(csvFile.files[0].filename);


    function csvToArray(str, delimiter = ",") {

        // slice from start of text to the first \n index
        // use split to create an array from string by delimiter
        const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
  
        // slice from \n index + 1 to the end of the text
        // use split to create an array of each csv value row
        const rows = str.slice(str.indexOf("\n") + 1).split("\n");
  
        // Map the rows
        // split values from each row into an array
        // use headers.reduce to create an object
        // object properties derived from headers:values
        // the object passed as an element of the array
        const arr = rows.map(function (row) {
          const values = row.split(delimiter);
          const el = headers.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
          }, {});
          return el;
        });
  
        // return the array
        return arr;
    }

    
    const input = csvFile.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
    const text = e.target.result;
    const data = csvToArray(text);
    document.write(JSON.stringify(data));
    };
      
    reader.readAsText(input);

});

