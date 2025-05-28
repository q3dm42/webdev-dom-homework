// modules/main.js
import { fetchComments } from "./api.js";
import { renderComments } from "./render.js";
import { initializeForm } from "./formHandlers.js";
import { formatComments } from "./helpers.js";
import { setComments, commentsArray } from "./commentsData.js";

const loadingMessage = document.querySelector(".loading-message");

document.addEventListener("DOMContentLoaded", async () => {
  loadingMessage.classList.add("active");

  try {
    const data = await fetchComments();
    setComments(formatComments(data.comments));
    renderComments(commentsArray);
  } catch (error) {
    alert(error.message);
    console.error(error);
  } finally {
    loadingMessage.classList.remove("active");
  }

  initializeForm();
});
