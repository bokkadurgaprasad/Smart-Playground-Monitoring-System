import React, { useEffect, useState } from 'react';
import { fetchAllLogs } from '../api';

const LogsTable = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const getLogs = async () => {
      try {
        const data = await fetchAllLogs();
        setLogs(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };
    getLogs();
  }, []);


  return (
    <div style={styles.tableWrapper}>
      <h2 style={styles.heading}>All Logs</h2>
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Day</th>
            <th style={styles.th}>Peak Count</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr 
              key={log.id} 
              style={index % 2 === 0 ? styles.evenRow : styles.oddRow}
            >
              <td style={styles.td}>{log.date}</td>
              <td style={styles.td}>{log.day}</td>
              <td style={styles.td}>{log.peak_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  tableWrapper: {
    margin: '2rem auto',
    padding: '1.5rem',
    borderRadius: '12px',
    backgroundColor: '#edf1f5',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    maxWidth: '1200px',
  },
  heading: {
    textAlign: 'center',
    margin: '0 0 2rem 0',
    fontSize: '1.8rem',
    fontWeight: '700',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: '#1a1a1a',
    letterSpacing: '0.25px',
    textTransform: 'none',
    position: 'relative',
    paddingBottom: '0.75rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    overflow: 'hidden',
    borderRadius: '8px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  headerRow: {
    backgroundColor: '#2c3e50',
    color: '#ffffff',
  },
  th: {
    padding: '14px 16px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '0.95rem',
    letterSpacing: '0.5px',
    borderBottom: '2px solid #e0e0e0',
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '0.925rem',
    color: '#333333',
    lineHeight: '1.5',
  },
  evenRow: {
    backgroundColor: '#ffffff',
    '&:hover': {
      backgroundColor: '#f9f9f9',
    },
  },
  oddRow: {
    backgroundColor: '#a6d1ff',
    '&:hover': {
      backgroundColor: '#26ccff',
    },
  },
};

export default LogsTable;