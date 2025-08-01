import React, { useState, useEffect } from 'react';
import axios from 'axios';

const statusOptions = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

const TaskDashboard = ({ token, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskPortfolio, setNewTaskPortfolio] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('TODO');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskPortfolio, setEditTaskPortfolio] = useState('');
  const [editTaskStatus, setEditTaskStatus] = useState('TODO');
  const [error, setError] = useState('');

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { Authorization: `Bearer ${token}` }
  });

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newTaskPortfolio.trim()) {
      setError('Task portfolio cannot be empty');
      return;
    }
    try {
      await api.post('/tasks', { portfolio: newTaskPortfolio, status: newTaskStatus });
      setNewTaskPortfolio('');
      setNewTaskStatus('TODO');
      setError('');
      fetchTasks();
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const handleEditClick = (task) => {
    setEditTaskId(task.id);
    setEditTaskPortfolio(task.portfolio);
    setEditTaskStatus(task.status);
    setError('');
  };

  const handleEditSave = async () => {
    if (!editTaskPortfolio.trim()) {
      setError('Task portfolio cannot be empty');
      return;
    }
    try {
      await api.put(`/tasks/${editTaskId}`, { portfolio: editTaskPortfolio, status: editTaskStatus });
      setEditTaskId(null);
      setEditTaskPortfolio('');
      setEditTaskStatus('TODO');
      setError('');
      fetchTasks();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
      <h2 style={{ fontWeight: 'bold', color: '#333' }}>Task Dashboard</h2>
      <button onClick={onLogout} style={{ marginBottom: '1rem', fontWeight: 'bold', backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}>Logout</button>
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Task portfolio"
          value={newTaskPortfolio}
          onChange={(e) => setNewTaskPortfolio(e.target.value)}
          style={{ width: '60%', marginRight: '1rem', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <select
          value={newTaskStatus}
          onChange={(e) => setNewTaskStatus(e.target.value)}
          style={{ padding: '8px', marginRight: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <button
          onClick={handleAddTask}
          style={{ marginLeft: '1rem', padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
        >
          Add Task
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#ddd' }}>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>Status</th>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>Task Portfolio</th>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold', color: task.status === 'TODO' ? 'green' : task.status === 'COMPLETED' ? 'blue' : 'orange' }}>
                {task.status}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>{task.portfolio}</td>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                {editTaskId === task.id ? (
                  <>
                    <button onClick={handleEditSave} style={{ marginRight: '8px', padding: '6px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                      Save
                    </button>
                    <button onClick={() => setEditTaskId(null)} style={{ padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold' }}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditClick(task)} style={{ marginRight: '8px', padding: '6px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(task.id)} style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', fontWeight: 'bold' }}>No tasks found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskDashboard;
