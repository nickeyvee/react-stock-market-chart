import React, { Component } from 'react';
import TimeScale from './TimeScale.js';
import Visualization from './Visualization.js';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import '../App.css';

class Statistics extends Component {
   constructor(props) {
      super(props);
      this.state = { extended: false }
      this.expandSummary = this.expandSummary.bind(this);
   }

   expandSummary(event) {
      this.setState({ extended: !this.state.extended });
   }

   render() {

      const price = this.props.snapshot.regularMarketPrice;
      const summArray = this.props.summary.longBusinessSummary;
      const name = this.props.snapshot.longName;
      const symbol = this.props.snapshot.symbol;

      const condensedSummary = () => {
         if (summArray !== undefined) {
            return summArray.slice(0, 400).trim() + '...';
         }
      };

      const numberAbbreviated = (int) => {
         if(int === undefined) return;

         const str = int.toString()

         let exp = 0;
         for(let i = 0; i < str.length; i++) {
            if(i % 3 === 0 ) {
              exp = i;
            }
         }

         if(exp === 9) {
            return (int / (Math.pow(10, exp))).toFixed(2) + 'B';
         } else if(exp == 6) {
            return (int / (Math.pow(10, exp))).toFixed(2) + 'M';
         }
      }

      return (
         <div id="stats_card">
            <div className="stats-quant">
               <span>Statistics</span>
               <div className="custom-card">
                  <div className="heading">
                     <span className="price">{price != undefined ? '$ ' + price : ''}</span>
                     <span>
                     <p className="symbol">{symbol != undefined ? symbol : ''}</p>
                     <p className="name">{name != undefined ? name : ''}</p>
                     </span>
                  </div>
                  <ul>
                     <li>Open <span>{this.props.snapshot.regularMarketOpen}</span></li>
                     <li>High <span>{this.props.snapshot.regularMarketDayHigh}</span></li>
                     <li>Low <span>{this.props.snapshot.regularMarketDayLow}</span></li>
                     <li>Volume <span>{numberAbbreviated(this.props.snapshot.regularMarketVolume)}</span></li>
                     <li>Market&nbsp;Cap <span>{numberAbbreviated(this.props.snapshot.marketCap)}</span></li>
                  </ul>
               </div>
            </div>
            <div className="stats-summary">
               <span>About</span>
               <p>{this.state.extended ? this.props.summary.longBusinessSummary : condensedSummary()}</p>
               <button onClick={this.expandSummary} className="show-more">
                {this.state.extended ? 'COLLAPSE' : 'SHOW MORE'}
               </button>
            </div>
         </div>
      )
   }
}

export default Statistics;