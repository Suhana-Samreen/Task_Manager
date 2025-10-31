import React from 'react';

export default function TaskList({ tasks, onUpdate }) {
  if (!tasks) return null;
  return (
    <div style={{ marginTop: 20 }}>
      <h3>Tasks ({tasks.length})</h3>
      {tasks.length === 0 && <div>No tasks yet</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(t => (
          <li key={t.id} style={{ border: '1px solid #eee', padding: 8, marginBottom:8, borderRadius:6 }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <strong>{t.title}</strong>
              <small>{t.due_date || 'No due'}</small>
            </div>
            <div>{t.description}</div>
            <div style={{ marginTop:6 }}>
              <label>
                Status:
                <select value={t.status} onChange={e=>onUpdate(t.id, { status: e.target.value })}>
                  <option>Open</option><option>In Progress</option><option>Done</option>
                </select>
              </label>
              <label style={{ marginLeft: 8 }}>
                Priority:
                <select value={t.priority} onChange={e=>onUpdate(t.id, { priority: e.target.value })}>
                  <option>Low</option><option>Medium</option><option>High</option>
                </select>
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
