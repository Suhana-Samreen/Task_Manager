import React from 'react';

export default function InsightsPanel({ insights, onRefresh }) {
  if (!insights) {
    return <div style={{ border:'1px solid #ddd', padding:12, borderRadius:6 }}>Loading insights...</div>;
  }
  return (
    <div style={{ border:'1px solid #ddd', padding:12, borderRadius:6 }}>
      <h3>Insights</h3>
      <div style={{ marginBottom:8 }}>{insights.summary}</div>
      <div>
        <strong>By Priority</strong>
        <div>High: {insights.byPriority.High}</div>
        <div>Medium: {insights.byPriority.Medium}</div>
        <div>Low: {insights.byPriority.Low}</div>
      </div>
      <div style={{ marginTop:8 }}>
        <strong>By Status</strong>
        <div>Open: {insights.byStatus.Open}</div>
        <div>In Progress: {insights.byStatus['In Progress']}</div>
        <div>Done: {insights.byStatus.Done}</div>
      </div>
      
      <div style={{ marginTop:8 }}>
        <button onClick={onRefresh}>Refresh</button>
      </div>
    </div>
  );
}
