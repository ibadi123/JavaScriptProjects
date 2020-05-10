const { hash } = window.location;
const message = atob(hash.replace("#", ""));

if(message){
    document.querySelector('#message-form').classList.add('hide');
    document.querySelector('#message-show').classList.remove('hide');

    document.querySelector('h1').innerHTML = message;
}

// Listening for a text //
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  const messageForm = document.querySelector("#message-form");
  messageForm.classList.add("hide");

  const linkForm = document.querySelector("#link-form");
  linkForm.classList.remove("hide");

  const input = document.querySelector("#message-input");
  const encodedText = btoa(input.value);

  const inputTwo = document.querySelector("#link-input");
  inputTwo.value = `${window.location}#${encodedText}`;
  inputTwo.select();
});
