const axios = require('axios');
const chart = require('../chart/c3-chart.js');

function validate(symbol, tickers) {
	const symbols = tickers.map(d => d[0].symbol);
	const found = symbols.find(stock => stock === symbol);
	const re = /^[A-Z]+$/;

	// console.log('\n');
	// console.log('Validate');
	// console.log('Not found? ', !found);

	if (!re.test(symbol)) {
		console.warn('Symbol can only contain letters [a-z]');
		return false;
	} else if (symbol.length > 5) {
		console.warn('Valid symbols can be no longer than 5 characters in length');
		return false;
	}

	if (!found) {
		alert('A name was submitted: ' + symbol);
		return true;
	} else {
		console.warn(`Ticker ${symbol} was already added`);
		return false;
	}
}

function add(symbol, tickers, range) {

	return axios.post('/data/add', {
		'symbol': symbol,
		'range': range
	}).then(res => {
		const newArray = []
		console.log(res.data.map(d => d[0].symbol));
		res.data.map(d => newArray.push(d));
		return newArray;
	});
}


function remove(event, tickers, active, callback) {
	const symbols = tickers.map(d => d[0].symbol);
	const newState = tickers;
	const symbol = event.currentTarget.id;
	const index = symbols.indexOf(symbol);

	if (index > -1) {
		// reset state here
		newState.splice(index, 1);

		// console.log('\n');
		// console.log('remove');
		// console.log(symbol, newState.map(d => d[0].symbol));

		if (newState.length === 0) {
			console.log('case 1');
			callback(newState, '');

		} else if (symbol === active) {
			console.log('case 2');
			// console.log(newState, newState[0][0].symbol);

			chart.draw(newState, newState[0][0].symbol);
			callback(newState, newState[0][0].symbol);

		} else {
			console.log('case 3');
			console.log(newState[0][0].symbol, newState.map(d => d[0].symbol));
			chart.draw(newState, newState[0][0].symbol);
			callback(newState, symbol);
		}

		axios.delete('data/remove', {
			data: { 'symbol': symbol }
		});
	}
}

function timescale(symbol, range) {
	axios.post('data/timescale', {
		'symbol': symbol,
		'range': range
	}).then(res => {
		chart.draw(res.data, symbol, range);
	})
}


module.exports = {
	add, remove, validate, timescale
}