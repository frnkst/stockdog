'use strict';

/**
 * @ngdoc service
 * @name stockDogApp.QuoteService
 * @description
 * # QuoteService
 * Service in the stockDogApp.
 */
angular.module('stockDogApp')
  .service('QuoteService', function QuoteService($http, $interval) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var stocks = [];
    var BASE = 'http://query.yahooapis.com/v1/public/yql';

    // [1] Handles updating stock model with appropriate data from QuoteService
    var update = function (quotes) {
      if (quotes.length === stocks.length) {
        _.each(quotes, function (quote, idx) {
          var stock = stocks[idx];
          // stock.lastPrice = parseFloat(quote.LastTradePriceOnly);
          stock.lastPrice = _.random(-0.5, 0.5);
          stock.change = quote.Change;
          stock.percentChange = quote.ChangeInPercent;
          stock.marketValue = stock.shares * stock.lastPrice;
          stock.dayChange = stock.shares * parseFloat(stock.change);
          stock.save();
        });
      }
    };

    // [2] Helper function for managing which stocks to pull for
    this.register = function (stock) {
      stocks.push(stock);
    };
    this.deregister = function (stock) {
      _.remove(stocks, stock);
    };
    this.clear = function (stock) {
      stocks = [];
    };

    // [3] Main processing function for communicating with Yahoo Finance API
    this.fetch = function () {
      var symbols = _.reduce(stocks, function (symbols, stock) {
        symbols.push(stock.company.symbol);
        return symbols;
      }, []);
      var query = encodeURI('select * from yahoo.finance.quotes ' + 'where symbol in (\'' +
        symbols.join(',') + '\')');
      var url =  BASE + '?' + 'q=' + query + '&format=json&diagnostics=true' 
        + '&env=http://datatables.org/alltables.env';

      $http.jsonp(url + '&callback=JSON_CALLBACK')
        .success(function (data) {
          if (data.query.count) {
            var quotes = data.query.count > 1 ? data.query.results.quote : [data.query.results.quote];
            update(quotes);
          }
        })
        .error (function (error) {
          console.log(error);
        });
    };

    // [4] Used to fetch new quote data every 5 seconds
    var intervall = 10000;
    $interval(this.fetch, intervall);    
      
});
