import { uploadCheck, alertTimeout } from './helper/helper-functions.js';

// BIG REFACTOR
// This should only contain the csv parse function
// extract the queryselectors to their own files

// document.querySelector('#submit-installations').addEventListener('click', csvParse);

document.querySelector('#Total-installs-container').addEventListener('click', () => {
  document.getElementById("install-csv-upload").click();
})


/*
  Event listener for the Total installs container, i.e the big pulsing circle for uploading
*/
document.querySelector('#install-csv-upload').addEventListener('change', () => {
  
  const csv = document.getElementById("install-csv-upload");
  const file = csv.files[0].name;
  const alert = document.getElementById('alert');
  if(uploadCheck(file) === -1){
    // Show alert
    alert.style.opacity= 1;
    alert.innerText = `${file} is not a csv file.`
    alert.classList.add("alert-danger")
    alertTimeout('alert');
    return;
  }
  else{

    // Have check if they upload the same file! Using sessionStorage for checks
    if(sessionStorage.getItem('current-csv-name') === file){
      // Show alert
      alert.style.opacity = 1;
      alert.classList.add("alert-warning");
      alert.innerText = `${file} was just uploaded!`
      alertTimeout('alert');
      document.getElementById("install-csv-upload").value = '';
    }
    else{
      // Show alert
      alert.style.opacity= 1;
      alert.innerText = `${file} uploaded!`
      alert.classList.add("alert-success");
      sessionStorage.setItem('current-csv-name', file);
      alertTimeout('alert');
      // So parse is either successful or fails based on format of csv
      // If it passes, hide the blinking circle and do animation and present number of installs
      csvParseTotalInstalls(csv);
      document.getElementById("install-csv-upload").value = '';
    }
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
      total_installs_container.classList.add("total-installs-hidden");
      /*
        Create the downloads text area div.
        If first time uploading.
      */
      if(document.getElementById("Total-installs-total-div") === null){
        const total_div = document.createElement("div");
        total_div.innerText = total_downloads + " downloads";
        total_div.id = "Total-installs-total-div"
        total_div.style.fontSize = "2rem";
        const home_container = document.getElementById("calculated-total-container");
        home_container.appendChild(total_div);
      }
      else{
        document.getElementById("Total-installs-total-div").innerText = total_downloads + " downloads";
      }

      /*
        I don't know why adding classes with opacity changes did not do what 
        the code below does. Wasted so much time on this.
      */
      total_installs_container.addEventListener('mouseover', () => {
        total_installs_container.style.opacity = 1;
        document.getElementById("calculated-total-container").addEventListener('mouseover', () => {
          document.getElementById("calculated-total-container").style.opacity = 0;
          total_installs_container.style.opacity = 1;
        })
        document.getElementById("calculated-total-container").style.opacity = 0;
      })
      total_installs_container.addEventListener('mouseleave', () => {
        total_installs_container.style.opacity = 0;
        document.getElementById("calculated-total-container").style.opacity = 1;
      })
    
      // Do animation with lines
      const lines = document.getElementsByClassName("line");
      for(var i=0; i<lines.length; i++){
        lines[i].classList.add("visible");
        lines[i].classList.add("lineAnimation" + String(Number(i) + 1))
      }
    }, false);
    
    if(file){
      reader.readAsText(file);
    }
};



// document.querySelector('#submit-countries').addEventListener('click', function () {
//     const csvFile = document.getElementById("countries-file");

//     //selects the visualiser container page
//     const ac = (document.querySelector('#visualiser-container'));
//     const file = csvFile.files[0]

//     const reader = new FileReader();

//     reader.addEventListener("load", () => {
//       // this will then display a text file
//       const result = document.createTextNode(reader.result)
      
//       ac.appendChild(result);
//     }, false);
    
//     if(file){
//       reader.readAsText(file);
//     }

// });

document.querySelector('#submit-countries').addEventListener('click', function () {
  const csvFile = document.getElementById("countries-file");
  
  function csvParseTotalInstalls(csvFile) {

      function calculateTotal(str) {
        /*finds all countries and puts them into an array*/ 
        var countriesArray = str.split("\n")[1].split(',');
        countriesArray.shift()
        // console.log(countriesArray)
        // console.log(str.split("\n")[2].split(','))
        
        var arr1 = []
        /*subtract one at the end as the last line of all csv files are empty line*/ 
        var lengthOfCsvFile = str.split('\n').length - 1;
        var numberOfCountries = countriesArray.length;
        for(var i=0; i<numberOfCountries; i++){
          /*inserts each country into the array and creates a counter for the country starting at 0*/ 
          // arr1.push([countriesArray[i]])
          // arr1[i].push(0)
          arr1.push({
            country: countriesArray[i],
            value: 0
        });
          /* index starts at 2 as we dont need first two rows.*/ 
          for(var j=2; j<lengthOfCsvFile; j++){
            arr1[i]['value'] += parseInt(str.split("\n")[j].split(',')[i+1])
            //arr1[i].push(j)
          }
        }

        return arr1; 
      }
      
      const file = csvFile.files[0];
      const reader = new FileReader();
    
      reader.addEventListener("load", () => {
        /*
          Once the reader loads a file successfully we then parse
        */
        const total_downloads = calculateTotal(reader.result, total);
        console.log(total_downloads);
        
      }, false);
      
      if(file){
        reader.readAsText(file);
      }
  };
  csvParseTotalInstalls(csvFile);
  // [{country: 'Canada', value: 101} ... {country: 'Malaysia', value: 21}]





  //selects the visualiser container page
  const ac = (document.querySelector('#visualiser-container'));
  const file = csvFile.files[0]

  const reader = new FileReader();

  reader.addEventListener("load", () => {
    // this will then display a text file
    const result = document.createTextNode(reader.result)
    console.log(typeof(result))
    //const result = csvParseTotalInstalls(csvFile);
    ac.appendChild(result);
    const array = csvParseTotalInstalls(csvFile);
    document.getElementById("div1").innerHTML = array;
  }, false);
  
  if(file){
    reader.readAsText(file);
  }
});

