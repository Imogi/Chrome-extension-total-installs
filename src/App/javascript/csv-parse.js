

document.querySelector('#submit-installations').addEventListener('click', function () {
    const csvFile = document.getElementById("installations-file");
    
    //alert("Hello! I am an alert box!!");
    //alert(csvFile.files[0].filename);

    // function csvToArray(str, delimiter = ",") {

    //     // slice from start of text to the first \n index
    //     // use split to create an array from string by delimiter
    //     const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
  
    //     // slice from \n index + 1 to the end of the text
    //     // use split to create an array of each csv value row
    //     const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    //     // Map the rows
    //     // split values from each row into an array
    //     // use headers.reduce to create an object
    //     // object properties derived from headers:values
    //     // the object passed as an element of the array
    //     const arr = rows.map(function (row) {
    //       const values = row.split(delimiter);
    //       const el = headers.reduce(function (object, header, index) {
    //         object[header] = values[index];
    //         return object;
    //       }, {});
    //       return el;
    //     });
  
    //     // return the array
    //     return arr;
    // }
    
    const ac = (document.querySelector('#visualiser-container'));
    const file = csvFile.files[0];

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      // this will then display a text file
      //
      const result = document.createTextNode(reader.result)
      ac.appendChild(result);
    }, false);
    
    if(file){
      reader.readAsText(file);
    }
});



document.querySelector('#submit-countries').addEventListener('click', function () {
    const csvFile = document.getElementById("countries-file");

    //selects the visualiser container page
    const ac = (document.querySelector('#visualiser-container'));
    const file = csvFile.files[0]

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      // this will then display a text file
      const result = document.createTextNode(reader.result)
      
      ac.appendChild(result);
    }, false);
    
    if(file){
      reader.readAsText(file);
    }

});

