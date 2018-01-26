import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

import chart from './chart/c3-chart.js';


class Search extends Component {
	constructor(props) {
		super(props);
		this.state = { value: '' };

		this.handleChange = this.handleChange.bind(this);
		this.addStock = this.addStock.bind(this);
	}

	addStock(event) {

		const symbol = this.state.value;
		const exists = this.props.tickers.find(stock => stock === symbol);
		const re = /^[A-Z]+$/;

		if (!re.test(symbol)) {
			console.warn('Symbol can only contain letters [a-z]');
			return;
		} else if (symbol.length > 5) {
			console.warn('Valid symbols can be no longer than 5 characters in length');
			return;
		}

		if (exists) {
			return console.warn(`Ticker ${symbol} was already added`);
		} else {
			alert('A name was submitted: ' + this.state.value);
		}
		this.props.callback(this.state.value, this.props.dateRange);
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
					<button className="add-stock" onClick={this.addStock}>Add</button>
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

	addStock(symbol, range) {

		axios.post('/data/add', {
			'symbol': symbol,
			'range': range
		}).then(d => {
			const newArray = this.props.tickers;
			newArray.splice(0, newArray.length);
			d.data.map(d => newArray.push(d));

			this.props.parentState({ stockData: newArray, selectedSymbol: symbol });

			chart.draw(this.props.tickers, symbol);
		});
	}

	removeStock(event) {
		const symbols = this.props.tickers.map(d => d[0].symbol);
		const newState = this.props.tickers;
		const symbol = event.target.id;
		const index = symbols.indexOf(symbol);

		if (index > -1) {
			// reset state here
			newState.splice(index, 1);
			// console.log(this.props.tickers.map(d => d[0].symbol));
			// console.log(this.props.selectedSymbol);

			if (symbol === this.props.selectedSymbol) {
				// reset state
				this.props.parentState({ 
					stockData: newState, 
					selectedSymbol: this.props.tickers[0][0].symbol 
				});

				chart.draw(this.props.tickers, this.props.tickers[0][0].symbol);
			} else {
				console.log('case 3');
				this.props.parentState({ stockData: newState, selectedSymbol: symbol });
			}

			axios.delete('data/remove', {
				'symbol': symbol
			}).catch(err => {
				console.warn(err);
			});
		}
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
				< div className="col s12 m12 l4" >
					<Search tickers={this.props.tickers}
						dateRange={this.props.dateRange} callback={this.addStock} />
				</div>
			</div>
		)
	}
}


class Visualization extends Component {
	render() {
		return (
			<div className="loader">
				<div id="chart"></div>
			</div>
		)
	}
}

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

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			stockData: [],
			dateRange: 12,
			selectedSymbol: ''
		}
		this.setParentState = this.setParentState.bind(this);
	}

	getSelectedSymbol() {
		return this.state.selectedSymbol;
	}

	setParentState(obj) {
		this.setState(obj);
	}

	changeDateRange(range) {
		this.setState({ dateRange: range });
	}

	componentDidMount() {
		axios.get(`/data/stocks`)
			.then(d => {
				const stockData = d.data.map(stock => stock);
				this.setState({ stockData });
			})
	}

	renderTickerList() {
		return this.state.stockData.map(d => d);
	}

	render() {
		return (
			<div className="App">
				<div className="container">
					<StockChart daterange={this.dateRange} />
					<TickerColumn tickers={this.renderTickerList()} selectedSymbol={this.getSelectedSymbol()}
						changeRange={this.changeRange} parentState={this.setParentState} />
				</div>
			</div>
		);
	}
}

export default App;