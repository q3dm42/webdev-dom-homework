// modules/renderLogin.js
// отображение и обработка формы логина
import { loginUser, setToken, setUserName } from "./api.js";

export function renderLogin({ onLogin, onToRegister, errorMessage }) {
  const container = document.querySelector(".container");
  container.innerHTML = `
    <form class="login-form">
      <h2>Страница входа</h2>
      <input type="text" class="login-input login-name" placeholder="Введите логин" />
      <input type="password" class="login-input login-password" placeholder="Введите пароль" />
      <button class="login-button" type="submit">Войти</button>
      <div class="login-error" style="color: red; margin-top: 10px;">${errorMessage || ""}</div>
      <div style="margin-top: 10px;">
        <a href="#" class="to-registration-link">Нет аккаунта? Зарегистрируйтесь</a>
      </div>
    </form>
  `;
  // обработчик клика по кнопке входа
  // добавляем обработчик события submit на форму логина
  // для отслеживания нажатия Enter и клика по кнопке
  // при нажатии Enter или клике по кнопке отправки формы
  // если поля логина и пароля не заполнены, перерисовываем форму с сообщением об ошибке
  document
    .querySelector(".login-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const login = document.querySelector(".login-name").value.trim();
      const password = document.querySelector(".login-password").value.trim();
      if (!login || !password) {
        renderLogin({
          onLogin,
          onToRegister,
          errorMessage: "Введите логин и пароль",
        });
        return;
      }
      try {
        const data = await loginUser({ login, password });
        setToken(data.user.token);
        setUserName(data.user.name);
        // после успешного логина делаем window.location.reload(), не подходит для SPA но работает. иначе лента не прогружается
        window.location.reload();
      } catch (e) {
        renderLogin({ onLogin, onToRegister, errorMessage: e.message });
      }
    });

  document
    .querySelector(".to-registration-link")
    .addEventListener("click", (e) => {
      e.preventDefault();
      onToRegister();
    });
}
