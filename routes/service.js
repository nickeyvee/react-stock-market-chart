var express = require('express');
var router = express.Router();
var fs = require('fs');

var yahoo = require('../services/finance.js');


router.get('/', function (req, res, next) {
   if (process.env.API_MODE) {
      res.send('API MODE IS ON');
   } else {
      res.send('API ROUTES (API MODE IS OFF)');
   }
});

router.get('/stocks', function (req, res, next) {
   res.json(yahoo.localData);
});

router.get('/snapshot/:symbol', function (req, res, next) {
   const symbol = req.params.symbol.toUpperCase();
   yahoo.getStockSnapshot(symbol).then(data => {
      res.json(data);
   })
});

router.post('/add', function (req, res, next) {
   const symbol = req.body.symbol;
   const range = req.body.range;

   yahoo.getOneStockBySymbol(symbol, range)
      .then(data => {
         if (data) {
            yahoo.storeStocksLocally(data);
            res.json(yahoo.localData);
         } else {
            res.status(404).send();
         }
      })
});

router.delete('/remove', function (req, res, next) {
   const symbol = req.body.symbol;

   yahoo.removeStock(symbol)
   res.json(yahoo.localData);
})

router.post('/timescale', function (req, res, next) {
   const symbol = req.body.symbol;
   const range = req.body.range;

   const stockNames = yahoo.getSavedStockNames()
      .map(d => d.symbol);

   yahoo.removeAll();

   yahoo.getStocksBySymbol(stockNames, range)
      .then(data => {
         yahoo.storeStocksLocally(data);
         res.json(yahoo.localData);
      })
});

module.exports = router;
