import React from 'react';

export default function ActivityList({
  currentActivities,
  deleteActivity,
  toggleEdit,
  updateActivity
}) {
  return (
    <div className="activity-list">
      {currentActivities.length ? (
        <h4>Tracked Activities ({currentActivities.length})</h4>
      ) : (
        ''
      )}
      <ul>
        {currentActivities.map(activity => {
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
                    <div className="inner-edit-container">
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
                        <option default value="">
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
                    </div>
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
