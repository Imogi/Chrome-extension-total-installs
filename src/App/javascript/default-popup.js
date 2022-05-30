/*
  Event listeners for navigation bar buttons
*/
document.querySelector('#visualiser-nav-btn').addEventListener('click', function () {
  document.getElementById('home-container').style.display = 'none';
  document.getElementById('visualiser-container').style.display = 'block';
});

document.querySelector('#home-nav-btn').addEventListener('click', function () {
  document.getElementById('home-container').style.display = 'block';
  document.getElementById('visualiser-container').style.display = 'none';
});

