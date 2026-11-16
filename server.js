import express from "express";

const app = express();
app.use(express.json());

// Дані зберігаються в пам'яті (після перезапуску очищаються)
let tasks = [];
let nextId = 1;

// Отримати всі задачі
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Створити задачу
app.post("/tasks", (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "title обов'язковий" });
  }
  const task = { id: nextId++, title, done: false };
  tasks.push(task);
  res.status(201).json(task);
});

// Оновити задачу (title та/або done)
app.patch("/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: "Задачу не знайдено" });
  }
  if (req.body.title !== undefined) task.title = req.body.title;
  if (req.body.done !== undefined) task.done = Boolean(req.body.done);
  res.json(task);
});

// Видалити задачу
app.delete("/tasks/:id", (req, res) => {
  const index = tasks.findIndex((t) => t.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "Задачу не знайдено" });
  }
  tasks.splice(index, 1);
  res.status(204).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер працює: http://localhost:${PORT}`);
});