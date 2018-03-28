import React, { Component } from 'react';
import TimeScale from './TimeScale.js';
import Visualization from './Visualization.js';
import Transition from './Transition.js';
import { TransitionGroup } from 'react-transition-group';
import '../App.css';

const styles = {
   transition: 'height .5s',
   overflow: 'hidden'
},
   styles_two = {
      transition: 'opacity 0.2s ease-in'
   },
   initialState = {
      currentStock: '',
      // transition: 'opacity 0.2s',
      extended: false,
      height: 250,
      color: 'rgb(134, 143, 158)',
      opacity: 1
   };

class Statistics extends Component {
   constructor(props) {
      super(props);
      this.state = initialState;
      this.toggleSummary = this.toggleSummary.bind(this);
   }

   componentWillReceiveProps(nextProps) {
      console.log(nextProps.snapshot.symbol);
      if (this.state.currentStock !== nextProps.snapshot.symbol) {
         this.setState(initialState);
         // setTimeout(() => {
         //    this.setState({ opacity: 1, currentStock: nextProps.snapshot.symbol });
         // }, 800);
      }
   }

   toggleSummary(event) {
      this.setState({
         extended: !this.state.extended,
         height: (this.state.extended ? 250 : document.getElementById('summary_zippy').clientHeight + 25)
      });
   };

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
         if (int === undefined) return;

         const str = int.toString()

         let exp = 0;
         for (let i = 0; i < str.length; i++) {
            if (i % 3 === 0) {
               exp = i;
            }
         }

         if (exp === 9) {
            return (int / (Math.pow(10, exp))).toFixed(2) + 'B';
         } else if (exp == 6) {
            return (int / (Math.pow(10, exp))).toFixed(2) + 'M';
         }
      }

      return (
         <div id="stats_card">
            <div className="stats-quant">
               <span>Statistics</span>
               <div className="custom-card">
                  <div className="heading" style={{ color: this.state.color }}>
                     <span className="price">{price != undefined ? '$ ' + price : ''}</span>
                     <span>
                        <p className="symbol">{symbol != undefined ? symbol : ''}</p>
                        <p className="name">{name != undefined ? name : ''}</p>
                     </span>
                  </div>
                  <ul style={{ transition: this.state.transition, opacity: this.state.opacity }}>
                     <li>Open <span>{this.props.snapshot.regularMarketOpen}</span></li>
                     <li>High <span>{this.props.snapshot.regularMarketDayHigh}</span></li>
                     <li>Low <span>{this.props.snapshot.regularMarketDayLow}</span></li>
                     <li>Volume <span>{numberAbbreviated(this.props.snapshot.regularMarketVolume)}</span></li>
                     <li>Market&nbsp;Cap <span>{numberAbbreviated(this.props.snapshot.marketCap)}</span></li>
                  </ul>
               </div>
            </div>
            <div className="stats-summary" style={{ transition: this.state.transition, opacity: this.state.opacity }}>
               <span>About</span>
               <div style={{ ...styles, height: this.state.height }}>
                  <div id="summary_zippy" style={{ height: 'auto' }}>
                     <p>{/* {this.state.extended ? this.props.summary.longBusinessSummary : condensedSummary()} */
                        this.props.summary.longBusinessSummary}
                     </p>
                  </div>
               </div>
               <button onClick={this.toggleSummary} className="show-more">
                  {this.state.extended ? 'COLLAPSE' : 'SHOW MORE'}
               </button>
            </div>
         </div >
      )
   }
}

export default Statistics;