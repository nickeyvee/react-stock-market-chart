import React, { Component } from 'react';
import '../App.css';

const service = require('../services/dataService.js');

class TimeScale extends Component {
	constructor(props) {
		super(props);
		this.toggleTimePeriod = this.toggleTimePeriod.bind(this);
	}

	toggleTimePeriod(event) {
		const newRange = event.currentTarget.value;

		// UPDATE UI FIRST
		this.props.update({ dateRange: parseInt(newRange, 10) });
		this.props.isLoading(true);

		service.timescale(this.props.active, newRange)
			.then(res => {
				this.props.socket.emit('timescale', {
					'data': res.data,
					'range': parseInt(res.range, 10)
				});
				this.props.update({ stockData: res.data })
				this.props.isLoading(false);
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