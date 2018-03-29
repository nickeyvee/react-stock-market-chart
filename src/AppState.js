import React, { Component } from 'react';
// import io from 'socket.io-client';
import axios from 'axios';
import './App.css';

import chart from './chart/c3-chart.js';
import service from './services/dataService.js';

class AppState extends Component {
   constructor(props) {
      super(props);
      // const socket = io.connect(process.env.REACT_APP_DOMAIN);
      this.state = {
         stockPlotData: [],
         stockSnapshot: [],
         stockSummary: [],
         dateRange: 0,
         activeSymbol: '',
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

      // get stock data into our app

      axios.get(`/data/stocks`)
         .then(d => {
            const stockPlotData = d.data.map(stock => stock);
            const activeSymbol = !stockPlotData.length ? null : stockPlotData[0][0].symbol;
            let dateRange = 12;

            if (activeSymbol) {
               const diff = service.monthDiff(stockPlotData[0][0].date, stockPlotData[0][stockPlotData[0].length - 1].date);
               dateRange = service.deduceDateRange(diff);
            }

            axios.get(`data/snapshot/${activeSymbol}`)
               .then(stockSnapshot => {
                  this.setAppState({
                     'stockPlotData': stockPlotData,
                     'stockSnapshot': stockSnapshot.data.price,
                     'stockSummary': stockSnapshot.data.summaryProfile,
                     'activeSymbol': activeSymbol,
                     'dateRange': dateRange
                  }, done => {
                     if (stockPlotData.length === 0) {
                        return;
                     }

                     // console.log(this.state.stockSnapshot.data);

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