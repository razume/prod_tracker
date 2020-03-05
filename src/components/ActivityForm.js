import React from 'react';

export default function ActivityForm({
  createProdActivity,
  createUnprodActivity
}) {
  return (
    <div className="form-container">
      <div className="activity-form">
        <input name="activity-text" placeholder="describe your activity" />
        <span>
          <input
            type="button"
            value="productive"
            onClick={createProdActivity}
          />
          <input
            type="button"
            value="unproductive"
            onClick={createUnprodActivity}
          />
        </span>
      </div>
    </div>
  );
}
