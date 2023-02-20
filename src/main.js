/**
 * axios instance
 */
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: API_KEY,
    language: "es-ES",
  },
});

//Utils o helpers:

const lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    // console.log(entry.target.setAttribute)
    // console.log(entry)
    if (entry.isIntersecting) {
      const url = entry.target.getAttribute('data-img')
      // console.log(entry.target)
      entry.target.setAttribute('src', url)
      // lazyLoader.unobserve(image.target)
    }
  })
})

function createMovies(movies, container, { lazyLoad = false, clean = true } = {}) {
  if (clean) {
    container.innerHTML = "";
  }

  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");
    movieContainer.addEventListener("click", () => {
      location.hash = "#movie=" + movie.id;
    });

    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute(
      lazyLoad ? "data-img" : "src",
      `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
    );

    movieImg.addEventListener("error", () => {
      movieImg.setAttribute(
        "src",
        "https://static.platzi.com/static/images/error/img404.png"
      );
    });
    //lazyloader:
    if (lazyLoad) {
      lazyLoader.observe(movieImg);
    }

    movieContainer.appendChild(movieImg);
    container.appendChild(movieContainer);
  });
}

function createCategories(categories, container) {
  container.innerHTML = "";

  categories.forEach((categorie) => {
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("category-container");

    const categoryTitle = document.createElement("h3");
    categoryTitle.classList.add("category-title");
    categoryTitle.setAttribute("id", "id" + categorie.id);

    categoryTitle.addEventListener("click", () => {
      location.hash = `#category=${categorie.id}-${categorie.name}`;
    });
    const categoryTitleText = document.createTextNode(categorie.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  });
}

/**
 * trending
 * https://developers.themoviedb.org/3/trending/get-trending
 */
async function getTrendingMoviesPreview() {
  const { data } = await api("trending/movie/day");
  const movies = data.results;
  createMovies(movies, trendingMoviesPreviewList, true);
}

/**
 * Categories
 * https://developers.themoviedb.org/3/genres/get-movie-list
 */
async function getPreviewsCategories() {
  const { data } = await api("genre/movie/list");
  const categories = data.genres;
  createCategories(categories, categoriesPreviewList);
}

async function getMoviesByCategory(id) {
  const { data } = await api("discover/movie", {
    params: {
      with_genres: id,
    },
  });
  const movies = data.results;
  createMovies(movies, genericSection, true);
}

async function getMoviesBySearch(query) {
  const { data } = await api("search/movie", {
    params: {
      query,
    },
  });
  const movies = data.results;
  createMovies(movies, genericSection);
}

async function getTrendingMovies(query) {
  const { data } = await api("trending/movie/day", {
    params: {
      query,
    },
  });
  const movies = data.results;
  createMovies(movies, genericSection, { lazyLoad: true, clean: true });

  // const btnLoadMore = document.createElement('button');
  // btnLoadMore.innerText = 'Cargar más';
  // btnLoadMore.setAttribute('id', 'btn-load-more');
  // btnLoadMore.addEventListener('click', getPaginateTrendingMovies)
  // genericSection.appendChild(btnLoadMore);


}

let page = 1;
window.addEventListener('scroll', getPaginateTrendingMovies);

async function getPaginateTrendingMovies() {

  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);

  if (scrollIsBottom) {
    page++;

    const { data } = await api("trending/movie/day", {
      params: {
        page,
      },
    });
    const movies = data.results;
    createMovies(movies, genericSection, { lazyLoad: true, clean: false });
  }

  //  Cambiamos este boton por el scrolling
  // const btnLoadMore = document.createElement('button');
  // btnLoadMore.innerText = 'Cargar más';
  // btnLoadMore.setAttribute('id', 'btn-load-more');

  // btnLoadMore.addEventListener('click', getPaginateTrendingMovies)
  // genericSection.appendChild(btnLoadMore);
}

/**
 * get details movie
 * @param {*} id
 */
async function getMovieById(movie_id) {
  const { data: movie } = await api(`movie/${movie_id}`);

  const movieImgUrl = "https://image.tmdb.org/t/p/w500" + movie.poster_path;

  headerSection.style.background = `
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.35) 19.27%,
      rgba(0, 0, 0, 0) 29.17%
    ),
    url(${movieImgUrl})
  `;

  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;

  createCategories(movie.genres, movieDetailCategoriesList);

  getRelatedMoviesId(movie_id)
}

async function getRelatedMoviesId(id) {
  const { data } = await api(`movie/${id}/recommendations`);
  const relatedMovies = data.results;

  createMovies(relatedMovies, relatedMoviesContainer);
}
