// modules/main.js
import { fetchComments } from "./api.js";
import { renderComments } from "./render.js";
import { initializeForm } from "./formHandlers.js";
import { formatComments } from "./helpers.js";
import { setComments, commentsArray } from "./commentsData.js";

const loadingMessage = document.querySelector(".loading-message");

document.addEventListener("DOMContentLoaded", () => {
  loadingMessage.classList.add("active");

  fetchComments()
    .then((data) => {
      setComments(formatComments(data.comments));
      renderComments(commentsArray);
    })
    .catch((error) => {
      alert("Ошибка загрузки комментариев");
      console.error(error);
    })
    .finally(() => loadingMessage.classList.remove("active"));

  initializeForm();
});