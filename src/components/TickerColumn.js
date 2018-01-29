import React, { Component } from 'react';
import classNames from 'classnames';
import service from '../data/api.js';
import '../App.css';

import chart from '../chart/c3-chart.js';
import Search from './Search.js';

class TickerColumn extends Component {
	constructor(props) {
		super(props);
		this.addStock = this.addStock.bind(this);
		this.removeStock = this.removeStock.bind(this);
		this.toggleStock = this.toggleStock.bind(this);
	}

	addStock(symbol) {
		const valid = service.validate(symbol, this.props.tickers);

		if (valid) {
			service.add(symbol, this.props.tickers, this.props.appState.dateRange)
				.then(data => {
					chart.draw(data, symbol);
					this.props.update({ stockData: data, activeSymbol: symbol });
				})
		}
	}

	removeStock(event) {
		service.remove(event, this.props.tickers, this.props.active,
			(newState, symbol) => {
				this.props.update({ stockData: newState, activeSymbol: symbol });
			})
	}

	toggleStock(event) {

		// toggleClick fires when the component is RERENDERED
		const newSymbol = event.currentTarget.id;

		if (newSymbol !== this.props.active) {
			chart.draw(this.props.tickers, newSymbol);
			this.props.update({ activeSymbol: newSymbol });
		}
	}

	render() {
		const tickerRows = this.props.tickers.map((data, index) =>

			<div key={data[0].symbol} id={data[0].symbol} onClick={e => this.toggleStock(e)} className="col s12 m12 l4">
				<div className="card toggle-ticker">
					<div className="card-content">
						<span className={`card-title ${this.props.active === data[0].symbol ? 'active' : ''}`}>{data[0].symbol}</span>
						<i className="fa fa-times" id={data[0].symbol} onClick={e => this.removeStock(e)}></i>
					</div>
				</div>
			</div>
		);

		// console.log('\n');
		// console.log(tickerRows.map(item => item.key));

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

export default TickerColumn;