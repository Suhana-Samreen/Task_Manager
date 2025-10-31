import React, { useState } from 'react';

const initial = { title:'', description:'', priority:'Medium', due_date:'' };

export default function TaskForm({ onCreate }) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.title) return alert('Title required');
      if (!payload.due_date) delete payload.due_date;
      await onCreate(payload);
      setForm(initial);
    } catch (err) {
      console.error(err);
      alert('Failed to create task');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
      <h3>Add Task</h3>
      <div>
        <input placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required style={{ width:'100%' }} />
      </div>
      <div style={{ marginTop:8 }}>
        <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} style={{ width:'100%' }} />
      </div>
      <div style={{ marginTop:8, display:'flex', gap:8 }}>
        <select value={form.priority} onChange={e=>setForm({...form, priority:e.target.value})}>
          <option>Low</option><option>Medium</option><option>High</option>
        </select>
        <input value={form.due_date} onChange={e=>setForm({...form, due_date:e.target.value})} type="date" />
        <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add'}</button>
      </div>
    </form>
  );
}
