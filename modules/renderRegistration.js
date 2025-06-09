// modules/renderRegistration.js

// отрисовка формы регистрации и обработка событий регистрации пользователя.
import { registerUser, setToken, setUserName } from "./api.js";

// функция renderRegistration принимает объект параметров с двумя callback-функциями (onRegister, onToLogin)
// и строкой errorMessage для вывода возможной ошибки.
export function renderRegistration({ onRegister, onToLogin, errorMessage }) {
  //  контейнер с формой регистрации
  const container = document.querySelector(".container");
  container.innerHTML = `
    <div class="registration-form">
      <h2>Регистрация нового пользователя</h2>
      <input type="text" class="registration-input registration-name" placeholder="Введите имя" />
      <input type="text" class="registration-input registration-login" placeholder="Введите логин" />
      <input type="password" class="registration-input registration-password" placeholder="Введите пароль" />
      <button class="registration-button">Зарегистрироваться</button>
      <div class="registration-error" style="color: red; margin-top: 10px;">${errorMessage || ""}</div>
      <div style="margin-top: 10px;">
        <a href="#" class="to-login-link">Уже есть аккаунт? Войти</a>
      </div>
    </div>
  `;

  // обработчик клика по кнопке регистрации
  document
    .querySelector(".registration-button")
    .addEventListener("click", async () => {
      // читаем введенные данные
      const name = document.querySelector(".registration-name").value.trim();
      const login = document.querySelector(".registration-login").value.trim();
      const password = document
        .querySelector(".registration-password")
        .value.trim();

      // проверка на заполненность полей с повторной отрисовкой формы с сообщением об ошибке
      if (!name || !login || !password) {
        renderRegistration({
          onRegister,
          onToLogin,
          errorMessage: "Все поля обязательны",
        });
        return;
      }
      try {

        // обращение к API для регистрации пользователя с введенными данными
        const data = await registerUser({ name, login, password });
        // сохраняем полученный токен и имя пользователя
        setToken(data.user.token);
        setUserName(data.user.name);
        // после успешной регистрации — перезагрузка страницы (SPA не получилось пока)
        window.location.reload();
      } catch (e) {
        // в случае ошибки от API, перерисовываем форму с сообщением об ошибке
        renderRegistration({ onRegister, onToLogin, errorMessage: e.message });
      }
    });

  // обработчик клика по ссылке перехода на страницу входа
  document.querySelector(".to-login-link").addEventListener("click", (e) => {
    e.preventDefault();
    onToLogin();
  });
}
