import React, { useState, useEffect } from 'react';
import { useStackApp, useUser } from '@stackframe/react';
import { Check, Circle, Zap, Edit2, Save, Plus, Trash2, ChevronDown, ChevronUp, MessageSquare, Image as ImageIcon, Upload, X } from 'lucide-react';
import { milestonesAPI, billingAPI, commentsAPI, settingsAPI } from './api';
import Calendar from './Calendar';

export default function MigrationTracker() {
  const app = useStackApp();
  const user = useUser();
  const [milestones, setMilestones] = useState([]);
  const [billing, setBilling] = useState([]);
  const [comments, setComments] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(6);
  const [targetLaunch, setTargetLaunch] = useState('Dec 20');
  const [projectTitle, setProjectTitle] = useState('Website Migration Progress');
  const [projectSubtitle, setProjectSubtitle] = useState('Tracking our journey from Avada to a custom WordPress Block Theme on Hostinger');
  
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [editingBilling, setEditingBilling] = useState(null);
  const [editingProject, setEditingProject] = useState(false);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [showAddBilling, setShowAddBilling] = useState(false);
  const [showAddComment, setShowAddComment] = useState(false);
  const [expandedSection, setExpandedSection] = useState({ milestones: true, billing: true, comments: true });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [milestonesData, billingData, commentsData, settingsData] = await Promise.all([
        milestonesAPI.getAll(),
        billingAPI.getAll(),
        commentsAPI.getAll(),
        settingsAPI.getAll()
      ]);
      
      setMilestones(milestonesData.map(m => ({
        ...m,
        billingStatus: m.billing_status,
        completedDate: m.completed_date,
        targetDate: m.target_date
      })));
      setBilling(billingData);
      setComments(commentsData);
      
      if (settingsData.current_week) setCurrentWeek(parseInt(settingsData.current_week));
      if (settingsData.target_launch) setTargetLaunch(settingsData.target_launch);
      if (settingsData.project_title) setProjectTitle(settingsData.project_title);
      if (settingsData.project_subtitle) setProjectSubtitle(settingsData.project_subtitle);
      
      setError(null);
    } catch (err) {
      console.error('Failed to load data from API, using local fallback:', err);
      // Use local fallback data for development
      setMilestones([
        { id: 1, title: 'Phase 1: Discovery & Planning', description: 'Brand analysis, requirements gathering, and project roadmap creation', status: 'completed', completedDate: 'Nov 1', billingStatus: 'billed' },
        { id: 2, title: 'Phase 2: Design System & Brand Guide', description: 'Color palette, typography, component library, and UI documentation', status: 'completed', completedDate: 'Nov 8', billingStatus: 'billed' },
        { id: 3, title: 'Phase 3: WordPress Theme Setup', description: 'Block theme structure, theme.json configuration, Hostinger deployment', status: 'completed', completedDate: 'Nov 15', billingStatus: 'billed' },
        { id: 4, title: 'Phase 4: Header, Hero & Footer', description: 'Core layout components with animations and responsive design', status: 'completed', completedDate: 'Nov 22', billingStatus: 'billed' },
        { id: 5, title: 'Phase 5: Episodes Plugin', description: 'Custom post type, video integration, and episode archive templates', status: 'completed', completedDate: 'Nov 29', billingStatus: 'due' },
        { id: 6, title: 'Phase 6: Content Migration', description: 'Migrating existing content, media optimization, and SEO preservation', status: 'in-progress', targetDate: 'Dec 6', billingStatus: 'pending' },
        { id: 7, title: 'Phase 7: Testing & QA', description: 'Cross-browser testing, performance optimization, accessibility audit', status: 'upcoming', targetDate: 'Dec 13', billingStatus: 'pending' },
        { id: 8, title: 'Phase 8: Launch & Handoff', description: 'DNS migration, final deployment, training, and documentation', status: 'upcoming', targetDate: 'Dec 20', billingStatus: 'pending' },
      ]);
      setBilling([
        { id: 1, name: 'Phase 1-2 Deposit', date: 'Nov 1, 2024', amount: 1500, status: 'paid' },
        { id: 2, name: 'Phase 3-4 Milestone', date: 'Nov 22, 2024', amount: 1500, status: 'paid' },
        { id: 3, name: 'Phase 5-6 Milestone', date: 'Dec 6, 2024', amount: 1500, status: 'pending' },
        { id: 4, name: 'Final Payment', date: 'Dec 20, 2024', amount: 1500, status: 'upcoming' },
      ]);
      setComments([
        { id: 1, author: 'Ryan', role: 'vendor', text: 'Initial project setup complete. Ready for design review.', date: 'Nov 1, 2024', image: null },
        { id: 2, author: 'Client', role: 'client', text: 'Love the new color palette! Can we make the red a bit darker?', date: 'Nov 9, 2024', image: null }
      ]);
      setError('Running in development mode with local data. Deploy to Vercel to use database.');
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (type, id) => {
    setExpandedSection(prev => ({ ...prev, [type === 'milestone' ? 'milestones' : 'billing']: true }));
    setTimeout(() => {
      const element = document.getElementById(`${type}-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.style.backgroundColor = '#FFF8F0';
        setTimeout(() => element.style.backgroundColor = 'white', 2000);
      }
    }, 100);
  };

  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const totalCount = milestones.length;
  const progress = Math.round((completedCount / totalCount) * 100);
  const tasksCompleted = completedCount * 3 + (milestones.some(m => m.status === 'in-progress') ? 2 : 0);

  const paidAmount = billing.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0);
  const totalAmount = billing.reduce((sum, b) => sum + b.amount, 0);
  const remainingAmount = totalAmount - paidAmount;

  const updateMilestoneStatus = async (id, newStatus) => {
    const milestone = milestones.find(m => m.id === id);
    const updatedMilestone = {
      ...milestone,
      status: newStatus,
      completed_date: newStatus === 'completed' ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : milestone.completed_date
    };
    try {
      await milestonesAPI.update(updatedMilestone);
      setMilestones(milestones.map(m => m.id === id ? { ...m, status: newStatus, completedDate: updatedMilestone.completed_date } : m));
    } catch (err) {
      console.error('Failed to update milestone:', err);
    }
  };

  const updateBillingStatus = async (id, newStatus) => {
    const item = billing.find(b => b.id === id);
    try {
      await billingAPI.update({ ...item, status: newStatus });
      setBilling(billing.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (err) {
      console.error('Failed to update billing:', err);
    }
  };

  const saveMilestoneEdit = async (id, updates) => {
    const milestone = milestones.find(m => m.id === id);
    const updatedMilestone = {
      ...milestone,
      ...updates,
      billing_status: updates.billingStatus,
      completed_date: updates.completedDate,
      target_date: updates.targetDate
    };
    try {
      await milestonesAPI.update(updatedMilestone);
      setMilestones(milestones.map(m => m.id === id ? { ...m, ...updates } : m));
      setEditingMilestone(null);
    } catch (err) {
      console.error('Failed to save milestone:', err);
    }
  };

  const saveBillingEdit = async (id, updates) => {
    const item = billing.find(b => b.id === id);
    try {
      await billingAPI.update({ ...item, ...updates });
      setBilling(billing.map(b => b.id === id ? { ...b, ...updates } : b));
      setEditingBilling(null);
    } catch (err) {
      console.error('Failed to save billing:', err);
    }
  };

  const addMilestone = async (newMilestone) => {
    try {
      const created = await milestonesAPI.create({
        title: newMilestone.title,
        description: newMilestone.description,
        status: newMilestone.status || 'upcoming',
        target_date: newMilestone.targetDate,
        billing_status: newMilestone.billingStatus || 'pending'
      });
      setMilestones([...milestones, {
        ...created,
        billingStatus: created.billing_status,
        targetDate: created.target_date,
        completedDate: created.completed_date
      }]);
      setShowAddMilestone(false);
    } catch (err) {
      console.error('Failed to add milestone:', err);
    }
  };

  const addBillingItem = async (newItem) => {
    try {
      const created = await billingAPI.create(newItem);
      setBilling([...billing, created]);
      setShowAddBilling(false);
    } catch (err) {
      console.error('Failed to add billing item:', err);
    }
  };

  const deleteMilestone = async (id) => {
    try {
      await milestonesAPI.delete(id);
      setMilestones(milestones.filter(m => m.id !== id));
    } catch (err) {
      console.error('Failed to delete milestone:', err);
    }
  };

  const deleteBilling = async (id) => {
    try {
      await billingAPI.delete(id);
      setBilling(billing.filter(b => b.id !== id));
    } catch (err) {
      console.error('Failed to delete billing:', err);
    }
  };

  const addComment = async (newComment) => {
    try {
      const created = await commentsAPI.create(newComment);
      setComments([created, ...comments]);
      setShowAddComment(false);
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const deleteComment = async (id) => {
    try {
      await commentsAPI.delete(id);
      setComments(comments.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      await settingsAPI.update(key, value);
    } catch (err) {
      console.error('Failed to update setting:', err);
    }
  };

  const StatusIcon = ({ status }) => {
    if (status === 'completed') return <Check size={16} />;
    if (status === 'in-progress') return <Zap size={16} />;
    return <Circle size={16} />;
  };

  const StatCard = ({ icon, value, label, editable, onSave, type = 'text' }) => {
    const [editing, setEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    const handleSave = () => {
      onSave(type === 'number' ? parseInt(tempValue) || value : tempValue);
      setEditing(false);
    };

    return (
      <div style={{ background: 'white', borderRadius: 16, padding: 20, textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', position: 'relative', cursor: editable ? 'pointer' : 'default', transition: 'all 0.3s ease', border: '2px solid transparent' }}
        onMouseEnter={e => { if (editable) e.currentTarget.style.borderColor = '#8B1A1A'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; }}>
        {editable && !editing && (
          <button onClick={() => setEditing(true)} style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', opacity: 0.5 }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.5}>
            <Edit2 size={14} />
          </button>
        )}
        <div style={{ fontSize: '2rem', marginBottom: 8 }}>{icon}</div>
        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <input type={type} value={tempValue} onChange={e => setTempValue(e.target.value)}
              style={{ width: 80, padding: '8px 12px', borderRadius: 8, border: '2px solid #8B1A1A', textAlign: 'center', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: '1.2rem', color: '#8B1A1A' }}
              autoFocus onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }} />
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={handleSave} style={{ padding: '4px 8px', background: '#8B1A1A', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '0.7rem' }}>Save</button>
              <button onClick={() => { setTempValue(value); setEditing(false); }} style={{ padding: '4px 8px', background: '#E5E5E5', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '0.7rem' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#8B1A1A' }} onClick={() => editable && setEditing(true)}>
            {type === 'number' ? `Week ${value}` : value}
          </div>
        )}
        <div style={{ fontSize: '0.8rem', color: '#6B6B6B', fontWeight: 600, textTransform: 'uppercase', marginTop: editing ? 0 : 4 }}>{label}</div>
      </div>
    );
  };


  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#FFF8F0', fontFamily: "'Open Sans', sans-serif", padding: 20 }}>
        <div style={{ textAlign: 'center', background: 'white', padding: 40, borderRadius: 24, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxWidth: 500, width: '100%' }}>
          <h1 style={{ fontFamily: "'Pacifico', cursive", fontSize: '3rem', color: '#8B1A1A', marginBottom: 16 }}>Passionate Living</h1>
          <p style={{ color: '#6B6B6B', marginBottom: 32, fontSize: '1.1rem' }}>Website Migration Tracker</p>
          
          <button 
            onClick={() => {
              if (app.urls && app.urls.signIn) {
                window.location.href = app.urls.signIn;
              } else {
                console.error('Sign in URL is missing!', app);
                alert('Configuration error: Sign in URL is missing. Please check the console.');
              }
            }} 
            style={{ 
              padding: '12px 32px', 
              background: '#8B1A1A', 
              color: 'white', 
              border: 'none', 
              borderRadius: 8, 
              fontSize: '1.1rem', 
              cursor: 'pointer', 
              fontWeight: 600, 
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Sign In to Access
          </button>
        </div>
      </div>
    );
  }


  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F0', fontFamily: "'Open Sans', sans-serif" }}>
      <header style={{ background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: "'Pacifico', cursive", fontSize: '1.5rem', color: '#8B1A1A' }}>Passionate Living</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button 
              onClick={() => user.signOut()} 
              style={{ padding: '8px 16px', background: 'white', border: '1px solid #8B1A1A', color: '#8B1A1A', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#8B1A1A'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#8B1A1A'; }}
            >
              Sign Out
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'linear-gradient(135deg, #8B1A1A, #FF8C42)', color: 'white', borderRadius: 9999, fontWeight: 600, fontSize: '0.85rem' }}>
              <span>🚀</span><span>Migration In Progress</span>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {error && (
          <div style={{ background: '#fee', border: '2px solid #c00', borderRadius: 12, padding: 16, marginBottom: 24, color: '#c00', textAlign: 'center' }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#8B1A1A' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>⏳</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Loading project data...</div>
          </div>
        ) : (
          <>
            <section style={{ textAlign: 'center', marginBottom: 40 }}>
          {editingProject ? (
            <div style={{ background: 'white', padding: 24, borderRadius: 16, maxWidth: 600, margin: '0 auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <input type="text" value={projectTitle} onChange={e => setProjectTitle(e.target.value)}
                style={{ width: '100%', padding: 12, borderRadius: 8, border: '2px solid #E5E5E5', marginBottom: 12, fontSize: '1.25rem', fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }} />
              <textarea value={projectSubtitle} onChange={e => setProjectSubtitle(e.target.value)}
                style={{ width: '100%', padding: 12, borderRadius: 8, border: '2px solid #E5E5E5', marginBottom: 12, resize: 'vertical' }} rows={2} />
              <button onClick={() => setEditingProject(false)} style={{ padding: '10px 24px', background: '#8B1A1A', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, margin: '0 auto' }}>
                <Save size={16} /> Save
              </button>
            </div>
          ) : (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '2rem', fontWeight: 700, color: '#8B1A1A', marginBottom: 8 }}>{projectTitle}</h1>
              <p style={{ color: '#6B6B6B', maxWidth: 600, margin: '0 auto' }}>{projectSubtitle}</p>
              <button onClick={() => setEditingProject(true)} style={{ position: 'absolute', top: 0, right: -30, background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', opacity: 0.5 }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.5}>
                <Edit2 size={18} />
              </button>
            </div>
          )}
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 32 }}>
          <StatCard icon="📋" value={`${completedCount}/${totalCount}`} label="Phases Complete" />
          <StatCard icon="⏱️" value={currentWeek} label="Current Week" editable={true} onSave={(val) => { setCurrentWeek(val); updateSetting('current_week', val.toString()); }} type="number" />
          <StatCard icon="✅" value={tasksCompleted} label="Tasks Done" />
          <StatCard icon="📅" value={targetLaunch} label="Target Launch" editable={true} onSave={(val) => { setTargetLaunch(val); updateSetting('target_launch', val); }} type="text" />
        </section>

        <Calendar milestones={milestones} billing={billing} onEventClick={handleEventClick} />

        <section style={{ background: 'white', borderRadius: 24, padding: 24, marginBottom: 32, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.25rem', fontWeight: 700 }}>Overall Progress</h2>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#8B1A1A' }}>{progress}%</span>
          </div>
          <div style={{ height: 20, background: '#E5E5E5', borderRadius: 9999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(135deg, #8B1A1A, #FF8C42)', borderRadius: 9999, transition: 'width 0.5s ease' }} />
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          <section style={{ background: 'white', borderRadius: 24, padding: 24, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🎯</span> Milestones
              </h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setShowAddMilestone(true)} style={{ background: '#8B1A1A', color: 'white', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem' }}>
                  <Plus size={16} /> Add
                </button>
                <button onClick={() => setExpandedSection({ ...expandedSection, milestones: !expandedSection.milestones })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B' }}>
                  {expandedSection.milestones ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
            </div>

            {showAddMilestone && <MilestoneForm onSave={addMilestone} onCancel={() => setShowAddMilestone(false)} />}

            {expandedSection.milestones && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {milestones.map(m => (
                  <div key={m.id} id={`milestone-${m.id}`}>
                    {editingMilestone === m.id ? (
                      <MilestoneForm milestone={m} onSave={(updates) => saveMilestoneEdit(m.id, updates)} onCancel={() => setEditingMilestone(null)} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, background: m.status === 'completed' ? 'rgba(40,167,69,0.05)' : m.status === 'in-progress' ? 'rgba(255,140,66,0.05)' : '#FFF8F0', borderRadius: 12, borderLeft: `4px solid ${m.status === 'completed' ? '#28A745' : m.status === 'in-progress' ? '#FF8C42' : '#6B6B6B'}` }}>
                        <button onClick={() => { const statuses = ['upcoming', 'in-progress', 'completed']; const currentIdx = statuses.indexOf(m.status); updateMilestoneStatus(m.id, statuses[(currentIdx + 1) % 3]); }} title="Click to change status"
                          style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: m.status === 'completed' ? '#28A745' : m.status === 'in-progress' ? '#FF8C42' : '#E5E5E5', color: m.status === 'upcoming' ? '#6B6B6B' : 'white', transition: 'transform 0.2s', flexShrink: 0 }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                          <StatusIcon status={m.status} />
                        </button>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: '0.95rem', marginBottom: 4 }}>{m.title}</h3>
                          <p style={{ fontSize: '0.85rem', color: '#6B6B6B', marginBottom: 8 }}>{m.description}</p>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ padding: '4px 10px', background: 'white', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600, color: '#6B6B6B' }}>📅 {m.status === 'completed' ? m.completedDate : m.targetDate || 'TBD'}</span>
                            {m.billingStatus === 'billed' && <span style={{ padding: '4px 10px', background: 'rgba(40,167,69,0.1)', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600, color: '#28A745' }}>💰 Billed</span>}
                            {m.billingStatus === 'due' && <span style={{ padding: '4px 10px', background: 'rgba(255,140,66,0.1)', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600, color: '#FF8C42' }}>💰 Due</span>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
                          <button onClick={() => setEditingMilestone(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', padding: 4 }} title="Edit"><Edit2 size={14} /></button>
                          <button onClick={() => deleteMilestone(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545', padding: 4 }} title="Delete"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section style={{ background: 'white', borderRadius: 24, padding: 24, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>💳</span> Billing
              </h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setShowAddBilling(true)} style={{ background: '#8B1A1A', color: 'white', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem' }}>
                  <Plus size={16} /> Add
                </button>
                <button onClick={() => setExpandedSection({ ...expandedSection, billing: !expandedSection.billing })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B' }}>
                  {expandedSection.billing ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
            </div>

            {showAddBilling && <BillingForm onSave={addBillingItem} onCancel={() => setShowAddBilling(false)} />}

            {expandedSection.billing && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {billing.map(b => (
                    <div key={b.id}>
                      {editingBilling === b.id ? (
                        <BillingForm billing={b} onSave={(updates) => saveBillingEdit(b.id, updates)} onCancel={() => setEditingBilling(null)} />
                      ) : (
                        <div id={`billing-${b.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, background: '#FFF8F0', borderRadius: 12 }}>
                          <div>
                            <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: '0.9rem' }}>{b.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#6B6B6B' }}>{b.date}</div>
                            <button onClick={() => { const statuses = ['upcoming', 'pending', 'paid']; const currentIdx = statuses.indexOf(b.status); updateBillingStatus(b.id, statuses[(currentIdx + 1) % 3]); }} title="Click to change status"
                              style={{ marginTop: 4, padding: '3px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', background: b.status === 'paid' ? 'rgba(40,167,69,0.1)' : b.status === 'pending' ? 'rgba(255,140,66,0.1)' : 'rgba(107,107,107,0.1)', color: b.status === 'paid' ? '#28A745' : b.status === 'pending' ? '#FF8C42' : '#6B6B6B', transition: 'transform 0.2s' }}
                              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                              {b.status}
                            </button>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: b.status === 'paid' ? '#28A745' : b.status === 'pending' ? '#FF8C42' : '#6B6B6B' }}>${b.amount.toLocaleString()}</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <button onClick={() => setEditingBilling(b.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', padding: 2 }} title="Edit"><Edit2 size={12} /></button>
                              <button onClick={() => deleteBilling(b.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545', padding: 2 }} title="Delete"><Trash2 size={12} /></button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 20, padding: 20, background: 'linear-gradient(135deg, #8B1A1A, #FF8C42)', borderRadius: 16, color: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.95rem' }}><span>Paid to Date</span><span>${paidAmount.toLocaleString()}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.95rem' }}><span>Remaining</span><span>${remainingAmount.toLocaleString()}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.3)', fontWeight: 700, fontSize: '1.1rem' }}><span>Total Project</span><span>${totalAmount.toLocaleString()}</span></div>
                </div>
              </>
            )}
          </section>

          <section style={{ background: 'white', borderRadius: 24, padding: 24, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>💬</span> Updates & Discussion
              </h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setShowAddComment(true)} style={{ background: '#8B1A1A', color: 'white', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem' }}>
                  <Plus size={16} /> Add Update
                </button>
                <button onClick={() => setExpandedSection({ ...expandedSection, comments: !expandedSection.comments })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B' }}>
                  {expandedSection.comments ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
            </div>

            {showAddComment && <CommentForm onSave={addComment} onCancel={() => setShowAddComment(false)} />}

            {expandedSection.comments && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {comments.map(c => (
                  <div key={c.id} style={{ display: 'flex', gap: 16, padding: 16, background: '#FFF8F0', borderRadius: 12, border: '1px solid #E5E5E5' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: c.role === 'vendor' ? '#8B1A1A' : '#28A745', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', flexShrink: 0 }}>
                      {c.author[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <div>
                          <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, marginRight: 8 }}>{c.author}</span>
                          <span style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: 4, background: c.role === 'vendor' ? 'rgba(139,26,26,0.1)' : 'rgba(40,167,69,0.1)', color: c.role === 'vendor' ? '#8B1A1A' : '#28A745', fontWeight: 600, textTransform: 'uppercase' }}>{c.role}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: '0.8rem', color: '#6B6B6B' }}>{c.date}</span>
                          <button onClick={() => deleteComment(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545', padding: 2 }} title="Delete"><Trash2 size={12} /></button>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.95rem', color: '#2D2D2D', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{c.text}</p>
                      {c.image && (
                        <div style={{ marginTop: 12 }}>
                          <img src={c.image} alt="Attachment" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8, border: '1px solid #E5E5E5' }} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <div style={{ textAlign: 'center', padding: 20, color: '#6B6B6B', fontStyle: 'italic' }}>No updates yet. Start the discussion!</div>
                )}
              </div>
            )}
          </section>
        </div>
          </>
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '32px 24px', color: '#6B6B6B', fontSize: '0.85rem' }}>
        <div style={{ fontFamily: "'Pacifico', cursive", fontSize: '1.25rem', color: '#8B1A1A', marginBottom: 4 }}>Passionate Living</div>
        <p>Website Migration Project • Managed by Ryan</p>
      </footer>
    </div>
  );
}

function MilestoneForm({ milestone, onSave, onCancel }) {
  const [form, setForm] = useState(milestone || { title: '', description: '', status: 'upcoming', targetDate: '', billingStatus: 'pending' });
  return (
    <div style={{ background: '#FFF8F0', padding: 16, borderRadius: 12, marginBottom: 12, border: '2px solid #E5E5E5' }}>
      <input type="text" placeholder="Milestone title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '2px solid #E5E5E5', marginBottom: 8, fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }} />
      <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '2px solid #E5E5E5', marginBottom: 8, resize: 'vertical', fontFamily: "'Open Sans', sans-serif" }} rows={2} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ padding: 10, borderRadius: 8, border: '2px solid #E5E5E5', background: 'white' }}>
          <option value="upcoming">Upcoming</option><option value="in-progress">In Progress</option><option value="completed">Completed</option>
        </select>
        <input type="text" placeholder="Date (e.g. Dec 6)" value={form.targetDate || form.completedDate || ''} onChange={e => setForm({ ...form, targetDate: e.target.value, completedDate: e.target.value })} style={{ padding: 10, borderRadius: 8, border: '2px solid #E5E5E5', width: 130 }} />
        <select value={form.billingStatus} onChange={e => setForm({ ...form, billingStatus: e.target.value })} style={{ padding: 10, borderRadius: 8, border: '2px solid #E5E5E5', background: 'white' }}>
          <option value="pending">Pending</option><option value="due">Due</option><option value="billed">Billed</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onSave(form)} style={{ padding: '8px 20px', background: '#8B1A1A', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Save</button>
        <button onClick={onCancel} style={{ padding: '8px 20px', background: '#E5E5E5', color: '#2D2D2D', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
      </div>
    </div>
  );
}

function BillingForm({ billing, onSave, onCancel }) {
  const [form, setForm] = useState(billing || { name: '', date: '', amount: 0, status: 'upcoming' });
  return (
    <div style={{ background: '#FFF8F0', padding: 16, borderRadius: 12, marginBottom: 12, border: '2px solid #E5E5E5' }}>
      <input type="text" placeholder="Payment name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '2px solid #E5E5E5', marginBottom: 8, fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <input type="text" placeholder="Date (e.g. Dec 6, 2024)" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{ padding: 10, borderRadius: 8, border: '2px solid #E5E5E5', flex: 1, minWidth: 140 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontWeight: 600, color: '#6B6B6B' }}>$</span>
          <input type="number" placeholder="Amount" value={form.amount || ''} onChange={e => setForm({ ...form, amount: parseInt(e.target.value) || 0 })} style={{ padding: 10, borderRadius: 8, border: '2px solid #E5E5E5', width: 100 }} />
        </div>
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ padding: 10, borderRadius: 8, border: '2px solid #E5E5E5', background: 'white' }}>
          <option value="upcoming">Upcoming</option><option value="pending">Pending</option><option value="paid">Paid</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onSave(form)} style={{ padding: '8px 20px', background: '#8B1A1A', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Save</button>
        <button onClick={onCancel} style={{ padding: '8px 20px', background: '#E5E5E5', color: '#2D2D2D', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
      </div>
    </div>
  );
}

function CommentForm({ onSave, onCancel }) {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('Ryan');
  const [role, setRole] = useState('vendor');
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!text.trim() && !image) return;
    onSave({ author, role, text, image });
  };

  return (
    <div style={{ background: 'white', padding: 20, borderRadius: 12, marginBottom: 20, border: '2px solid #8B1A1A', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#6B6B6B', marginBottom: 4 }}>Posting as:</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="text" value={author} onChange={e => setAuthor(e.target.value)} placeholder="Name" style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #E5E5E5', fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }} />
            <select value={role} onChange={e => setRole(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #E5E5E5', background: 'white' }}>
              <option value="vendor">Vendor</option>
              <option value="client">Client</option>
            </select>
          </div>
        </div>
      </div>
      
      <textarea 
        placeholder="What's the update?" 
        value={text} 
        onChange={e => setText(e.target.value)} 
        style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #E5E5E5', marginBottom: 12, resize: 'vertical', fontFamily: "'Open Sans', sans-serif", minHeight: 80 }} 
      />

      {image && (
        <div style={{ marginBottom: 12, position: 'relative', display: 'inline-block' }}>
          <img src={image} alt="Preview" style={{ height: 100, borderRadius: 8, border: '1px solid #E5E5E5' }} />
          <button onClick={() => setImage(null)} style={{ position: 'absolute', top: -8, right: -8, background: '#dc3545', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} />
          </button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: '#6B6B6B', fontSize: '0.9rem', fontWeight: 600 }}>
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          <ImageIcon size={18} />
          <span>Add Image</span>
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleSubmit} style={{ padding: '8px 24px', background: '#8B1A1A', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <MessageSquare size={16} /> Post Update
          </button>
          <button onClick={onCancel} style={{ padding: '8px 20px', background: '#E5E5E5', color: '#2D2D2D', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
