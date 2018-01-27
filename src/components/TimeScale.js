import React, { Component } from 'react';
import '../App.css';

class TimeScale extends Component {
	render() {
		return (
			<div className="card-action right-align">
				<button id="1-month" value="1" className="js-time-period light-blue-text">1M</button>
				<button id="3-month" value="3" className="js-time-period light-blue-text">3M</button>
				<button id="1-year" value="12" className="js-time-period active light-blue-text">1Y</button>
				<button id="5-year" value="60" className="js-time-period light-blue-text">5Y</button>
			</div>
		)
	}
}

export default TimeScale;