const axios = require('axios');
const chart = require('../chart/c3-chart.js');

function validate(symbol, tickers) {
	const symbols = tickers.map(d => d[0].symbol);
	const found = symbols.find(stock => stock === symbol);
	const re = /^[A-Z]+$/;


	if (!re.test(symbol)) {
		console.warn('Symbol can only contain letters [a-z]');
		return false;
	} else if (symbol.length > 5) {
		console.warn('Valid symbols can be no longer than 5 characters in length');
		return false;
	}

	if (found) {
		console.warn(`Ticker ${symbol} was already added`);
		return false;
	} else {
		alert('A name was submitted: ' + symbol);
		return true;
	}
}

function add(symbol, tickers, range) {

	return axios.post('/data/add', {
		'symbol': symbol,
		'range': range
	}).then(res => {
		const newArray = tickers;
		tickers.splice(0, newArray.length);
		res.data.map(d => newArray.push(d));
		return newArray;
	});
}


function remove(event, tickers, selectedSymbol, callback) {
	const symbols = tickers.map(d => d[0].symbol);
	const newState = tickers;
	const symbol = event.target.id;
	const index = symbols.indexOf(symbol);

	if (index > -1) {
		// reset state here
		newState.splice(index, 1);
		// console.log(tickers.map(d => d[0].symbol));
		// console.log(newState.length);

		if (newState.length === 0) {
			console.log('case 1');
			callback(newState, '');

		} else if (symbol === selectedSymbol) {
			console.log('case 2');
			chart.draw(newState, newState[0][0].symbol);
			callback(newState, newState[0][0].symbol);

		} else {
			console.log('case 3');
			chart.draw(newState, newState[0][0].symbol);
			callback(newState, symbol);
		}

		axios.delete('data/remove', {
			'symbol': symbol
		}).catch(err => {
			console.warn(err);
		});
	}
}


module.exports = {
	add, remove, validate
}