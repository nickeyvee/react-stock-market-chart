import React, { Component } from 'react';
import Search from './Search.js';
import '../App.css';

const chart = require('../chart/c3-chart.js');
const service = require('../services/dataService.js');

class TickerColumn extends Component {
	constructor(props) {
		super(props);
		this.addStock = this.addStock.bind(this);
		this.removeStock = this.removeStock.bind(this);
		this.toggleStock = this.toggleStock.bind(this);
		this.state = {
			disabled: false
		}
	}

	addStock(symbol) {
		const valid = service.validate(symbol, this.props.tickers);

		// prevents double-clicking / spamming
		if (valid) {
			this.props.isLoading(true);
			this.setState({ disabled: true });
			setTimeout(() => {
				this.setState({ disabled: false });
			}, 1500);

			service.add(symbol, this.props.tickers, this.props.dateRange)
				.then(data => {
					chart.draw(data, symbol, this.props.dateRange);

					this.props.socket.emit('add', {
						'data': data,
						'symbol': symbol,
						'range': this.props.dateRange
					})

					this.props.isLoading(false);					
					this.props.update({ stockData: data, activeSymbol: symbol });
				})
		}
	}

	removeStock(event) {
		service.remove(event, this.props.tickers, this.props.active, this.props.dateRange,
			(newData, newSymbol) => {
				this.props.socket.emit('delete', { 'data': newData, 'active': newSymbol })
				this.props.update({ stockData: newData, activeSymbol: newSymbol });
			})
	}

	toggleStock(event) {
		const newSymbol = event.currentTarget.id;

		if (newSymbol !== this.props.active) {
			chart.draw(this.props.tickers, newSymbol, this.props.dateRange);
			this.props.socket.emit('toggle', { 'symbol': newSymbol });
			this.props.update({ activeSymbol: newSymbol });
		}
	}

	render() {

		// ==== WEBSOCKET EVENT REGISTRATION ====
		this.props.socket.on('toggle', event => {
			this.props.update({ activeSymbol: event.symbol });
			chart.draw(this.props.tickers, event.symbol, this.props.dateRange);
		})

		this.props.socket.on('add', event => {
			this.props.update({ stockData: event.data, activeSymbol: event.symbol });
			chart.draw(this.props.tickers, event.symbol, this.props.dateRange);
		})

		this.props.socket.on('delete', event => {
			this.props.update({ stockData: event.data, activeSymbol: event.active });
			chart.draw(this.props.tickers, event.active, this.props.dateRange);
		})

		this.props.socket.on('timescale', event => {
			chart.draw(event.data, this.props.active, event.range);
			this.props.update({ stockData: event.data, dateRange: event.range });
		})

		console.log(this.props.tickers.map((data, index) => data[0]));

		const tickerRows = this.props.tickers.map((data, index) =>
			<div key={data[0].symbol} className="col s12 m12 l4">
				<div className="card toggle-ticker">
					<div className="card-content">
						<span className={`card-title ${this.props.active === data[0].symbol ? 'active' : ''}`}
							id={data[0].symbol} onClick={e => this.toggleStock(e)}>{data[0].symbol}</span>
						<span className='remove' id={data[0].symbol} onClick={e => this.removeStock(e)}>
							<i className="fa fa-times"></i>
						</span>
					</div>
				</div>
			</div>
		);

		return (
			<div className="tickers js-tickers row" >
				{tickerRows}
				<div className="col s12 m12 l4">
					<Search tickers={this.props.tickers} isDisabled={this.state.disabled}
						dateRange={this.props.appState.dateRange} addStock={this.addStock} />
				</div>
			</div>
		)
	}
}

export default TickerColumn;