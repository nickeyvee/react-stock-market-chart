import React, { Component } from 'react';
import service from './data/api.js';
import io from 'socket.io-client';
import axios from 'axios';
import './App.css';

import chart from './chart/c3-chart.js';
import StockChart from './components/StockChart.js';


class Search extends Component {
	constructor(props) {
		super(props);
		this.state = { value: '' };

		this.handleChange = this.handleChange.bind(this);
		this.addStockEvent = this.addStockEvent.bind(this);
	}

	addStockEvent() {
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
					<input id="ticker_symbol" type="text" value={this.state.value}
						onChange={this.handleChange} placeholder="AAPL" maxLength="5"></input>
				</div>
				<div className="card-action">
					<button className="add-stock" onClick={this.addStockEvent}>Add</button>
				</div>
			</div>
		)
	}
}


class TickerColumn extends Component {
	constructor(props) {
		super(props);
		this.addStock = this.addStock.bind(this);
		this.removeStock = this.removeStock.bind(this);
	}

	addStock(symbol) {
		// console.log(this.props.appState.selectedSymbol);
		// console.log(this.props.tickers.map(d => d[0].symbol));
		const valid = service.validate(symbol, this.props.tickers);

		if (valid) {
			service.add(symbol, this.props.tickers, this.props.appState.dateRange)
				.then(data => {
					this.props.setAppState({ stockData: data, selectedSymbol: symbol });
					chart.draw(data, symbol);
					console.log(this.props.tickers.map(d => d[0].symbol));
				})
		}
	}

	removeStock(event) {
		// console.log(this.props.appState.selectedSymbol);
		// console.log(this.props.tickers.map(d => d[0].symbol));
		service.remove(event, this.props.tickers, this.props.appState.selectedSymbol,
			(newState, symbol) => {
				this.props.setAppState({ stockData: newState, selectedSymbol: symbol });
				// console.log(this.props.tickers.map(d => d[0].symbol));				
			})
	}

	render() {
		const tickerRows = this.props.tickers.map((data, index) =>
			<div key={index.toString()} className="col s12 m12 l4">
				<div id={data[0].symbol} style={{ 'minHeight': '80px' }}
					className="card js-toggle-ticker align-left">
					<div className="card-content">
						<span className="card-title pull-left">{data[0].symbol}</span>
						<i className="fa fa-times pull-right" id={data[0].symbol} style={{ 'color': '#03a9f4' }}
							aria-hidden="true" onClick={e => this.removeStock(e)}></i>
					</div>
				</div>
			</div>
		);

		return (
			<div className="tickers js-tickers row" >
				{tickerRows}
				<div className="col s12 m12 l4">
					<Search tickers={this.props.tickers}
						dateRange={this.props.appState.dateRange} addStock={this.addStock} />
				</div>
			</div>
		)
	}
}


class App extends Component {
	render() {
		const state = this.props.appState,
			tickers = this.props.getTickers,
			setAppState = this.props.setAppState.bind(this);

		// console.log(tickers);
		return (
			<div className="App" >
				<div className="container">
					<StockChart />
					<TickerColumn
						tickers={tickers}
						appState={state}
						setAppState={setAppState}
					/>
				</div>
			</div>
		);
	}
}
export default App;