function isTouching(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();

  return !(
    aRect.top + aRect.height < bRect.top ||
    aRect.top > bRect.top + bRect.height ||
    aRect.left + aRect.width < bRect.left ||
    aRect.left > bRect.left + bRect.width
  );
}

const avatar = document.querySelector("#player");
const coin = document.querySelector('#coin')

window.addEventListener("keyup", function (e) {
  if (e.key === "ArrowDown" || e.key === "Down") {
    const currentTop = extractPos(getComputedStyle(avatar).top);
    avatar.style.top = `${currentTop + 50}px`;
  } else if (e.key === "ArrowUp" || e.key === "Up") {
    const currentTop = extractPos(getComputedStyle(avatar).top);
    avatar.style.top = `${currentTop - 50}px`;
  } else if (e.key === "ArrowRight" || e.key === "Right") {
    console.log(e);
    const currentLeft = extractPos(getComputedStyle(avatar).left);
	avatar.style.left = `${currentLeft + 50}px`;
	avatar.style.transform = 'scale(1,1)';
  } else if (e.key === "ArrowLeft" || e.key === "Left") {
    console.log(e);
    const currentLeft = extractPos(getComputedStyle(avatar).left);
	avatar.style.left = `${currentLeft - 50}px`;
	avatar.style.transform = 'scale(-1,1)';
  }
  if(isTouching(avatar, coin)) moveCoin() ;
});

const extractPos = (pos) => {
  let num = parseInt(pos.slice(0, -2));
  return num;
};

const moveCoin = () => {
	const y = Math.floor(Math.random() * window.innerHeight);
	const x = Math.floor(Math.random() * window.innerWidth);
	coin.style.top = `${y}px`;
	coin.style.left = `${x}px`;
}

moveCoin();
