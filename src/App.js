import React, { Component } from 'react';
// import io from 'socket.io-client';
// import axios from 'axios';
import './App.css';

import StockChart from './components/StockChart.js';
import TickerColumn from './components/TickerColumn.js';

import service from './data/api.js';

class App extends Component {
	render() {
		const state = this.props.appState;
	  const tickers = this.props.getTickers;
		return (
			<div className="App" >
				<div className="container">
					<StockChart 
						dateRange={state.dateRange}
						update={this.props.setAppState}
						active={state.activeSymbol}
					/>
					<TickerColumn
						tickers={tickers}
						appState={state}
						dateRange={state.dateRange}
						update={this.props.setAppState}
						active={state.activeSymbol}
					/>
				</div>
			</div>
		);
	}
}
export default App;