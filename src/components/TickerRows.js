const TickerRows = prop => this.props.tickers.map((data, index) =>
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