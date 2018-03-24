import React, { Component } from 'react';
import TimeScale from './TimeScale.js';
import Visualization from './Visualization.js';
import Price from './Price.js';
// import Stats from './Stats.js';
import '../App.css';

class StockChart extends Component {
   constructor(props) {
      super(props);
      this.state = { disabled: false }
   }

   render() {
      const state = this.props.appState;
      const update = this.props.update;
      const dateRange = this.props.dateRange;
      const active = this.props.active;
      return (
         <div id="stockchart_card" className="custom-card">
            <div className="chart-wrapper card-content">
               <TimeScale
                  update={update}
                  dateRange={dateRange}
                  isDisabled={this.state.disabled}
                  active={active}
                  addStock={this.props.addStock}
                  isLoading={this.props.isLoading}
                  loading={this.props.appState.loading}
               />
               <Price
                  summary={this.props.summary}
                  snapshot={this.props.snapshot}
               />
               <Visualization
                  dateRange={dateRange}
                  addStock={this.props.addStock}
                  isLoading={this.props.isLoading}
                  loading={this.props.appState.loading}
               />
            </div>
         </div>
      )
   }
}

export default StockChart;