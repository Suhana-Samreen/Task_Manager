const express = require('express');
const { getDb } = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
  const db = getDb();
  db.all('SELECT id, title, priority, status, due_date FROM tasks', [], (err, rows) => {
    db.close();
    if (err) return res.status(500).json({ error: err.message });

    const total = rows.length;
    const byPriority = { Low:0, Medium:0, High:0 };
    const byStatus = { Open:0, 'In Progress':0, Done:0 };
    const dueCountsByDay = {};
    const today = new Date();
    today.setHours(0,0,0,0);
    const dueSoonThreshold = new Date(today);
    dueSoonThreshold.setDate(today.getDate() + 3);

    let dueSoonCount = 0;
    rows.forEach(r => {
      if (r.priority) byPriority[r.priority] = (byPriority[r.priority] || 0) + 1;
      if (r.status) byStatus[r.status] = (byStatus[r.status] || 0) + 1;
      if (r.due_date) {
        dueCountsByDay[r.due_date] = (dueCountsByDay[r.due_date] || 0) + 1;
        const d = new Date(r.due_date + 'T00:00:00');
        if (!isNaN(d) && d <= dueSoonThreshold && d >= today) dueSoonCount++;
      }
    });

    let busiestDay = null;
    let maxCount = 0;
    for (const [date, count] of Object.entries(dueCountsByDay)) {
      if (count > maxCount) {
        maxCount = count;
        busiestDay = date;
      }
    }

    let dominantPriority = 'None';
    const sortedPriorities = Object.entries(byPriority).sort((a,b) => b[1] - a[1]);
    if (sortedPriorities[0] && sortedPriorities[0][1] > 0) dominantPriority = sortedPriorities[0][0];

    const summaryParts = [];
    summaryParts.push(`You have ${total} tasks total.`);
    if (dominantPriority !== 'None') summaryParts.push(`Most tasks are ${dominantPriority} priority.`);
    if (dueSoonCount > 0) summaryParts.push(`${dueSoonCount} task(s) are due within 3 days.`);
    if (busiestDay) summaryParts.push(`Busiest due date: ${busiestDay} with ${maxCount} task(s).`);
    const summary = summaryParts.join(' ');

    res.json({
      summary,
      total,
      byPriority,
      byStatus,
      dueSoonCount,
      busiestDay,
      busiestDayCount: maxCount
    });
  });
});

module.exports = router;
