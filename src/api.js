const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Milestones API
export const milestonesAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/milestones`);
    if (!res.ok) throw new Error('Failed to fetch milestones');
    return res.json();
  },
  
  create: async (milestone) => {
    const res = await fetch(`${API_BASE}/milestones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(milestone)
    });
    if (!res.ok) throw new Error('Failed to create milestone');
    return res.json();
  },
  
  update: async (milestone) => {
    const res = await fetch(`${API_BASE}/milestones`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(milestone)
    });
    if (!res.ok) throw new Error('Failed to update milestone');
    return res.json();
  },
  
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/milestones?id=${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete milestone');
  }
};

// Billing API
export const billingAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/billing`);
    if (!res.ok) throw new Error('Failed to fetch billing');
    return res.json();
  },
  
  create: async (item) => {
    const res = await fetch(`${API_BASE}/billing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to create billing item');
    return res.json();
  },
  
  update: async (item) => {
    const res = await fetch(`${API_BASE}/billing`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to update billing item');
    return res.json();
  },
  
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/billing?id=${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete billing item');
  }
};

// Comments API
export const commentsAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/comments`);
    if (!res.ok) throw new Error('Failed to fetch comments');
    return res.json();
  },
  
  create: async (comment) => {
    const res = await fetch(`${API_BASE}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment)
    });
    if (!res.ok) throw new Error('Failed to create comment');
    return res.json();
  },
  
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/comments?id=${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete comment');
  }
};

// Settings API
export const settingsAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },
  
  update: async (key, value) => {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
    if (!res.ok) throw new Error('Failed to update setting');
    return res.json();
  }
};
