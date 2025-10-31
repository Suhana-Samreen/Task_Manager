const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');
const insightsRouter = require('./routes/insights');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/tasks', tasksRouter);
app.use('/insights', insightsRouter);

app.get('/', (req, res) => res.json({ ok: true, message: 'Task Tracker API' }));
app.post('/tasks', (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  const query = `INSERT INTO tasks (title, description, priority, dueDate) VALUES (?, ?, ?, ?)`;
  db.run(query, [title, description, priority, dueDate], function (err) {
    if (err) {
      console.error('Error inserting task:', err);
      res.status(500).json({ error: 'Failed to create task' });
    } else {
      res.json({ id: this.lastID });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
