/*
  Event listeners for navigation bar buttons
*/
document.querySelector("#home-nav-btn").addEventListener("click", function () {
  document.getElementById("home-container").style.display = "block";
  document.getElementById("visualiser-container").style.display = "none";
});

document
  .querySelector("#visualiser-nav-btn")
  .addEventListener("click", function () {
    document.getElementById("home-container").style.display = "none";
    document.getElementById("visualiser-container").style.display = "block";
    if (
      document.getElementById("countries-nav-btn").classList.contains("active")
    ) {
      document.getElementById("countries-container").style.display = "block";
    } else {
      document.getElementById("installation-container").style.display = "block";
    }
  });

document
  .querySelector("#countries-nav-btn")
  .addEventListener("click", function () {
    document.getElementById("countries-container").style.display = "block";
    document.getElementById("installation-container").style.display = "none";

    // Button active colour
    if (
      !document.getElementById("countries-nav-btn").classList.contains("active")
    ) {
      document.getElementById("countries-nav-btn").classList.add("active");
    }

    if (
      document.getElementById("installs-nav-btn").classList.contains("active")
    ) {
      document.getElementById("installs-nav-btn").classList.remove("active");
    }
  });

document
  .querySelector("#installs-nav-btn")
  .addEventListener("click", function () {
    document.getElementById("installation-container").style.display = "block";
    document.getElementById("countries-container").style.display = "none";

    // Button active colour
    if (
      !document.getElementById("installs-nav-btn").classList.contains("active")
    ) {
      document.getElementById("installs-nav-btn").classList.add("active");
    }

    if (
      document.getElementById("countries-nav-btn").classList.contains("active")
    ) {
      document.getElementById("countries-nav-btn").classList.remove("active");
    }
  });
