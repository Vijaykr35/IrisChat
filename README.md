
# 💬 Chatter - Real-Time Chat App

A full-stack modern **real-time chat application** with **emoji support**, built using **React**, **Node.js**, **Express**, and **Socket.IO**.

---

## 🚀 Features

* ⚡ Real-time messaging with **Socket.IO**
* 😀 **Emoji** picker integration
* 🔐 User **authentication** (JWT)
* 💬 One-on-one & group messaging support
* 🧠 State management using **Redux**
* 🌈 Clean, responsive UI with **TailwindCSS**
* 🌐 REST API using **Express + MongoDB**
* 📡 Auto socket reconnect on disconnect

---

## 🗂️ Folder Structure

```
chatter/
├── backend/
│   ├── config/
│   ├── controllers/
│   │   ├── messageController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   └── isAuthenticated.js
│   ├── models/
│   ├── routes/
│   │   ├── messageRoute.js
│   │   └── userRoute.js
│   ├── socket/
│   ├── .env
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── .gitignore
│
├── frontend/
│   ├── public/
│   │   ├── bg.jpg
│   │   ├── chatter.png
│   │   └── chatter.ico
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Message.jsx
│   │   │   ├── MessageContainer.jsx
│   │   │   ├── OtherUser.jsx
│   │   │   ├── SendMessage.jsx
│   │   │   └── Signup.jsx
│   │   ├── hooks/
│   │   ├── redux/
│   │   ├── socket/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── README.md

```

---

## 🔧 Installation

```bash
# Clone the project
git clone https://github.com/Vijaykr35/chatapp.git
cd Chatter

# Backend setup
cd backend
npm install
cp .env.example .env  # Fill in Mongo URI, JWT_SECRET
npm start

# Frontend setup
cd ../frontend
npm install
npm run dev
```

---

## 🧪 Example Usage

* 🔐 Register & login users
* 💬 Start chatting instantly
* 😄 Use emoji picker to send expressive messages
* 🌐 All updates sync in **real-time** with **Socket.IO**

---

## 📸 Screenshots

| Login Page
| -------------------------------------
| ![Login](frontend/public/image.png) |
| Signup
| -------------------------------------|
| ![Signup](frontend/public/signup.png) |

| Chat UI                         |
| ------------------------------- |
 ![Chat](frontend/public/chat.png) |
 ![lightMode](frontend/public/lightMode.png)

---

## 🛠️ Tech Stack

| Layer     | Technology                         |
| --------- | ---------------------------------- |
| Frontend  | React, TailwindCSS, Redux, Vite    |
| Backend   | Node.js, Express, MongoDB          |
| Real-time | Socket.IO                          |
| Auth      | JWT                                |
| Emoji     | `emoji-picker-react` (example lib) |

---

## @VijayKumar
