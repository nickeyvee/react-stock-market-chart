'use strict';
const util = require('util');
const expect = require('chai').expect;
// How to run Mocha tests located in multiple files solution via stack overflow..
// https://stackoverflow.com/questions/24153261/joining-tests-from-multiple-files-with-mocha-js

function importTest(name, path) {
	describe(name, function () {
		require(path);
	});
}

// a file that doesn't exist..yet.
// This is where you can put common modules
// that are used in your tests :

// var common = require("./common");

describe("test entry point (main.js)\n", function () {
	beforeEach(function () {
		// console.log("running something before each test");
	});

	importTest("Yahoo Finance Service\n", './finance.spec.js');
	importTest("Client-side Helper Functions (C3)\n", './c3-helpers.spec.js');

	after(function () {
		//  process.exit();
	});
});