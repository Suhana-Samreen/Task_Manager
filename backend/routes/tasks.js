const express = require('express');
const { body, validationResult, query, param } = require('express-validator');
const { getDb } = require('../db');
const router = express.Router();

router.post('/',
  [
    body('title').isString().isLength({ min: 1, max: 200 }),
    body('priority').isIn(['Low', 'Medium', 'High']),
    body('due_date').optional({ nullable: true }).isISO8601().toDate()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description = '', priority, due_date } = req.body;
    const db = getDb();
    const sql = `INSERT INTO tasks (title, description, priority, due_date, created_at, updated_at, status)
                 VALUES (?, ?, ?, ?, datetime('now'), datetime('now'), 'Open')`;
    db.run(sql, [title, description, priority, due_date ? new Date(due_date).toISOString().slice(0,10) : null], function(err) {
      if (err) {
        db.close();
        return res.status(500).json({ error: err.message });
      }
      const id = this.lastID;
      db.get('SELECT * FROM tasks WHERE id = ?', [id], (err2, row) => {
        db.close();
        if (err2) return res.status(500).json({ error: err2.message });
        res.status(201).json({ task: row });
      });
    });
  }
);

router.get('/',
  [
    query('status').optional().isIn(['Open','In Progress','Done']),
    query('priority').optional().isIn(['Low','Medium','High']),
    query('sort').optional().isIn(['due_asc','due_desc'])
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { status, priority, sort } = req.query;
    const db = getDb();
    let sql = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];
    if (status) { sql += ' AND status = ?'; params.push(status); }
    if (priority) { sql += ' AND priority = ?'; params.push(priority); }
    if (sort === 'due_asc') sql += ' ORDER BY due_date IS NULL, due_date ASC';
    else if (sort === 'due_desc') sql += ' ORDER BY due_date IS NULL, due_date DESC';
    else sql += ' ORDER BY due_date IS NULL, due_date ASC, created_at DESC';

    db.all(sql, params, (err, rows) => {
      db.close();
      if (err) return res.status(500).json({ error: err.message });
      res.json({ tasks: rows });
    });
  }
);

router.patch('/:id',
  [
    param('id').isInt(),
    body('status').optional().isIn(['Open','In Progress','Done']),
    body('priority').optional().isIn(['Low','Medium','High'])
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const id = req.params.id;
    const { status, priority } = req.body;
    if (!status && !priority) return res.status(400).json({ error: 'Provide status or priority to update' });

    const db = getDb();
    const sets = [];
    const params = [];
    if (status) { sets.push('status = ?'); params.push(status); }
    if (priority) { sets.push('priority = ?'); params.push(priority); }
    sets.push("updated_at = datetime('now')");

    const sql = `UPDATE tasks SET ${sets.join(', ')} WHERE id = ?`;
    params.push(id);

    db.run(sql, params, function(err) {
      if (err) {
        db.close();
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        db.close();
        return res.status(404).json({ error: 'Task not found' });
      }
      db.get('SELECT * FROM tasks WHERE id = ?', [id], (err2, row) => {
        db.close();
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ task: row });
      });
    });
  }
);

module.exports = router;
