import React, { Component } from 'react';
import '../App.css';

const service = require('../data/api');

class TimeScale extends Component {
	constructor(props) {
		super(props);
		this.toggleTimePeriod = this.toggleTimePeriod.bind(this);
	}

	toggleTimePeriod(event) {
		const newRange = event.currentTarget.value;

		service.timescale(this.props.active, newRange)
			.then(res => {
				this.props.update({ stockData: res.data, dateRange: parseInt(res.range, 10)})
			})
	}

	render() {
		const options = [1, 3, 12, 60].map((val, i) =>
			<button key={i.toString()} onClick={this.toggleTimePeriod} value={val}
				className={`timeperiod ${val === this.props.dateRange ? 'active-timeperiod' : ''}`}>
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