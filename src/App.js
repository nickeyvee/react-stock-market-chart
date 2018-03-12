import React, { Component } from 'react';
// import io from 'socket.io-client';
// import axios from 'axios';
import './App.css';

import StockChart from './components/StockChart.js';
import TickerColumn from './components/TickerColumn.js';

const chart = require('./chart/c3-chart.js');
const service = require('./services/dataService.js');
const Materialize = require('materialize-css');

class App extends Component {
   constructor(props) {
      super(props);
      this.state = {
         disabled: false
      }
      this.addStock = this.addStock.bind(this);
   }

   addStock(symbol) {
      const valid = service.validate(symbol, this.props.tickers);

      // prevents double-clicking / spamming
      if (valid) {
         this.props.isLoading(true);
         this.setState({ disabled: true });
         setTimeout(() => {
            this.setState({ disabled: false });
         }, 1500);

         service.add(symbol, this.props.tickers, this.props.dateRange).then(data => {
            chart.draw(data, symbol, this.props.dateRange);

            // this.props.socket.emit('add', {
            //    'data': data,
            //    'symbol': symbol,
            //    'range': this.props.dateRange
            // })

            this.props.isLoading(false);
            this.props.update({ stockData: data, activeSymbol: symbol });
         }).catch(err => {
            console.warn(err.message);
            this.props.isLoading(false);
            Materialize.toast(err.message, 3000);
         })
      }
   }

   render() {
      const state = this.props.appState;
      const tickers = this.props.tickers;
      return (
         <div className="App" >
            <div className="container">
               <StockChart
                  appState={state}
                  isLoading={this.props.isLoading}
                  dateRange={state.dateRange}
                  addStock={this.addStock}                  
                  update={this.props.update}
                  active={state.activeSymbol}
                  // socket={state.socket}
               />
               <TickerColumn
                  tickers={tickers}
                  appState={state}
                  addStock={this.addStock}
                  isLoading={this.props.isLoading}
                  dateRange={state.dateRange}
                  update={this.props.update}
                  active={state.activeSymbol}
               // socket={state.socket}
               />
            </div>
         </div>
      );
   }
}
export default App;