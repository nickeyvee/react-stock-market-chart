import React, { Component } from 'react';
// import io from 'socket.io-client';
import axios from 'axios';
import './App.css';

import chart from './chart/c3-chart.js';
import service from './services/dataService.js';

class AppState extends Component {
   constructor(props) {
      super(props);
      this.state = {
         stockPlotData: [],
         stockSnapshot: [],
         stockSummary: [],
         dateRange: 0,
         activeSymbol: 'TSLA',
         loading: false
      }
      this.setAppState = this.setAppState.bind(this);
      this.getTickerList = this.getTickerList.bind(this);
      this.getActiveSymbol = this.getActiveSymbol.bind(this);
      this.loadingStatus = this.loadingStatus.bind(this);
      this.updateWindowWidth = this.updateWindowWidth.bind(this);
      this.getStockSummary = this.getStockSummary.bind(this);
      this.getSnapshot = this.getSnapshot.bind(this);
   }

   componentDidMount() {
      // get stock data into our app for our selected stock,
      // will get data for ONE stock by default
      const stockData = axios.get(`/data/stocks`).then(d => {
         const stockPlotData = d.data.map(stock => stock);
         const activeSymbol = !stockPlotData.length ? null : stockPlotData[0][0].symbol;
         let dateRange = 12;

         if (activeSymbol) {
            const diff = service.monthDiff(stockPlotData[0][0].date, stockPlotData[0][stockPlotData[0].length - 1].date);
            dateRange = service.deduceDateRange(diff);
         }
         return {
            'stockPlotData': stockPlotData,
            'activeSymbol': activeSymbol,
            'dateRange': dateRange
         }
      });

      const snapshot = axios.get(`data/snapshot/${this.state.activeSymbol}`).then(stockSnapshot => stockSnapshot);

      Promise.all([stockData, snapshot]).then(payload => {
         this.setAppState({
            'stockPlotData': payload[0].stockPlotData,
            'stockSnapshot': payload[1].data.price,
            'stockSummary': payload[1].data.summaryProfile,
            'activeSymbol': payload[0].activeSymbol,
            'dateRange': payload[0].dateRange
         }, done => {
            // draw nothing when no stock data exists
            // will break out of function
            if (payload[0].stockPlotData.length === 0) {
               return;
            }
            chart.draw(
               this.state.stockPlotData,
               this.state.activeSymbol,
               this.state.dateRange,
            )
            // get window (viewport) size
            this.updateWindowWidth();
            window.addEventListener('resize', this.updateWindowWidth);
         });
      })
   }

   componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowWidth);
   }

   setAppState(newState, callback) {
      this.setState(newState, () => {
         if (this.props.debug) {
            console.log('setAppState', JSON.stringify(this.state));
         }
         if (callback) callback();
      })
   }

   updateWindowWidth() {
      chart.draw(
         this.state.stockPlotData,
         this.state.activeSymbol,
         this.state.dateRange
      )
   }

   getSnapshot(symbol) {
      return this.state.stockSnapshot;
   }

   getStockSummary(symbol) {
      return this.state.stockSummary;
   }

   getActiveSymbol() {
      return this.state.activeSymbol;
   }

   getTickerList() {
      return this.state.stockPlotData.map(d => d);
   }

   loadingStatus(bool) {
      this.setState({ loading: bool });
   }

   render() {
      return (
         <div className="AppState">
            {React.Children.map(this.props.children, child => {
               return React.cloneElement(child, {
                  appState: this.state,
                  update: this.setAppState,
                  tickers: this.getTickerList(),
                  snapshot: this.getSnapshot(),
                  summary: this.getStockSummary(),
                  getActiveSymbol: this.getActiveSymbol(),
                  isLoading: this.loadingStatus
               })
            })}
         </div>
      )
   }
}

export default AppState;