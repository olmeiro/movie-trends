window.addEventListener("DOMContentLoaded", navigator, false);
window.addEventListener("hashchange", navigator, false);

function navigator() {
  console.log({ location });
  if (location.hash.startsWith("#trends")) {
    trendsPage();
  } else if (location.hash.startsWith("#search=")) {
    searchPage();
  } else if (location.hash.startsWith("#movie=123")) {
    movieDetailPage();
  } else if (location.hash.startsWith("#category=37")) {
    categoryPage();
  } else {
    homePage();
  }
}

function homePage() {
  console.log("home");

  getTrendingMoviesPreview();
  getPreviewsCategories();
}
function categoryPage() {
  console.log("Categories");
}
function movieDetailPage() {
  console.log("detail ");
}
function searchPage() {
  console.log("home");
}
function trendsPage() {
  console.log("trends");
}
