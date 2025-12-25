# 📝 AngularJS To-Do Application with Analytics & Smart Suggestions

This is a **single-page To-Do application built using AngularJS (1.x)**, converted to a **routing-based SPA structure** similar to Angular routing concepts.

It includes:
- Task management (CRUD)
- Analytics dashboard
- Smart suggestions page
- Mock REST API using `json-server`

---

## 🚀 Features

### ✅ To-Do Management
- Add, edit, delete tasks
- Mark tasks as completed
- Persist data using REST API

### 📊 Analytics
- Total tasks
- Completed vs Pending tasks
- Productivity insights

### 💡 Smart Suggestions
- Suggests actions based on:
  - Pending tasks
  - Completion trends
  - Productivity patterns
- Separate routed page (SPA style)

### 🧭 AngularJS Routing
- Single `index.html`
- Page navigation using `ngRoute`
- Clean MVC folder structure

---

## 🗂️ Project Structure

todo-angularjs-api/
│
├── API/
│ └── db.json
│
├── Controllers/
│ ├── todoController.js
│ ├── analyticsController.js
│ └── suggestionsController.js
│
├── Services/
│ └── apiService.js
│
├── CSS/
│ └── style.css
│
├── views/
│ ├── todo.html
│ ├── analytics.html
│ └── suggestions.html
│
├── app.js
├── index.html
├── .gitignore
└── README.md