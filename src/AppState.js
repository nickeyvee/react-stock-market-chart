import React, { Component } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './App.css';

import chart from './chart/c3-chart.js';

class AppState extends Component {
	constructor(props) {
		super(props);
		const socket = io.connect('http://localhost:5000');
		this.state = {
			stockData: [],
			dateRange: 12,
			activeSymbol: '',
			socket: socket
		}
		this.setAppState = this.setAppState.bind(this);
		this.getTickerList = this.getTickerList.bind(this);
		this.getActiveSymbol = this.getActiveSymbol.bind(this);
	}

	componentDidMount() {
		// initalize websocket
		this.state.socket.on('connect', () => {
			return console.warn('socket working! id: ' + this.state.socket.id);
		})

		// get stock data into our app
		axios.get(`/data/stocks`)
			.then(d => {
				const stockData = d.data.map(stock => stock);
				this.setAppState({
					'stockData': stockData,
					'activeSymbol': stockData[0][0].symbol,
					'dateRange': 12
				}, done => {
					// console.log(this.state.stockData);
					// console.log(this.state.activeSymbol);
					chart.draw(
						this.state.stockData,
						this.state.activeSymbol,
						this.state.dateRange
					)
				});
			})
	}

	componentWillMount() {
		this.setAppState({})
	}

	setAppState(newState, callback) {
		this.setState(newState, () => {
			if (this.props.debug) {
				console.log('setAppState', JSON.stringify(this.state));
			}
			if (callback) {
				callback();
			}
		})
	}

	getActiveSymbol() {
		return this.state.activeSymbol;
	}

	getTickerList() {
		return this.state.stockData.map(d => d);
	}

	render() {
		return (
			<div className="AppState">
				{React.Children.map(this.props.children, child => {
					return React.cloneElement(child, {
						appState: this.state,
						setAppState: this.setAppState,
						getTickers: this.getTickerList(),
						getActiveSymbol: this.getActiveSymbol()
					})
				})}
			</div>
		)
	}
}

export default AppState;