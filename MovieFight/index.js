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

const autoCompleteConfig = {
  renderOption(item) {
    const imgSrc = item.Poster === "N/A" ? "" : item.Poster;
    return `
    <img src = '${imgSrc}'/>
    ${item.Title} (${item.Year})
    `;
  },
  inputValue(item) {
    return item.Title;
  },
  async fetchData(searchTerm) {
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
  },
};

createAutoComplete({
  ...autoCompleteConfig,
  onOptionSelect(item) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(item, document.querySelector('#left-summary'));
  },
  root: document.querySelector("#left-autocomplete"),
});

createAutoComplete({
  ...autoCompleteConfig,
  onOptionSelect(item) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(item, document.querySelector('#right-summary'));
  },
  root: document.querySelector("#right-autocomplete"),
});

// Making a follow Up Request //

const onMovieSelect = async (item, summarySelect) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "354c3500",
      i: item.imdbID,
    },
  });

  summarySelect.innerHTML = movieTemplate(response.data);
};

// Making Movie Temp //

const movieTemplate = (itemDetail) => {
  console.log(itemDetail);
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${itemDetail.Poster}" />
        </p>
      </figure>
      <div class = "media-content">
        <div class = "content">
          <h1>${itemDetail.Title}</h1>
          <h4>${itemDetail.Genre}</h4>
          <p>${itemDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article class = "notification is-primary">
      <p class = "title">Awards</p>
      <p class = "subtitle is-4">${itemDetail.Awards}</p>
    </article>
    <article class = "notification is-primary">
      <p class = "title">Actors</p>
      <p class = "subtitle is-4">${itemDetail.Actors}</p>
    </article>
    <article class = "notification is-primary">
      <p class = "title">IMDB Rating</p>
      <p class = "subtitle is-4">${itemDetail.imdbRating}</p>
    </article>
  `;
};
