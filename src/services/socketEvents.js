// ==== SOCKET.IO EVENTS ====

socket.on('add', event => {
	// console.log("ADD EVENT RECIEVED");

	// update UI
	ticker_markup(event.symbol);

	// reset local state
	localData.splice(0, localData.length);

	// import updated state         
	event.data.map(stock => {
		localData.push(stock);
	})

	symbol_current = event.symbol;

	const d = c3_helpers.mapData(localData, event.symbol);

	c3_chart.draw(d.dates, d.prices, event.range);

	// CHECK
	// console.log('CURRENT : ', symbol_current);
	// console.log(localData.map(d => d[0].symbol));
})


socket.on('timescale', event => {
	// console.log("TIMESCALE EVENT RECIEVED");

	// change UI
	$('.js-time-period').removeClass('active');

	if (event.range < 12) {
		$(`#${event.range}-month`).addClass('active');
	} else {
		$(`#${event.range / 12}-year`).addClass('active');
	}
	// reset local state
	localData.splice(0, localData.length);

	// import updated state         
	event.data.map(stock => {
		localData.push(stock);
	})

	const d = c3_helpers.mapData(localData, event.symbol);

	c3_chart.draw(d.dates, d.prices, event.range);

	// CHECK
	// console.log('CURRENT : ', symbol_current);
	// console.log(localData.map(d => d[0].symbol));
});


socket.on('delete', event => {
	// console.log("DELETE EVENT RECIEVED");

	// update UI
	$(`div#${event.symbol}`).parent().remove();
	$(`div#${event.symbol}`).remove();

	// reset local state
	localData.splice(0, localData.length);

	// import updated state
	event.data.map(stock => {
		localData.push(stock);
	})

	if (localData[0]) {
		// reset state
		symbol_current = localData[0][0].symbol;

		const d = c3_helpers.mapData(localData, localData[0][0].symbol);
		c3_chart.draw(d.dates, d.prices);
	} else {
		// reset state
		c3_chart.erase();
		symbol_current = '';
	}

	// CHECK
	// console.log('CURRENT : ', symbol_current);
	// console.log(localData.map(d => d[0].symbol));
})


// toggle
socket.on('toggle', event => {
	const d = c3_helpers.mapData(localData, event.symbol);
	symbol_current = event.symbol;

	$('.js-toggle-ticker .card-title').removeClass('highlight');
	$(`#${event.symbol} .card-title`).addClass('highlight');

	if (event.symbol) {
		c3_chart.draw(d.dates, d.prices, timescale);
	}
})
