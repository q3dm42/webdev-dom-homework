// modules/render.js
import { getUserName } from "./api.js";

const commentsList = document.querySelector(".comments");

// рендеринг списка комментариев
export function renderComments(commentsArray, { isAuthorized, onAuthClick }) {
  commentsList.innerHTML = "";

  commentsArray.forEach((comment, index) => {
    const li = document.createElement("li");
    li.classList.add("comment");
    li.innerHTML = `
      <div class="comment-header">
        <div>${comment.name}</div>
        <div>${comment.date}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text">${comment.text}</div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${comment.likes}</span>
          <button class="like-button${comment.liked ? " -active-like" : ""}" data-index="${index}"></button>
        </div>
      </div>
    `;
    commentsList.appendChild(li);
  });

  // если не авторизован, показать ссылку на авторизацию и скрыть форму
  const addForm = document.querySelector(".add-form");
  if (!isAuthorized) {
    if (addForm) addForm.style.display = "none";
    const container = document.querySelector(".container");
    let authLink = document.querySelector(".auth-link");
    if (!authLink) {
      const p = document.createElement("p");
      p.innerHTML = `Чтобы добавить комментарий, <a href="#" class="auth-link">авторизуйтесь</a>`;

      if (addForm && addForm.parentNode) {
        addForm.parentNode.insertBefore(p, addForm);
      } else {
        container.appendChild(p);
      }
      p.querySelector(".auth-link").addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelectorAll("p .auth-link").forEach((el) => {
          el.parentElement.remove();
        });
        onAuthClick();
      });
    }
  } else {
    if (addForm) {
      addForm.style.display = "";
      // имя readonly и value из getUserName
      const nameInput = addForm.querySelector(".add-form-name");
      if (nameInput) {
        nameInput.value = getUserName() || "";
        nameInput.setAttribute("readonly", "readonly");
      }
    }
    // удалить ссылку на авторизацию если есть
    const authLinkP = document.querySelector("p .auth-link")?.parentElement;
    if (authLinkP) authLinkP.remove();
  }
}
