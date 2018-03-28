import React, { Component } from 'react';
import service from '../services/dataService.js';
import '../App.css';

class Search extends Component {
	constructor(props) {
		super(props);
		this.state = { value: '' };
		this.handleChange = this.handleChange.bind(this);
		this.addStockEvent = this.addStockEvent.bind(this);
		this.onKeyPressEvent = this.onKeyPressEvent.bind(this);
	}

	onKeyPressEvent(event) {
		if (event.key === 'Enter') {
			this.props.addStock(this.state.value);
		}
	}

	addStockEvent() {
      console.log(this.props.addNewStock);
		this.props.addStock(this.state.value);
	}

	handleChange(event) {
		this.setState({ value: event.target.value.toUpperCase() });
	}

	render() {
		return (
			<div id="search_bar" className="custom-card">
				<div className="card-content" style={{ 'paddingBottom': '0' }}>
					<input id="ticker_symbol" className="fontAwesome"
						type="text" value={this.state.value}
						onKeyPress={this.onKeyPressEvent}
						onChange={this.handleChange}
						disabled={this.props.isDisabled}
                  placeholder="&#xF002; Search by ticker name"
						maxLength="5"></input>
				</div>
			</div>
		)
	}
}

// {/* <div className="card-action">
// <button className="add-stock" onClick={this.addStockEvent}
//    disabled={this.props.isDisabled}>Add</button>
// </div> */}

export default Search;