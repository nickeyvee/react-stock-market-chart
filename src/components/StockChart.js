import React, { Component } from 'react';
import TimeScale from './TimeScale.js';
import Visualization from './Visualization.js';
import '../App.css';

class StockChart extends Component {
   constructor(props) {
      super(props);
      this.state = { disabled: false }
   }

   render() {
      const update = this.props.update;
      const dateRange = this.props.dateRange;
      const active = this.props.active;
      return (
         <div className="row">
            <div className="col s12 m12 l12">
               <div id="stockchart_card" className="card">
                  <div className="chart-wrapper card-content">
                     <TimeScale
                        update={update}
                        dateRange={dateRange}
                        isDisabled={this.state.disabled}
                        active={active}
                        // socket={this.props.socket}
                        addStock={this.props.addStock}
                        isLoading={this.props.isLoading}
                        loading={this.props.appState.loading}
                     />
                     <Visualization
                        dateRange={dateRange}
                        addStock={this.props.addStock}                        
                        isLoading={this.props.isLoading}
                        loading={this.props.appState.loading}
                     />
                  </div>
               </div>
            </div>
         </div>
      )
   }
}

export default StockChart;