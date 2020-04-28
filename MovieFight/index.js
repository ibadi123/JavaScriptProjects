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
  // Adding class right after we get the results //

  dropdown.classList.add("is-active");

  // Intializing a for loop to add each result to HTML //

  for (let movie of movies) {
    // Creating a element, adding class & some html inside it //

    const option = document.createElement("a");
    option.classList.add("dropdown-item");
    option.innerHTML = `
      <img src = '${movie.Poster}'/>
      ${movie.Title}
      `;
    // Appending each movie inside the "results" class div //

    resultsWrapper.appendChild(option);
  }
};

// Adding Event Listener to Search Input //

searchInput.addEventListener("input", debounce(onInput, 500));

// Selecting Search Input, DropDown & Results Div & Adding Event Listener //

const searchInput = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");
