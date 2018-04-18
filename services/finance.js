'use strict';

// ==== YAHOO FINANCE API SERVICE ====

const yahooFinance = require('yahoo-finance');
const localData = [];

function deletelocalData() {
   localData.length = 0;
}

// ==== GET ONE STOCK FROM YAHOO ====

function getStocksBySymbol(symbols, range, period) {
   const today = new Date();
   const today_formatted = today.toISOString().substring(0, 10);

   if (!Array.isArray(symbols)) {
      throw new TypeError('only accepts an array type.');
   }

   if (!period) period = 'd';   // period default

   if (!range) {
      today.setMonth(today.getMonth() - 12);
   } else {
      today.setMonth(today.getMonth() - range);
   }

   if (range == 60) period = 'm';

   const date_range = today.toISOString().substring(0, 10);

   return yahooFinance.historical({
      symbols: symbols,
      from: date_range,
      to: today_formatted,
      period: period,  // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
   }).then(data => {
      return checkNullValues(data);
   })
}

// ==== GET MULTIPLE STOCKS FROM YAHOO ====

function getOneStockBySymbol(symbol, range, period) {
   const today = new Date();
   const today_formatted = today.toISOString().substring(0, 10);

   if (typeof symbol !== 'string') {
      throw new TypeError('only accepts a string.');
   }

   if (!period) period = 'd';  // period default

   if (!range) {
      today.setMonth(today.getMonth() - 3);
   } else {
      today.setMonth(today.getMonth() - range);
   }

   if (range == 60) period = 'w';

   const date_range = today.toISOString().substring(0, 10);

   return yahooFinance.historical({
      symbol: symbol,
      from: date_range,
      to: today_formatted,
      period: period,  // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
   }).then(data => {
      if (data.length) {
         return checkNullValues(data);
      } else {
         return false
      }
   })
}

/**
 * Makes data available in local memory.
 */
function storeStocksLocally(data) {
   // input validation
   if (typeof data === 'undefined') {
      throw new Error('No paramters provided');
   }
   // save new stocks
   if (Array.isArray(data)) {
      localData.push(data);
   }
   else if (typeof data == 'object') {
      for (let company in data) {
         if (data.hasOwnProperty(company)) {
            localData.push(data[company]);
         }
      }
      return localData;
   }
}

// ==== REMOVE SAVED STOCK ====

function removeStock(symbol) {
   let index;
   for (let i = 0; i < localData.length; i++) {

      if (localData[i][0].symbol === symbol) {
         // console.log('\n');
         // console.log('FOUND SYMBOL');
         index = i;
      }
   }
   if (index !== -1) {
      localData.splice(index, 1);
   }
   // console.log('\n');
   // console.log("argument : ", symbol);
   // console.log("found at index : ", index);
   // console.log(localData.map(d => d[0].symbol));
   // console.log('\n');
}


function getSavedStockNames() {
   return localData.map(stock => {
      return {
         'symbol': stock[0].symbol
      }
   })
}

function removeAll() {
   localData.splice(0, localData.length);
}


function checkNullValues(data) {
	/**
 * NULL VALUES ERROR :
 * On occasion Yahoo's API provides null values. 
 * When unchecked the data breaks my application.
 * May be a bug with yahoo finance api.
 * 
 * This function removes the items at each 
 * location and returns the new (mutated) array
 * with only valid information.
 */


   // ==== IF ONLY GETTING ONE STOCK ====

   if (Array.isArray(data)) {
      for (let i = data.length - 1; i >= 0; i--) {
         // console.log(data);
         if (data[i].close === null) {
            data.splice(i, 1);
         } else
            if (data[i].date === null) {
               data.splice(i, 1);
            }
      }
      return data;
   } else {

      // ==== IF GETTING MULTIPLE ====

      for (let company in data) {
         // console.log(data[company]);
         if (data.hasOwnProperty(company)) {
            for (let i = data[company].length - 1; i >= 0; i--) {
               if (data[company][i].close === null) {
                  data[company].splice(i, 1);
               } else
                  if (data[company][i].date === null) {
                     // console.log(true);
                     data[company].splice(i, 1);
                  }
            }
         }
      }

      // checks for undefined values.
      for (let company in data) {
         if (data.hasOwnProperty(company)) {
            if (typeof data[company][0] === 'undefined') {
               delete data[company];
            }
         }
      }
      return data;
   }
}


function getStockSnapshot(symbol) {
   return yahooFinance.quote({
      symbol: symbol,
      modules: ['price', 'summaryProfile']
   }).then( quotes => {
      return quotes;
   }).catch(err => {
      console.warn(err);
   })
}


module.exports = {
   getStocksBySymbol,
   getOneStockBySymbol,
   storeStocksLocally,
   getSavedStockNames,
   checkNullValues,
   getStockSnapshot,
   localData,
   removeStock,
   removeAll
}