import React, { Component } from 'react';
import Search from './Search.js';
import '../App.css';

const chart = require('../chart/c3-chart.js');
const service = require('../services/dataService.js');

class TickerColumn extends Component {
   constructor(props) {
      super(props);
      this.state = {
         viewportWidth: window.innerWidth
      }
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
            // this.props.socket.emit('delete', { 'data': newData, 'active': newSymbol })
            this.props.update({ stockData: newData, activeSymbol: newSymbol });
         })
   }

   toggleStock(event) {
      const newSymbol = event.currentTarget.id;

      if (newSymbol !== this.props.active) {
         chart.draw(this.props.tickers, newSymbol, this.props.dateRange);
         // this.props.socket.emit('toggle', { 'symbol': newSymbol });
         this.props.update({ activeSymbol: newSymbol });
      }
   }

   render() {

      // ==== WEBSOCKET EVENT REGISTRATION ====
      // this.props.socket.on('toggle', event => {
      //    this.props.update({ activeSymbol: event.symbol });
      //    chart.draw(this.props.tickers, event.symbol, this.props.dateRange);
      // })

      // this.props.socket.on('add', event => {
      //    this.props.update({ stockData: event.data, activeSymbol: event.symbol });
      //    chart.draw(this.props.tickers, event.symbol, this.props.dateRange);
      // })

      // this.props.socket.on('delete', event => {
      //    this.props.update({ stockData: event.data, activeSymbol: event.active });
      //    chart.draw(this.props.tickers, event.active, this.props.dateRange);
      // })

      // this.props.socket.on('timescale', event => {
      //    chart.draw(event.data, this.props.active, event.range);
      //    this.props.update({ stockData: event.data, dateRange: event.range });
      // })

      const tickerRows = this.props.tickers.map((data, index) =>
         <div key={data[0].symbol} className="col s12 m12 l4">
            <div className="card toggle-ticker">
               <div className="card-content">
                  <div className="row">
                     <div className={`card-title col s8 ${this.props.active === data[0].symbol ? 'active' : ''}`}
                        id={data[0].symbol} onClick={e => this.toggleStock(e)}>{data[0].symbol}</div>
                     <div className="remove col s2 pull-s1" id={data[0].symbol} onClick={e => this.removeStock(e)}>
                        <i className="fa fa-times"></i>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );

      return (
         <div className="tickers js-tickers row" >
            {tickerRows}
            <div className="col s12 m12 l4">
               <div className={`desktop-search-field ${this.state.viewportWidth > 450 ? '' : 'hidden'}`}>
                  <Search
                     tickers={this.props.tickers}
                     isDisabled={this.props.isDisabled}
                     dateRange={this.props.appState.dateRange}
                     addStock={this.props.addStock}
                  />
               </div>
            </div>
         </div>
      )
   }
}

export default TickerColumn;