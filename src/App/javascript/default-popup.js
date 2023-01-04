/*
  Event listeners for navigation bar buttons
*/
document.querySelector("#home-nav-btn").addEventListener("click", function () {
  document.getElementById("home-container").style.display = "block";
  document.getElementById("visualiser-container").style.display = "none";
  document.getElementById("home-nav-btn").classList.add("active");
  document.getElementById("visualiser-nav-btn").classList.remove("active");
  // Make visualiser alert disappear if main nav tab changes
  document.getElementById("alert").style.opacity = 0;
});

document
  .querySelector("#visualiser-nav-btn")
  .addEventListener("click", function () {
    document.getElementById("home-container").style.display = "none";
    document.getElementById("visualiser-container").style.display = "block";
    document.getElementById("visualiser-nav-btn").classList.add("active");
    document.getElementById("home-nav-btn").classList.remove("active");
    // Make home alert disappear if main nav tab changes
    document.getElementById("alert").style.opacity = 0;
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
    // Make countries alert disappear if subnav tab changes
    document.getElementById("alert").style.opacity = 0;
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
    // Make total installations alert disappear if subnav tab changes
    document.getElementById("alert").style.opacity = 0;
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
