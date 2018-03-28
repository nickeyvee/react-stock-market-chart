import React, { Component } from 'react';
import TimeScale from './TimeScale.js';
import Visualization from './Visualization.js';
import '../App.css';

class Price extends Component {
   render() {
      const price = this.props.snapshot.regularMarketPrice;
      const change = this.props.snapshot.regularMarketChange;
      const changePercent = this.props.snapshot.regularMarketChangePercent;

      return (
         <div id="price_label">
            <p className="price">{price != undefined ? '$ ' + price : ''}</p>
            <p className={`change ${change < 0 ? 'negative' : ''}`}>{
               `${(change != undefined ? (parseFloat(change).toFixed(2)) + ' ' : '')}
                ${(changePercent != undefined ? '(' + (parseFloat(changePercent).toFixed(2)) + '%)' : '')}`
            }</p>
         </div>
      )
   }
}

export default Price;