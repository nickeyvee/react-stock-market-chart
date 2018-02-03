import React, { Component } from 'react';
// import io from 'socket.io-client';
// import axios from 'axios';
import './App.css';

import StockChart from './components/StockChart.js';
import TickerColumn from './components/TickerColumn.js';

class App extends Component {
	render() {
		const state = this.props.appState;
		const tickers = this.props.getTickers;
		return (
			<div className="App" >
				<div className="container">
					<StockChart
						appState={state}
						isLoading={this.props.isLoading}
						dateRange={state.dateRange}
						update={this.props.setAppState}
						active={state.activeSymbol}
						socket={state.socket}
					/>
					<TickerColumn
						tickers={tickers}
						appState={state}
						isLoading={this.props.isLoading}						
						dateRange={state.dateRange}
						update={this.props.setAppState}
						active={state.activeSymbol}
						socket={state.socket}
					/>
				</div>
			</div>
		);
	}
}
export default App;