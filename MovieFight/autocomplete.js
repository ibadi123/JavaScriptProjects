const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  root.innerHTML = `
<label><b>Search</b></label>
<input class = "input"/>
<div class = "dropdown">
    <div class = "dropdown-menu">
        <div class = "dropdown-content results"></div>
    </div>
</div>
`;

  const searchInput = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  const onInput = async (event) => {
    const items = await fetchData(event.target.value);

    // Checking if items variable has any data //

    if (!items.length) {
      dropdown.classList.remove("is-active");
      return;
    }

    // Clearing Previous Results //

    resultsWrapper.innerHTML = "";

    // Adding class right after we get the results //

    dropdown.classList.add("is-active");

    // Intializing a for loop to add each result to HTML //

    for (let item of items) {
      // Creating a element, adding class & some html inside it //

      const option = document.createElement("a");

      option.classList.add("dropdown-item");
      option.innerHTML = renderOption(item);

      option.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        searchInput.value = inputValue(item);
        onOptionSelect(item);
      });
      // Appending each item inside the "results" class div //

      resultsWrapper.appendChild(option);
    }
  };
  searchInput.addEventListener("input", debounce(onInput, 500));

  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
