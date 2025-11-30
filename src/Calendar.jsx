import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export default function Calendar({ milestones, billing, onEventClick }) {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 10, 1)); // Default to Nov 2024

  // Helper to parse dates like "Nov 1" or "Nov 1, 2024"
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const currentYear = new Date().getFullYear();
    const str = dateStr.includes(',') ? dateStr : `${dateStr}, ${currentYear}`;
    const date = new Date(str);
    return isNaN(date.getTime()) ? null : date;
  };

  // Aggregate all events
  const events = [
    ...milestones.map(m => ({
      id: `milestone-${m.id}`,
      title: m.title,
      date: parseDate(m.completedDate || m.targetDate),
      type: 'milestone',
      status: m.status
    })),
    ...billing.map(b => ({
      id: `billing-${b.id}`,
      title: b.name,
      date: parseDate(b.date),
      type: 'billing',
      status: b.status
    }))
  ].filter(e => e.date);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const isSameDay = (d1, d2) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  const renderEvent = (event) => {
    const colors = {
      milestone: {
        completed: '#10B981', // Green
        'in-progress': '#F59E0B', // Orange
        upcoming: '#6B7280', // Gray
      },
      billing: {
        paid: '#10B981',
        pending: '#F59E0B',
        upcoming: '#6B7280',
      }
    };

    const color = colors[event.type][event.status] || '#6B7280';

    return (
      <div
        key={event.id}
        onClick={(e) => { e.stopPropagation(); onEventClick(event.type, event.id.split('-')[1]); }}
        style={{
          fontSize: '0.65rem',
          padding: '2px 4px',
          borderRadius: 4,
          backgroundColor: `${color}20`,
          color: color,
          borderLeft: `2px solid ${color}`,
          marginBottom: 2,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontWeight: 600
        }}
        title={event.title}
      >
        {event.type === 'billing' ? '💰 ' : '📍 '}{event.title}
      </div>
    );
  };

  return (
    <div style={{ background: 'white', borderRadius: 24, padding: 24, marginBottom: 32, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: '#FFF8F0', padding: 10, borderRadius: 12, color: '#8B1A1A' }}>
            <CalendarIcon size={24} />
          </div>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.25rem', fontWeight: 700, color: '#1F2937', margin: 0 }}>
            Project Calendar
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            <ChevronLeft size={20} />
          </button>
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, minWidth: 140, textAlign: 'center' }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} style={{ textAlign: 'center', fontSize: '0.8rem', fontWeight: 600, color: '#9CA3AF', paddingBottom: 8 }}>
            {day}
          </div>
        ))}
        
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} style={{ minHeight: 80, background: '#F9FAFB', borderRadius: 8 }}></div>
        ))}

        {Array.from({ length: days }).map((_, i) => {
          const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
          const dayEvents = events.filter(e => isSameDay(e.date, dayDate));
          const isToday = isSameDay(dayDate, new Date());

          return (
            <div key={i} style={{ 
              minHeight: 80, 
              border: isToday ? '2px solid #8B1A1A' : '1px solid #E5E7EB', 
              borderRadius: 8, 
              padding: 4,
              background: isToday ? '#FFF8F0' : 'white'
            }}>
              <div style={{ textAlign: 'right', fontSize: '0.75rem', fontWeight: isToday ? 700 : 500, color: isToday ? '#8B1A1A' : '#6B7280', marginBottom: 4 }}>
                {i + 1}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {dayEvents.map(renderEvent)}
              </div>
            </div>
          );
        })}
      </div>
      
      <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: '0.75rem', color: '#6B7280', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }}></div> Completed/Paid
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }}></div> In Progress/Pending
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6B7280' }}></div> Upcoming
        </div>
      </div>
    </div>
  );
}
