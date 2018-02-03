'use strict';
const fs = require('fs');
const util = require('util');
const expect = require('chai').expect;


describe('helpers.js', function () {
   const c3_helper = require('../src/chart/c3-helpers.js');

   it('should exist', function () {
      expect(c3_helper).to.exist;
   })
});

const c3_helper = require('../src/chart/c3-helpers.js');

// JSON object for unit tests.
let mock;
 
describe('mockfile.json', function () {
 
    before(function (done) {
        fs.readFile('./tests/mocks/mockfile.json', 'utf8', function (err, data) {
            if (err) throw err;
            mock = JSON.parse(data);
            done();
        });
    })
 
    it('should exist', function () {
        expect(mock).to.exist;
    })
 
    it('should be an array of objects', function () {
        expect(mock).to.be.an('array');
        expect(mock[0]).to.be.an('array');
    })
})

describe('mapStock', function() {
	it('should be valid', function() {

		const data = c3_helper.mapData(mock, 'TSLA');

		expect(data.prices).to.be.an('array');
		expect(data.dates).to.be.an('array');
		expect(data.prices[0]).to.equal('TSLA');
		expect(data.dates[0]).to.equal('x');
	})
})