import { postComment, fetchComments } from "./api.js";
import { renderComments } from "./render.js";
import { formatComments, clearInputFields, checkFields } from "./helpers.js";
import { sanitizeInput } from "./sanitize.js";
import { commentsArray, setComments } from "./commentsData.js";

// получение ссылок на элементы формы
// const commentForm = document.querySelector(".add-form");
const addButton = document.querySelector(".add-form-button");
const nameInput = document.querySelector(".add-form-name");
const textInput = document.querySelector(".add-form-text");
const addingMessage = document.querySelector(".adding-message");

// обработчики событий для ввода имени и текста комментария
export function initializeForm() {
  nameInput.addEventListener("input", updateButtonState);
  textInput.addEventListener("input", updateButtonState);
  addButton.addEventListener("click", checkSubmit);
  textInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter" && event.shiftKey) {
      checkSubmit();
      event.preventDefault();
    }
  });
}

// проверка и отправка формы
function checkSubmit() {
  if (checkFields(nameInput, textInput)) {
    const inputValue = sanitizeInput(nameInput.value);
    const areaFormValue = sanitizeInput(textInput.value);

    addingMessage.classList.add("active");
    addButton.disabled = true;

    postComment(inputValue, areaFormValue)
      .then(() => {
        clearInputFields(nameInput, textInput, updateButtonState);
        return fetchComments();
      })
      .then((data) => {
        setComments(formatComments(data.comments));
        renderComments(commentsArray);
      })
      .finally(() => {
        addingMessage.classList.remove("active");
        addButton.disabled = false;
      })
      .catch((error) => {
        console.error("Ошибка при добавлении комментария:", error);
        addButton.disabled = false;
        alert(error.message);
      });
  } else {
    alert(
      "Имя должно быть не короче 3-х символов и комментарий не должен быть пустым."
    );
  }
}

// обновление состояния кнопки отправки
export function updateButtonState() {
  addButton.disabled = !checkFields(nameInput, textInput);
}
