import React, { Component } from 'react';
import Search from './Search.js';
import '../App.css';

const chart = require('../chart/c3-chart.js');
const service = require('../services/dataService.js');

class TickerColumn extends Component {
   constructor(props) {
      super(props);
      this.state = { viewportWidth: window.innerWidth }
      this.removeStock = this.removeStock.bind(this);
      this.toggleStock = this.toggleStock.bind(this);
      this.updateDimensions = this.updateDimensions.bind(this);
   }

   componentDidMount() {
      window.addEventListener("resize", this.updateDimensions);
   }

   updateDimensions() {
      this.setState({ viewportWidth: window.innerWidth });
   }

   removeStock(event) {
      service.remove(event, this.props.tickers, this.props.active, this.props.dateRange,
         (newData, newSymbol) => {
            this.props.update({ stockPlotData: newData, activeSymbol: newSymbol });
         })
   }

   toggleStock(event) {
      const newSymbol = event.currentTarget.id;

      // collapse summary
      this.props.toggleSummary(false);

      if (newSymbol !== this.props.active) {
         chart.draw(this.props.tickers, newSymbol, this.props.dateRange);

         this.props.isLoading(true);
         this.props.update({ 'activeSymbol': newSymbol });

         service.getStockSnapshot(newSymbol).then(stockSnapshot => {
            this.props.update({
               'stockSnapshot': stockSnapshot.data.price,
               'stockSummary': stockSnapshot.data.summaryProfile,
            },() => {
               this.props.isLoading(false);
            });
         })
      }
   }

   render() {
      const name = this.props.snapshot.longName;
      const tickerRows = this.props.tickers.map((data, index) =>
         <div key={data[0].symbol} className="toggle-ticker">
            <div className="toggle-clickarea" id={data[0].symbol} onClick={e => this.toggleStock(e)}>
               <div className={`title ${this.props.active === data[0].symbol ? 'active' : ''}`}>{data[0].symbol}</div>
            </div>
            <div className="remove" id={data[0].symbol} onClick={e => this.removeStock(e)}>
               <i className="fa fa-times"></i>
            </div>
         </div>
      );

      return (
         <div id="stock_ticker_browser" className="js-tickers">
            <div className="row">
               <div className={`desktop-search-field ${this.state.viewportWidth > 450 ? '' : 'hidden'}`}>
                  <Search
                     tickers={this.props.tickers}
                     isDisabled={this.props.isDisabled}
                     dateRange={this.props.appState.dateRange}
                     addStock={this.props.addStock}
                  />
               </div>
            </div>
            {tickerRows}
         </div>
      )
   }
}

export default TickerColumn;