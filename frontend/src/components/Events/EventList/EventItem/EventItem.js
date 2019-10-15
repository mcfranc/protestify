import React from 'react';

import './EventItem.css';

const eventItem = props => (
  <li key={props.eventId} className="events__list-item">
  <div className="events__list-item-header">
    <h1>{props.title}</h1>
  </div>
  <div className="events__list-item-body">
    <h2>Date: {new Date(props.date).toLocaleDateString()}</h2>
    <h2>Contribution: £{props.price}</h2>
    <h2>Location: {['Hyde Park', 'Westminster', 'Trafalgar Square'][Math.floor(Math.random()*3)]}</h2>
    <h2>Attendees: {Math.floor(Math.random() * 1000)}</h2>
  </div>
  <div className="events__list-item-footer">
    {props.userId === props.creatorId ? (
      <p>You're the owner of this event</p>
    ) : (
      <button className="btn" onClick={props.onDetail.bind(this, props.eventId)}>Details</button>
    )}
  </div>
  </li>
)

export default eventItem;
