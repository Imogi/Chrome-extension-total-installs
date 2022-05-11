

document.querySelector('#submit-installations').addEventListener('click', function () {
    const csvFile = document.getElementById("installations-file");
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
    const ac = document.getElementById("visualiser-container");
    console.log("acccccc");

    // reader.onload = function (e) {
    //   const text = e.target.result;
    //   const data = csvToArray(text);
    //   document.write(JSON.stringify(data));
    //   console.log(JSON.stringify(data));

    //   const node = document.createTextNode(input);
      
      
    //   console.log(ac);
    //   ac.appendChild(node);
    // };
    // const ac = document.getElementById("visualiser-container");
    // ac.appendChild(input);

    const data = csvToArray(text);
    reader.readAsText(input);
});



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

