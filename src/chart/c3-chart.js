
const $ = require("jquery");
const d3 = require('d3');
const c3 = require('c3');
const c3_helpers = require('./c3-helpers');

let chart;

function plot(dates, prices, range) {

	if(chart) {
		chart.destroy();
	}

	const months = [
		'Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
	];

	// console.log('\n');
	// console.log('c3_chart() [function]');
	// console.log('Dates : ');
	// console.log(dates);
	// console.log('Prices : ');
	// console.log(prices);

	function date_format(date, range, count) {

		if (parseInt(range) === 60) {
			return date.getFullYear();
		} else if (parseInt(range) === 1) {
			return `${months[date.getMonth()]} ${date.getDate()}`;
		} else {
			return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
		}
	}

	chart = c3.generate({
		padding: {
			right: 17
		},
		data: {
			x: 'x',
			columns: [dates, prices],
			types: {
				[prices[0]]: 'area',
			}
		},
		axis: {
			x: {
				type: 'timeseries',
				tick: {
					format: d => date_format(new Date(d), range),
					count: 6,
					culling: 6,
				},
				show: true
			},
			y: {
				tick: {
					format: d3.format("$,")
				},
				min: Math.min.apply(Math, prices.slice(1, prices.length)),
			}
		},
		point: {
			show: false
		}
	});

	// apply css :
	$(`#chart .c3-line-${prices[0]}`).css({ "stroke-width": "2px" });
}

function erase() {
	chart = chart.destroy();
}

function draw(data, symbol, range) {
	// console.log(data, symbol, range);
	const d = c3_helpers.mapData(data, symbol);
	plot(d.dates, d.prices, range);
}

module.exports = {
	draw, plot, erase
}