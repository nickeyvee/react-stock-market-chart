import React, { Component } from 'react';
import '../App.css';

class Visualization extends Component {
	render() {
		return (
			<div className={this.props.loading ? "loading" : "" }>
				<div id="chart"></div>
			</div>
		)
	}
}

export default Visualization;