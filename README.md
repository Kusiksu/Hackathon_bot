# Благотворительное приложение "Помощь"

Приложение для помощи нуждающимся. Позволяет создавать посты о сборе средств, делать пожертвования, общаться в чатах и отслеживать рейтинг самых активных помощников.

## Что это такое

Проект состоит из двух частей:

- **Backend** - API на Go, который обрабатывает все запросы, работает с базой данных и файлами
- **Frontend** - веб-интерфейс на React для пользователей

Вся инфраструктура поднимается через Docker Compose, так что запустить всё можно одной командой.

## Быстрый старт

Если у тебя установлен Docker и Docker Compose, то всё просто:

1. Скопируй `.env.example` в `.env` (если есть) и настрой переменные окружения. Или создай свой `.env` файл с примерно таким содержимым:

```env
PORT=8080
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=charity_db
POSTGRES_PORT=5432

MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_API_PORT=9000
MINIO_CONSOLE_PORT=9001
MINIO_BUCKET_NAME=files
MINIO_USE_SSL=false

JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_ACCESS_EXPIRY_HOURS=24
JWT_REFRESH_EXPIRY_DAYS=7
```

2. Запусти всё через docker-compose:

```bash
docker-compose up -d
```

Подожди немного, пока всё поднимется. Frontend на `http://localhost:8081`. Backend API: по умолчанию `http://localhost:8082` (переменная `BACKEND_HOST_PORT` в `.env`; внутри контейнера порт 8080). MinIO консоль на `http://localhost:9001` (логин/пароль из `.env`).

3. Проверь, что всё работает:

```bash
curl http://localhost:8082/health
```

Должен вернуться JSON со статусом.

Фронтенд в Docker собирается с `REACT_APP_API_*`, указывающими на `http://localhost:<BACKEND_HOST_PORT>`. Если поменял `BACKEND_HOST_PORT` в `.env`, пересобери образ: `docker compose build frontend-app --no-cache` и снова `docker compose up -d`.

## Что внутри

### Backend (Go)

API сервер на Go с использованием:

- **Gorilla Mux** для роутинга
- **PostgreSQL** для хранения всех данных
- **MinIO** для хранения файлов (фото, документы, медиа)
- **JWT** для аутентификации

Основные возможности:

- Регистрация и авторизация пользователей
- Создание и управление постами о сборе средств
- Система пожертвований с подтверждением
- Чаты между нуждающимися и помощниками
- Верификация пользователей (админы проверяют документы)
- Рейтинг самых активных помощников
- Загрузка и получение файлов через presigned URLs

Swagger документация доступна по адресу `/swagger/` после запуска.

### Frontend (React)

Веб-интерфейс на React. API клиент генерируется автоматически из OpenAPI спецификации (файл `doc.json`).

Для генерации API клиента (если что-то изменилось в backend):

```bash
cd frontend
npm run generate-api
```

## Разработка

### Локальная разработка backend

Если хочешь запускать backend локально без Docker:

1. Установи Go (нужна версия 1.21+)
2. Установи PostgreSQL и создай базу данных
3. Запусти MinIO (можно через Docker или локально)
4. Настрой `.env` файл в папке `backend/`
5. Запусти:

```bash
cd backend
go mod download
go run .
```

База данных инициализируется автоматически при первом запуске через `InitSchema()`.

### Локальная разработка frontend

```bash
cd frontend
npm install
npm start
```

Frontend запустится на `http://localhost:3000` (или другом порту, если 3000 занят).

## Структура проекта

```
.
├── backend/          # Go API сервер
│   ├── main.go      # Точка входа
│   ├── handlers.go  # HTTP обработчики
│   ├── models.go    # Модели данных
│   ├── auth.go      # JWT аутентификация
│   ├── database.go  # Работа с PostgreSQL
│   ├── minio.go     # Работа с MinIO
│   └── ...
├── frontend/         # React приложение
│   ├── src/
│   │   ├── components/  # React компоненты
│   │   ├── api/        # Сгенерированный API клиент
│   │   └── ...
│   └── ...
└── docker-compose.yaml  # Конфигурация для Docker
```

## UI-библиотека (Material UI)

Во фронтенде подключены **MUI** (`@mui/material`) и **Emotion** (стили, нужны MUI). Тема задаётся в `frontend/src/theme/muiTheme.js`, провайдер оборачивает приложение в `frontend/src/index.js`.

Пример использования компонентов — форма входа в `frontend/src/components/Login.jsx` (`TextField`, `Button`, `Alert`, `Paper`).

`CssBaseline` в `index.js` выравнивает базовые отступы браузера; если что-то в вёрстке «поедет», его можно временно убрать.

## CI/CD (GitHub Actions)

В репозитории есть workflow **`.github/workflows/ci.yml`**. Он запускается при push и pull request в ветки `main` и `master` и проверяет:

- **backend:** `go vet`, `go test`, `go build`
- **frontend:** `npm ci`, `npm run build`

Это **не деплой**, а проверка, что код собирается.

## API Endpoints

Основные эндпоинты (полный список в Swagger):

- `POST /api/v1/auth/register` - регистрация
- `POST /api/v1/auth/login` - вход
- `GET /api/v1/posts` - список постов
- `POST /api/v1/posts` - создать пост (требует авторизации)
- `POST /api/v1/donations` - сделать пожертвование
- `GET /api/v1/chats` - список чатов
- `POST /api/v1/chats/{id}/messages` - отправить сообщение
- `GET /api/v1/ratings` - рейтинг помощников

И так далее. Всё подробно описано в Swagger.

## Переменные окружения

Основные переменные, которые нужно настроить:

- `PORT` - порт процесса backend при локальном `go run` (по умолчанию 8080)
- `BACKEND_HOST_PORT` - порт API на хосте при `docker compose` (по умолчанию 8082, если 8080 занят)
- `DATABASE_URL` - строка подключения к PostgreSQL
- `MINIO_ENDPOINT` - адрес MinIO сервера
- `MINIO_ACCESS_KEY_ID` и `MINIO_SECRET_ACCESS_KEY` - ключи для MinIO
- `JWT_SECRET` - секретный ключ для JWT токенов (обязательно поменяй в продакшене!)

## Проблемы и решения

Если что-то не работает:

1. **База данных не подключается** - проверь, что PostgreSQL запущен и `DATABASE_URL` правильный
2. **MinIO ошибки** - убедись, что MinIO запущен и доступен по указанному адресу
3. **CORS ошибки** - проверь настройки CORS в `middleware.go` (должно быть настроено для frontend)
4. **Файлы не загружаются** - проверь, что buckets созданы в MinIO (должно создаваться автоматически)

---

Если что-то непонятно или нашёл баг - создавай issue или пиши напрямую. Код не идеален, но работает 😊
