import React, { useEffect, useState } from 'react';
import { fetchTodayLog } from '../api';

const TodaySummary = () => {
  const [todayLog, setTodayLog] = useState(null);

  useEffect(() => {
    const getTodayLog = async () => {
      try {
        const data = await fetchTodayLog();
        setTodayLog(data);
      } catch (error) {
        console.error("Error fetching today's log:", error);
      }
    };
    getTodayLog();
  }, []);

  return (
    <div style={styles.card}>
      <h2 style={styles.heading}>Today's Summary</h2>
      {todayLog ? (
        <div style={styles.content}>
          <div style={styles.row}>
            <span style={styles.label}>Date:</span>
            <span style={styles.value}>{todayLog.date}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Day:</span>
            <span style={styles.value}>{todayLog.day}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Peak Count:</span>
            <span style={styles.value}>{todayLog.peak_count}</span>
          </div>
        </div>
      ) : (
        <p style={styles.loading}>Loading today's data...</p>
      )}
    </div>
  );
};

const styles = {
  card: {
    padding: '1.5rem',
    margin: '2rem auto',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    maxWidth: '700px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  heading: {
    textAlign: 'center',
    margin: '0 0 1.5rem 0',
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2c3e50',
    letterSpacing: '0.25px',
    paddingBottom: '0.75rem',
    borderBottom: '2px solid #f0f0f0',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    color: '#2c3e50',
    fontSize: '0.95rem',
  },
  value: {
    fontWeight: '500',
    color: '#333333',
    fontSize: '0.95rem',
  },
  loading: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
};

export default TodaySummary;