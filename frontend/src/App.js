import React, { useEffect, useState } from 'react';
import API from './api';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import InsightsPanel from './components/InsightsPanel';

function App() {
  const [tasks, setTasks] = useState([]);
  const [insights, setInsights] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '', sort: 'due_asc' });

  const fetchTasks = async () => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.sort) params.sort = filters.sort;
    const resp = await API.get('/tasks', { params });
    setTasks(resp.data.tasks || []);
  };

  const fetchInsights = async () => {
    const resp = await API.get('/insights');
    setInsights(resp.data);
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const onCreate = async (task) => {
    await API.post('/tasks', task);
    await fetchTasks();
    await fetchInsights();
  };

  const onUpdate = async (id, patch) => {
    await API.patch(`/tasks/${id}`, patch);
    await fetchTasks();
    await fetchInsights();
  };

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Task Manager</h1>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <TaskForm onCreate={onCreate} />
          <div style={{ marginTop: 20 }}>
            <h3>Filters</h3>
            <label>
              Status:
              <select value={filters.status} onChange={e => setFilters(s => ({...s, status: e.target.value}))}>
                <option value=''>All</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </label>
            <label style={{ marginLeft: 10 }}>
              Priority:
              <select value={filters.priority} onChange={e => setFilters(s => ({...s, priority: e.target.value}))}>
                <option value=''>All</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>
            <label style={{ marginLeft: 10 }}>
              Sort:
              <select value={filters.sort} onChange={e => setFilters(s => ({...s, sort: e.target.value}))}>
                <option value='due_asc'>Due (asc)</option>
                <option value='due_desc'>Due (desc)</option>
              </select>
            </label>
          </div>
        </div>
        <div style={{ width: 320 }}>
          <InsightsPanel insights={insights} onRefresh={fetchInsights} />
        </div>
      </div>

      <TaskList tasks={tasks} onUpdate={onUpdate} />
    </div>
  );
}

export default App;
