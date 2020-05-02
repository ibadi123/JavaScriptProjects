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
    onMovieSelect(item, document.querySelector("#left-summary"), "left");
  },
  root: document.querySelector("#left-autocomplete"),
});

createAutoComplete({
  ...autoCompleteConfig,
  onOptionSelect(item) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(item, document.querySelector("#right-summary"), "right");
  },
  root: document.querySelector("#right-autocomplete"),
});

// Making a follow Up Request //
let leftMovie;
let rightMovie;
const onMovieSelect = async (item, summarySelect, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "354c3500",
      i: item.imdbID,
    },
  });

  summarySelect.innerHTML = movieTemplate(response.data);

  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runCompare();
  }
};

const runCompare = () => {
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);

    console.log(leftSideValue, rightSideValue);

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
    } else if (rightSideValue < leftSideValue) {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    }
    else{

    }
  });
};
// Making Movie Temp //

const movieTemplate = (itemDetail) => {
  const imdbRating = parseFloat(itemDetail.imdbRating);
  const imdbVotes = parseInt(itemDetail.imdbVotes.replace(/,/g, ""));

  let count = 0;
  const awards = itemDetail.Awards.split(" ").forEach((word) => {
    const value = parseInt(word);

    if (isNaN(value)) {
      return;
    } else {
      count = count + value;
    }
  });

  console.log(imdbRating, imdbVotes, count);

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
    <article data-value = ${count} class = "notification is-primary">
      <p class = "title">Awards</p>
      <p class = "subtitle is-4">${itemDetail.Awards}</p>
    </article>
    <article class = "notification is-primary">
      <p class = "title">Actors</p>
      <p class = "subtitle is-4">${itemDetail.Actors}</p>
    </article>
    <article data-value = ${imdbRating} class = "notification is-primary">
      <p class = "title">IMDB Rating</p>
      <p class = "subtitle is-4">${itemDetail.imdbRating}</p>
    </article>
    <article data-value = ${imdbVotes} class = "notification is-primary">
    <p class = "title">IMDB Votes</p>
    <p class = "subtitle is-4">${itemDetail.imdbVotes}</p>
  </article>
  `;
};
