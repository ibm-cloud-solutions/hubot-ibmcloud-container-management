/*
  * Licensed Materials - Property of IBM
  * (C) Copyright IBM Corp. 2016. All Rights Reserved.
  * US Government Users Restricted Rights - Use, duplication or
  * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
  */
'use strict';

const Helper = require('hubot-test-helper');
const helper = new Helper('../src/scripts');
const expect = require('chai').expect;
const mockUtils = require('./mock.utils.ic.js');
const mockCFUtils = require('./mock.utils.cf.js');
const mockESUtils = require('./mock.utils.es.js');
const sprinkles = require('mocha-sprinkles');

// --------------------------------------------------------------
// i18n (internationalization)
// It will read from a peer messages.json file.  Later, these
// messages can be referenced throughout the module.
// --------------------------------------------------------------
const i18n = new (require('i18n-2'))({
	locales: ['en'],
	extension: '.json',
	// Add more languages to the list of locales when the files are created.
	directory: __dirname + '/../src/messages',
	defaultLocale: 'en',
	// Prevent messages file from being overwritten in error conditions (like poor JSON).
	updateFiles: false
});
// At some point we need to toggle this setting based on some user input.
i18n.setLocale('en');

// Length of time to wait for a message
const timeout = 1000;

// Passing arrow functions to mocha is discouraged: https://mochajs.org/#arrow-functions
// return promises from mocha tests rather than calling done() - http://tobyho.com/2015/12/16/mocha-with-promises/
describe('Interacting with Bluemix containers via RegEx', function() {

	let room;
	let cf;

	before(function() {
		mockUtils.setupMockery();
		mockCFUtils.setupMockery();
		mockESUtils.setupMockery();
		// initialize cf, hubot-test-helper doesn't test Middleware
		cf = require('hubot-cf-convenience');
		return cf.promise.then();
	});

	beforeEach(function() {
		room = helper.createRoom();
		// Force all emits into a reply.
		room.robot.on('ibmcloud.formatter', function(event) {
			if (event.message) {
				event.response.reply(event.message);
			}
			else {
				event.response.send({attachments: event.attachments});
			}
		});
	});

	afterEach(function() {
		room.destroy();
	});

	context('user calls `container list`', function() {
		it('should send a slack event with a list of containers', function(done) {
			room.robot.on('ibmcloud.formatter', function(event) {
				expect(event.attachments.length).to.eql(3);
				expect(event.attachments[0].title).to.eql('testContainer1');
				expect(event.attachments[1].title).to.eql('testContainer2');
				done();
			});
			room.user.say('mimiron', '@hubot container list').then();
		});
	});

	context('user calls `containergroup list`', function() {
		it('should send a slack event with a list of containergroups', function(done) {
			return room.user.say('mimiron', '@hubot containergroup list').then(() => {
				return sprinkles.eventually({
					timeout: timeout
				}, function() {
					if (room.messages.length < 4) {
						throw new Error('too soon');
					}
				}).then(() => false).catch(() => true).then((success) => {
					expect(room.messages.length).to.eql(3);
					let response = room.messages[1];
					expect(response).to.eql(['hubot', '@mimiron ' + i18n.__('containergroup.list.in.progress')]);
					let event = room.messages[2][1];
					expect(event.attachments.length).to.eql(1);
					expect(event.attachments[0].title).to.eql('testContainerGroup1');
					done();
				});
			});
		});
	});

	context('user calls `container status` for non existing container', function() {
		it('should send a slack event with container status', function(done) {
			return room.user.say('mimiron', '@hubot container status testContainer4').then(() => {
				expect(room.messages.length).to.eql(2);
				let response = room.messages[1];
				expect(response).to.eql(['hubot', '@mimiron ' + i18n.__('container.name.not.found', 'testContainer4')]);
				done();
			});
		});
	});

	context('user calls `container status` for an existing container', function() {
		it('should send a slack event with container status', function(done) {
			return room.user.say('mimiron', '@hubot container status testContainer1').then(() => {
				return sprinkles.eventually({
					timeout: timeout
				}, function() {
					if (room.messages.length < 4) {
						throw new Error('too soon');
					}
				}).then(() => false).catch(() => true).then((success) => {
					expect(room.messages.length).to.eql(3);
					let response = room.messages[1];
					expect(response).to.eql(['hubot', '@mimiron ' + i18n.__('container.status.in.progress', 'testContainer1', 'testSpace')]);
					let event = room.messages[2][1];
					expect(event.attachments.length).to.eql(1);
					expect(event.attachments[0].title).to.eql('testContainer1');
					done();
				});
			});
		});
	});

	context('user calls `container start`', function() {
		beforeEach(function() {
			// Don't move on from this until the promise resolves
			room.user.say('mimiron', '@hubot container start testContainer1');
			return room.user.say('mimiron', '@hubot container start testContainer4');
		});

		it('should respond with started', function() {
			expect(room.messages.length).to.eql(5);
			expect(room.messages[3]).to.eql(['hubot', '@mimiron ' + i18n.__('container.start.success', 'testContainer1')]);
		});

		it('should respond with not found', function() {
			expect(room.messages.length).to.eql(5);
			expect(room.messages[4]).to.eql(['hubot', '@mimiron ' + i18n.__('container.name.not.found', 'testContainer4')]);
		});
	});

	context('user calls `container logs`', function() {
		beforeEach(function() {
			// Don't move on from this until the promise resolves
			room.user.say('mimiron', '@hubot container logs for testContainer1');
			return room.user.say('mimiron', '@hubot container logs for testContainer4');
		});

		it('should respond with container logs', function() {
			expect(room.messages.length).to.eql(5);
			expect(room.messages[2]).to.eql(['hubot', '@mimiron ' + i18n.__('container.get.logs.in.progress', 'testContainer1')]);
		});

		it('should respond with not found', function() {
			expect(room.messages.length).to.eql(5);
			expect(room.messages[4]).to.eql(['hubot', '@mimiron ' + i18n.__('container.name.not.found', 'testContainer4')]);
		});
	});


	context('user calls `container stop` with valid container', function() {
		it('Should have a clean conversation.', function(done) {
			return room.user.say('mimiron', '@hubot container stop testContainer1').then(() => {
				let response = room.messages[room.messages.length - 1];
				expect(response).to.eql(['hubot', '@mimiron ' + i18n.__('container.stop.prompt', 'testContainer1')]);
				room.user.say('mimiron', 'yes');
				return sprinkles.eventually({
					timeout: timeout
				}, function() {
					if (room.messages.length < 4) {
						throw new Error('too soon');
					}
				}).then(() => false).catch(() => true).then((success) => {
					expect(room.messages.length).to.eql(5);
					expect(room.messages[4]).to.eql(['hubot', '@mimiron ' + i18n.__('container.stop.success', 'testContainer1')]);
					done();
				});
			});
		});
	});

	context('user calls `container stop` with an invalid container', function() {
		it('Should have a clean conversation.', function(done) {
			return room.user.say('mimiron', '@hubot container stop testContainer4').then(() => {
				let response = room.messages[room.messages.length - 1];
				expect(response).to.eql(['hubot', '@mimiron ' + i18n.__('container.stop.prompt', 'testContainer4')]);
				room.user.say('mimiron', 'yes');
				return sprinkles.eventually({
					timeout: timeout
				}, function() {
					if (room.messages.length < 4) {
						throw new Error('too soon');
					}
				}).then(() => false).catch(() => true).then((success) => {
					expect(room.messages.length).to.eql(4);
					expect(room.messages[3]).to.eql(['hubot', '@mimiron ' + i18n.__('container.name.not.found', 'testContainer4')]);
					done();
				});
			});
		});
	});

	context('user calls `containergroup scale`', function() {

		beforeEach(function() {
			// Don't move on from this until the promise resolves
			room.user.say('mimiron', '@hubot containergroup scale testContainer1 2');
			return room.user.say('mimiron', '@hubot containergroup scale testContainerGroup1 2');
		});

		it('should respond with not found', function() {
			setTimeout(() => {
				expect(room.messages.length).to.eql(6);
				expect(room.messages[4]).to.eql(['hubot', '@mimiron ' + i18n.__('containergroup.scale.failure', 'testContainer1')]);
			}, 200);
		});

		it('should respond with scaled', function() {
			setTimeout(() => {
				expect(room.messages.length).to.eql(6);
				expect(room.messages[5]).to.eql(['hubot', '@mimiron ' + i18n.__('containergroup.scale.success', 'testContainerGroup1', 2)]);
			}, 200);
		});
	});

	context('user calls `containergroup remove`', function() {
		beforeEach(function() {
			// Don't move on from this until the promise resolves
			room.user.say('mimiron', '@hubot containergroup remove testContainerGroup1');
			return room.user.say('mimiron', '@hubot containergroup remove testContainerGroup4');
		});

		it('should respond with check', function() {
			expect(room.messages[2]).to.eql(['hubot', '@mimiron ' + i18n.__('containergroup.remove.prompt', 'testContainerGroup1')]);
			return room.user.say('mimiron', 'yes');
		});
	});

	context('user calls `container remove`', function() {
		beforeEach(function() {
			// Don't move on from this until the promise resolves
			room.user.say('mimiron', '@hubot container remove testContainer1');
			return room.user.say('mimiron', '@hubot container remove testContainer4');
		});

		it('should respond with check', function() {
			expect(room.messages[2]).to.eql(['hubot', '@mimiron ' + i18n.__('container.remove.prompt', 'testContainer1')]);
			return room.user.say('mimiron', 'yes');
		});
	});

	context('user calls `container help`', function() {
		beforeEach(function() {
			return room.user.say('mimiron', '@hubot container help');
		});

		it('should respond with help', function() {
			expect(room.messages.length).to.eql(2);
			let help = 'hubot container delete|destroy|remove [container] - ' + i18n.__('help.container.delete') + '\n'
				+ 'hubot container list|show - ' + i18n.__('help.container.show') + '\n'
				+ 'hubot container logs [container] - ' + i18n.__('help.container.logs') + '\n'
				+ 'hubot container start [container] - ' + i18n.__('help.container.start') + '\n'
				+ 'hubot container status [container] - ' + i18n.__('help.container.status') + '\n'
				+ 'hubot container stop [container] - ' + i18n.__('help.container.stop') + '\n';

			expect(room.messages[1]).to.eql(['hubot', '@mimiron \n' + help]);
		});
	});

	context('user calls `containergroup help`', function() {
		beforeEach(function() {
			return room.user.say('mimiron', '@hubot containergroup help');
		});

		it('should respond with help', function() {
			expect(room.messages.length).to.eql(2);
			let help = 'hubot containergroup delete|destroy|remove [container_group] - ' + i18n.__('help.containergroup.delete') + '\n'
				+ 'hubot containergroup list|show - ' + i18n.__('help.containergroup.show') + '\n'
				+ 'hubot containergroup scale [container_group] [number] - ' + i18n.__('help.containergroup.scale') + '\n';

			expect(room.messages[1]).to.eql(['hubot', '@mimiron \n' + help]);
		});
	});
});
