const axios = require('axios');
const chart = require('../chart/c3-chart.js');
const Materialize = require('materialize-css');
const moment = require('moment');

function validate(symbol, tickers) {
   const symbols = tickers.map(d => d[0].symbol);
   const found = symbols.find(stock => stock === symbol);
   const re = /^[A-Z]+$/;

   // console.log('\n');
   // console.log('Validate');
   // console.log('Not found? ', !found);

   if (!re.test(symbol)) {
      Materialize.toast('Symbol can only contain letters [a-z]', 3000);
      return false;
   } else if (symbol.length > 5) {
      Materialize.toast('Valid symbols can be no longer than 5 characters in length');
      return false;
   }

   if (!found) {
      console.warn('A ticker was submitted : ' + symbol, 3000);
      return true;
   } else {
      Materialize.toast(`Ticker ${symbol} was already added`, 3000);
      return false;
   }
}

function add(symbol, tickers, range) {

   return axios.post('/data/add', {
      'symbol': symbol,
      'range': range
   }).then(res => {
      const newArray = []
      // console.log(res.data.map(d => d[0].symbol));
      res.data.map(d => newArray.push(d));
      return newArray;
   }).catch(err => {
      throw new Error('Symbol not found');
   })
}


function remove(event, tickers, active, range, callback) {
   const symbols = tickers.map(d => d[0].symbol);
   const newState = tickers;
   const symbol = event.currentTarget.id;
   const index = symbols.indexOf(symbol);

   // console.log(typeof range);


   if (index > -1) {
      // reset state here
      newState.splice(index, 1);

      // console.log('\n');
      // console.log('remove');
      // console.log(symbol, newState.map(d => d[0].symbol));

      if (newState.length === 0) {
         // console.log('case 1');
         chart.erase();
         callback(newState, '');

      } else if (symbol === active) {
         // console.log('case 2');
         // console.log(newState, newState[0][0].symbol);

         chart.draw(newState, newState[0][0].symbol, range);
         callback(newState, newState[0][0].symbol);

      } else {
         // console.log('case 3');
         chart.draw(newState, newState[0][0].symbol, range);
         callback(newState, newState[0][0].symbol);
      }

      axios.delete('data/remove', {
         data: { 'symbol': symbol }
      });
   }
}

function timescale(symbol, range) {
   return axios.post('data/timescale', {
      'symbol': symbol,
      'range': range
   }).then(res => {
      chart.draw(res.data, symbol, range);
      return {
         'data': res.data,
         'range': range
      }
   })
}

function monthDiff(d1, d2) {
   const a = moment(d1);
   const b = moment(d2);

   // console.log(a.diff(b, 'months'));
   return a.diff(b, 'months');
}

function deduceDateRange(diff) {
   if (diff === 0 || diff === 1) {
      return 1;
   } else if (1 < diff && diff <= 3) {
      return 3;
   } else if (3 < diff && diff <= 12) {
      return 12;
   } else if (12 < diff && diff <= 60) {
      return 60;
   } else {
      return 12;
   }
}

function getStockSnapshot(symbol) {
   return axios.get(`data/snapshot/${symbol}`)
      .then(data => {
         return data;
      })
      .catch(err => {
         console.log(err);
      })
}


module.exports = {
   add, remove, validate, timescale, monthDiff, deduceDateRange, getStockSnapshot
}