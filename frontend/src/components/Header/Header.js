import React from 'react';

import './Header.css';

const header = props => (
  <div className="header">
    <div>
      <h1>{props.title}</h1>
      <h3>{props.subtitle}</h3>
    </div>
  </div>
);

export default header;
