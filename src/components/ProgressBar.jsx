function ProgressBar({ current, total }) {

    const percent = (current / total) * 100;

  return (
    <div className="progress-bar">
      <p className="progress-bar-label">
        Prompt {current} of {total}
      </p>
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
