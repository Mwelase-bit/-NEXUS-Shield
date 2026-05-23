export default function AILoading({ show }) {
  if (!show) return null;
  return (
    <div className="ai-loading-overlay">
      <div className="ai-loading-box">
        <div className="ai-spinner" />
        <span>NEXUS AI PROCESSING...</span>
      </div>
    </div>
  );
}
