// URL для получения и отправки комментариев (API v2)
const apiUrl = "https://wedev-api.sky.pro/api/v2/sergei-smirnov/comments";

// URL для логина пользователя (API v1)
const userUrl = "https://wedev-api.sky.pro/api/user/login";

// URL для регистрации пользователя (API v1)
const registerUrl = "https://wedev-api.sky.pro/api/user";

let token = null;
let userName = null;

// устанавливает новый токен в переменную и сохраняет его в localStorage
export function setToken(newToken) {
  token = newToken;
  localStorage.setItem("token", newToken);
}

// сохраняет состояние авторизации между сессиями
export function getToken() {
  if (!token) token = localStorage.getItem("token");
  return token;
}

// сохраняет имя пользователя в localStorage
export function setUserName(name) {
  userName = name;
  localStorage.setItem("userName", name);
}

// функция getUserName возвращает имя пользователя или пытается получить его из localStorage
export function getUserName() {
  if (!userName) userName = localStorage.getItem("userName");
  return userName;
}

// GET-запрос для получения списка комментариев
// если токен установлен, он передается в заголовках запроса для авторизации
export async function fetchComments() {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (response.status === 500) {
      throw new Error("Сервер сломался, попробуй позже");
    }
    return response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Кажется, у вас сломался интернет, попробуйте позже");
    }
    throw error;
  }
}

// POST-запрос для добавления нового комментария с наличием токена авторизации.
export async function postComment(text) {
  if (!token) throw new Error("Нет токена авторизации");
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });
    // обработка ошибок по статусам
    if (response.status === 400) {
      const data = await response.json();
      throw new Error(data.message || "Некорректные данные");
    }
    if (response.status === 500) {
      throw new Error("Сервер сломался, попробуй позже");
    }
    if (response.status === 201) {
      return response.json();
    }
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Кажется, у вас сломался интернет, попробуйте позже");
    }
    throw error;
  }
}

// POST-запрос для авторизации пользователя по логину и паролю с проверкой на 400 ошибку.
export async function loginUser({ login, password }) {
  const response = await fetch(userUrl, {
    method: "POST",
    body: JSON.stringify({ login, password }),
  });
  if (response.status === 400) {
    throw new Error("Неверный логин или пароль");
  }
  const data = await response.json();
  return data;
}

// POST-запрос для регистрации нового пользователя с проверкой на 400 ошибку.
export async function registerUser({ login, name, password }) {
  const response = await fetch(registerUrl, {
    method: "POST",
    body: JSON.stringify({ login, name, password }),
  });
  if (response.status === 400) {
    throw new Error("Пользователь с таким логином уже существует");
  }
  const data = await response.json();
  return data;
}
