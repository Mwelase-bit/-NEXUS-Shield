export default function ThreatFeed({ feed, onInvestigate }) {
  return (
    <footer className="panel bottom-panel slide-in">
      <div className="panel-header">
        <h3>THREAT FEED</h3>
      </div>
      <div className="threat-feed-scroll">
        {feed.map((e) => (
          <button
            key={e.id}
            type="button"
            className={`feed-entry ${e.level}`}
            onClick={() => onInvestigate?.(e)}
          >
            <span className="feed-time">{e.time}</span>
            <span>{e.message}</span>
          </button>
        ))}
      </div>
    </footer>
  );
}
