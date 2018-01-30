import React, { Component } from 'react';
import '../App.css';

const chart = require('../data/api');

class TimeScale extends Component {
	constructor(props) {
		super(props);
		this.toggleTimePeriod = this.toggleTimePeriod.bind(this);
	}

	toggleTimePeriod(event) {
		this.props.update({ dateRange: event.currentTarget.value },
			chart.timescale(this.props.active, event.currentTarget.value)
		)
	}

	render() {
		const options = [1, 3, 12, 60].map((val, i) =>
			<button key={i.toString()} onClick={this.toggleTimePeriod} value={val}
				className={`timeperiod ${val === parseInt(this.props.dateRange) ? 'active-timeperiod' : ''}`}>
				{val < 12 ? val + 'M' : val / 12 + 'Y'}
			</button>
		);

		return (
			<div className="card-action right-align">
				{options}
			</div>
		)
	}
}

export default TimeScale;