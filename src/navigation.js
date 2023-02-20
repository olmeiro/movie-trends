let maxPage;
let page = 1;
let infinitScroll;

window.addEventListener("DOMContentLoaded", navigator, false);
window.addEventListener("hashchange", navigator, false);
window.addEventListener('scroll', infinitScroll, { passive: false });


window.addEventListener(
  "DOMContentLoaded",
  () => {
    navigator();
    // Agregando un estado de carga inical
    window.history.pushState({ loadUrl: window.location.href }, null, "");
  },
  false
);

// searchFormBtn.addEventListener("click", () => {
//   location.hash = "#search=" + searchFormInput.value; //grab input
// });

searchFormBtn.addEventListener('click',
  e => searchFormInput.value !== "" ? location.hash = 'search=' + searchFormInput.value : e.preventDefault())

trendingBtn.addEventListener("click", () => {
  location.hash = "#trends";
});

arrowBtn.addEventListener("click", () => {
  const stateLoad = window.history.state ? window.history.state.loadUrl : "";
  if (stateLoad.includes("#")) {
    window.location.hash = "#home";
  } else {
    window.history.back();
  }
});

function smoothscroll() {
  const currentScroll =
    document.documentElement.scrollTop || document.body.scrollTop;
  if (currentScroll > 0) {
    window.requestAnimationFrame(smoothscroll);
    window.scrollTo(0, currentScroll - currentScroll / 5);
  }
}

function navigator() {
  console.log({ location });

  if (infinitScroll) {
    window.removeEventListener('scroll', infinitScroll, { passive: false });
    infinitScroll = undefined;
  }

  if (location.hash.startsWith("#trends")) {
    trendsPage();
  } else if (location.hash.startsWith("#search=")) {
    searchPage();
  } else if (location.hash.startsWith("#movie=")) {
    movieDetailPage();
  } else if (location.hash.startsWith("#category=")) {
    categoryPage();
  } else {
    homePage();
  }

  window.scroll({
    top: 0,
    behavior: "smooth",
  });

  if (infinitScroll) {
    window.addEventListener('scroll', infinitScroll, { passive: false });
  }
  page = 1
}

function homePage() {
  console.log("home");

  headerSection.classList.remove("header-container--long");
  headerSection.style.background = "";

  arrowBtn.classList.add("inactive");
  arrowBtn.classList.remove("header-arrow--white");

  headerTitle.classList.remove("inactive");
  headerCategoryTitle.classList.add("inactive");
  searchForm.classList.remove("inactive");

  trendingPreviewSection.classList.remove("inactive");
  categoriesPreviewSection.classList.remove("inactive");

  genericSection.classList.add("inactive");
  movieDetailSection.classList.add("inactive");

  getTrendingMoviesPreview();
  getPreviewsCategories();
}
function categoryPage() {
  console.log("Categories");

  headerSection.classList.remove("header-container--long");
  headerSection.style.background = "";

  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.remove("inactive");
  searchForm.classList.add("inactive");

  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");

  genericSection.classList.remove("inactive");
  movieDetailSection.classList.add("inactive");

  //['#category', 'id-name']
  const [_, categoryData] = location.hash.split("=");
  const [categoryId, categoryName] = categoryData.split("-");

  headerCategoryTitle.innerHTML = decodeURIComponent(categoryName);
  getMoviesByCategory(categoryId);

  infinitScroll = getPaginatedMoviesByCategory(categoryId);
}
function movieDetailPage() {
  console.log("detail ");
  headerSection.classList.add("header-container--long");
  // headerSection.style.background = '';

  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.add("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.add("inactive");
  searchForm.classList.add("inactive");

  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");

  genericSection.classList.add("inactive");
  movieDetailSection.classList.remove("inactive");

  const [_, movieId] = location.hash.split('=');
  getMovieById(movieId);
}
function searchPage() {
  console.log("search");

  headerSection.classList.remove("header-container--long");
  headerSection.style.background = "";

  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.add("inactive");
  searchForm.classList.remove("inactive");

  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");

  genericSection.classList.remove("inactive");
  movieDetailSection.classList.add("inactive");

  //['#search', 'robot']
  const [_, query] = location.hash.split("=");
  getMoviesBySearch(query);

  infinitScroll = getPaginatedMoviesBySearch(query); //los () ejecutan el closure
}

function trendsPage() {
  console.log("trends");

  headerSection.classList.remove("header-container--long");
  headerSection.style.background = "";

  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.remove("inactive");
  searchForm.classList.add("inactive");

  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");

  genericSection.classList.remove("inactive");
  movieDetailSection.classList.add("inactive");

  headerCategoryTitle.innerHTML = "Tendencias";
  getTrendingMovies();

  infinitScroll = getPaginateTrendingMovies;
}
