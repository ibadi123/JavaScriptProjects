const btn = document.querySelector("button");
const start = () => {
  btn.innerText = "Click Me!";
  document.body.style.background = "#fff";
  const height = Math.floor(Math.random() * window.innerWidth);
  const width = Math.floor(Math.random() * window.innerHeight);
  btn.style.left = `${width}px`;
  btn.style.top = `${height}px`;
};

const win = () => {
  btn.innerHTML = "YOU WONN!";
  document.body.style.backgroundColor = "green";
  btn.style.top = "10px";
  btn.style.left = "50%";
  btn.style.position = "fixed";
};

btn.addEventListener("mouseover", start);
btn.addEventListener("click", win);
