// Fetching Data from the API //

const fetchData = async (searchTerm) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "354c3500",
      s: searchTerm,
    },
  });
  // Checking if we are getting valid data
  if (response.data.Error) {
    return [];
  }
  return response.data.Search;
};

// Selecting One Div & Hard Coding the Boilerplate for the Search Widget //

const root = document.querySelector(".auto-complete");
root.innerHTML = `
<label><b>Search For a Movie</b></label>
<input class = "input"/>
<div class = "dropdown">
    <div class = "dropdown-menu">
        <div class = "dropdown-content results"></div>
    </div>
</div>
`;

// Defining Callback for the Event Listener //

const onInput = async (event) => {
  const movies = await fetchData(event.target.value);

  // Checking if movies variable has any data //

  if (!movies.length) {
    dropdown.classList.remove("is-active");
    return;
  }

  // Clearing Previous Results //

  resultsWrapper.innerHTML = "";

  // Adding class right after we get the results //

  dropdown.classList.add("is-active");

  // Intializing a for loop to add each result to HTML //

  for (let movie of movies) {
    // Creating a element, adding class & some html inside it //

    const option = document.createElement("a");
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;

    option.classList.add("dropdown-item");
    option.innerHTML = `
      <img src = '${imgSrc}'/>
      ${movie.Title}
      `;

    option.addEventListener("click", () => {
      dropdown.classList.remove("is-active");
      searchInput.value = movie.Title;
      onMovieSelect(movie);
    });
    // Appending each movie inside the "results" class div //

    resultsWrapper.appendChild(option);
  }
};

// Selecting Search Input, DropDown & Results Div & Adding Event Listener //

const searchInput = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

// Adding Event Listener to Search Input //

searchInput.addEventListener("input", debounce(onInput, 500));

document.addEventListener("click", (event) => {
  if (!root.contains(event.target)) {
    dropdown.classList.remove("is-active");
  }
});

// Making a follow Up Request //

const onMovieSelect = async (movie) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "354c3500",
      i: movie.imdbID,
    },
  });

  document.querySelector("#moviePage").innerHTML = movieTemplate(response.data);
};

// Making Movie Temp //

const movieTemplate = (movieDetail) => {
  console.log(movieDetail);
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class = "media-content">
        <div class = "content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article class = "notification is-primary">
      <p class = "title">Awards</p>
      <p class = "subtitle is-4">${movieDetail.Awards}</p>
    </article>
    <article class = "notification is-primary">
      <p class = "title">Actors</p>
      <p class = "subtitle is-4">${movieDetail.Actors}</p>
    </article>
    <article class = "notification is-primary">
      <p class = "title">IMDB Rating</p>
      <p class = "subtitle is-4">${movieDetail.imdbRating}</p>
    </article>
  `;
};
