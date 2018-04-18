import React, { Component } from 'react';
import TimeScale from './TimeScale.js';
import Visualization from './Visualization.js';
import '../App.css';

class Price extends Component {
   render() {
      // console.log(typeof this.props.snapshot.regularMarketPrice != 'undefined');
      // const price = this.props.snapshot.regularMarketPrice;
      // const change = this.props.snapshot.regularMarketChange;
      // const changePercent = this.props.snapshot.regularMarketChangePercent;
      return (
         <div id="price_label">
            <p className="price">{typeof this.props.snapshot.regularMarketPrice != 'undefined' ? '$ ' + this.props.snapshot.regularMarketPrice : ''}</p>
            <p className={`change ${this.props.snapshot.regularMarketChange < 0 ? 'negative' : ''}`}>{
               `${(typeof this.props.snapshot.regularMarketChange != 'undefined' ? (parseFloat(this.props.snapshot.regularMarketChange).toFixed(2)) + ' ' : '')}
                ${(typeof this.props.snapshot.regularMarketChangePercent != 'undefined' ? '(' + (parseFloat(this.props.snapshot.regularMarketChangePercent).toFixed(2)) + '%)' : '')}`
            }</p>
         </div>
      )
   }
}

export default Price;