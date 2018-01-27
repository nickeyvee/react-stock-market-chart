import React, { Component } from 'react';
import TimeScale from './TimeScale.js';
import Visualization from './Visualization.js';
import '../App.css';

class StockChart extends Component {
	render() {
		return (
			<div className="row">
				<div className="col s12 m12 l12">
					<div className="card">
						<div className="chart-wrapper card-content">
							<TimeScale />
							<Visualization />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default StockChart;