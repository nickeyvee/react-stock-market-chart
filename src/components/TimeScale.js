import React, { Component } from 'react';
import Search from './Search.js';
import '../App.css';

const service = require('../services/dataService.js');

class TimeScale extends Component {
   constructor(props) {
      super(props);
      this.state = { 
         isActive: false,
         viewportWidth: window.innerWidth
       }
      this.toggleTimePeriod = this.toggleTimePeriod.bind(this);
      this.revealMobileSearch = this.revealMobileSearch.bind(this);
      this.hideMobileSearch = this.hideMobileSearch.bind(this);
      this.updateDimensions = this.updateDimensions.bind(this);
   }

   componentDidMount() {
      window.addEventListener("resize", this.updateDimensions);
   }

   updateDimensions() {
      this.setState({ viewportWidth: window.innerWidth });
   }

   hideMobileSearch(event) {
      this.setState({ isActive: false });
   }

   revealMobileSearch(event) {
      this.setState({ isActive: !this.state.isActive });
   }

   toggleTimePeriod(event) {
      const newRange = event.currentTarget.value;

      // UPDATE UI FIRST
      this.props.update({ dateRange: parseInt(newRange, 10) });
      this.props.isLoading(true);

      service.timescale(this.props.active, newRange)
         .then(res => {
            this.props.update({ stockPlotData: res.data })
            this.props.isLoading(false);
         })
   }

   render() {
      const options = [1, 3, 12, 60].map((val, i) =>
         <button key={i.toString()} onClick={this.toggleTimePeriod} value={val}
            className={`timeperiod ${val === this.props.dateRange ? 'active-timeperiod' : ''}`}>
            {val < 12 ? val + 'M' : val / 12 + 'Y'}
         </button>
      );

      return (
         <div className="card-action">
            <div className="mobile-search" onClick={this.revealMobileSearch}>
               <i className="fa fa-search"></i>
            </div>
            <div className="timescale-options">
               {options}
            </div>
            <div className={`positioned-mobile-search ${this.state.isActive && this.state.viewportWidth < 450 ? '' : 'hidden'}`}>
               <Search
                  tickers={this.props.tickers}
                  isDisabled={this.state.disabled}
                  dateRange={this.props.dateRange}
                  addStock={this.props.addStock}
               />
            </div>
            <div className={`mobile-clickarea ${this.state.isActive && this.state.viewportWidth < 450 ? '' : 'hidden'}`} onClick={this.hideMobileSearch}></div>
         </div>
      )
   }
}

export default TimeScale;