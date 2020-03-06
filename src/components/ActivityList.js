import React from 'react';

export default function ActivityList({
  activities,
  deleteActivity,
  toggleEdit,
  updateActivity
}) {
  return (
    <div className="activity-list">
      {activities.length ? (
        <h4>Tracked Activities ({activities.length})</h4>
      ) : (
        ''
      )}
      <ul>
        {activities.map(activity => {
          return (
            <li name={activity.id} key={activity.id}>
              <span className="entry">
                <span className="entry-text">
                  {activity.type === 'productive' ? (
                    <span className="prod-icon"></span>
                  ) : (
                    <span className="unprod-icon"></span>
                  )}
                  {activity.text}
                </span>
                <span className="entry-icons">
                  <i className="gg-pen" onClick={() => toggleEdit(activity)} />
                  <i
                    className="gg-trash"
                    onClick={() => deleteActivity(activity)}
                  />
                </span>
                <span name="toggle-me" className="hide">
                  <span className="edit-container">
                    <input
                      placeholder="edit activity description"
                      name="edited-text"
                      className="edit-text"
                    />
                    <select
                      id="status"
                      name="edited-type"
                      className="edit-type"
                    >
                      <option value="" disabled selected hidden>
                        choose type &#9661;
                      </option>
                      <option value="productive">productive</option>
                      <option value="unproductive">unproductive</option>
                    </select>
                    <input
                      type="button"
                      value="save"
                      className="save-button"
                      onClick={() => updateActivity(activity)}
                    />
                  </span>
                </span>
              </span>
              <hr />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
