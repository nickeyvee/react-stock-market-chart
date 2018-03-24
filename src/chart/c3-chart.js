
const $ = require("jquery");
const d3 = require('d3');
const c3 = require('c3');
const c3_helpers = require('./c3-helpers');

let chart;

function plot(dates, prices, range) {

   let culling = 6, tick_toggle = false, padding_dimensions = { left: -20, right: -20 };

   if (chart) {
      chart.destroy();
   }

   const months = [
      'Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
   ];

   // console.log('\n');
   // console.log('c3_chart() [function]');
   // console.log('Dates : ');
   // console.log(dates);
   // console.log('Prices : ');
   // console.log(prices);

   if (window.innerWidth > 600) {
      tick_toggle = true;
      padding_dimensions = {
         left: 30,
         right: 30
      };
   }

   function date_format(date, range, count) {
      range = parseInt(range, 10);

      if (range === 60) {
         culling = 5;
         return date.getFullYear();
      } else if (range === 1) {
         return `${months[date.getMonth()]} ${date.getDate()}`;
      } else {
         return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
      }
   }

   chart = c3.generate({
      padding: padding_dimensions,
      size: {
         height: 250
      },
      data: {
         x: 'x',
         columns: [dates, prices],
         types: {
            [prices[0]]: 'area',
         }
      },
      axis: {
         x: {
            type: 'timeseries',
            tick: {
               format: d => date_format(new Date(d), range),
               count: 6,
               culling: culling,
            },
            show: tick_toggle
         },
         y: {
            tick: {
               format: d3.format("$,")
            },
            min: Math.min.apply(Math, prices.slice(1, prices.length)),
            show: false
         }
      },
      point: {
         show: false
      }
   });

   // apply css :
   $(`#chart .c3-line-${prices[0]}`).css({ "stroke-width": "2px" });
}

function erase() {
   chart = chart.destroy();
}

function draw(data, symbol, range, viewport) {
   // console.log(data, symbol, range);
   const d = c3_helpers.mapData(data, symbol);
   plot(d.dates, d.prices, range, viewport);
}

module.exports = {
   draw, plot, erase
}