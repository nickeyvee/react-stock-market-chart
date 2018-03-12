import React, { Component } from 'react';
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
         // console.log(this.state.value);
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
			<div id="search_bar" className="card">
				<div className="card-content" style={{ 'paddingBottom': '0' }}>
					<p>Enter a ticker</p>
					<input id="ticker_symbol"
						type="text" value={this.state.value}
						onKeyPress={this.onKeyPressEvent}
						onChange={this.handleChange}
						disabled={this.props.isDisabled}
						placeholder="AAPL"
						maxLength="5"></input>
				</div>
				<div className="card-action">
					<button className="add-stock" onClick={this.addStockEvent}
						disabled={this.props.isDisabled}>Add</button>
				</div>
			</div>
		)
	}
}

export default Search;