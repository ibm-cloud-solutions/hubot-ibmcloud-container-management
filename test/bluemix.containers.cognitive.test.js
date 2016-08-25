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

// Passing arrow functions to mocha is discouraged: https://mochajs.org/#arrow-functions
// return promises from mocha tests rather than calling done() - http://tobyho.com/2015/12/16/mocha-with-promises/
describe('Interacting with Bluemix containers via natural language', function() {

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
	});

	afterEach(function() {
		room.destroy();
	});

	context('container help - user says `I want help with containers` ', function() {
		it('should display help', function(done) {

			room.robot.on('ibmcloud.formatter', (event) => {
				expect(event.message).to.be.a('string');
				expect(event.message).to.contain('container delete');
				expect(event.message).to.contain('container list|show');
				expect(event.message).to.contain('container logs [container]');
				expect(event.message).to.contain('container start [container]');
				expect(event.message).to.contain('container status [container]');
				expect(event.message).to.contain('container stop [container]');
				done();
			});

			var res = { message: {text: 'I want help with containers'}, response: room };
			room.robot.emit('bluemix.container.help', res, {});

		});
	});

	context('container list - user says `I want to list my containers`', function() {
		it('should list containers', function(done) {

			room.robot.on('ibmcloud.formatter', (event) => {
				expect(event).to.exist;
				expect(event.attachments).to.exist;
				expect(event.attachments.length).to.exist;
				expect(event.attachments.length).to.eql(3);
				expect(event.attachments[0].title).to.eql('testContainer1');
				expect(event.attachments[1].title).to.eql('testContainer2');
				done();
			});

			var res = { message: {text: 'I want to list my containers'}, user: {id: 'mimiron'}, response: room };
			room.robot.emit('bluemix.container.list', res, {});

		});
	});

	context('container logs - user says `Show me the logs for container testContainer1`', function() {
		it('should display logs for `testContainer1` ', function(done) {
			// 2. Listens for dialog response.
			room.robot.on('ibmcloud.formatter', (event) => {
				expect(event.message).to.contain('Getting logs for container *testContainer1* ...');
				done();
			});
			// 1. Mock Natural Language message by calling emit.
			var res = { message: {text: 'Show me the logs for container testContainer1', user: {id: 'mimiron'}, response: room }};
			room.robot.emit('bluemix.container.logs', res, { containername: 'testContainer1' });
		});

		it('should fail display logs due to missing containername parameter ', function(done) {

			room.robot.on('ibmcloud.formatter', (event) => {
				expect(event.message).to.contain('I\'m having problems understanding the name of your container. To display logs use *container logs [container]*');
				done();
			});
			// 1. Mock Natural Language message by calling emit.
			var res = { message: {text: 'Show me the logs', user: {id: 'mimiron'}}, response: room };
			room.robot.emit('bluemix.container.logs', res, {});
		});
	});

	context('container remove - user says `I want to remove container testContainer1`', function() {
		it('should remove `testContainer1`', function(done) {

			// 5. Listens for dialog response.
			room.robot.on('ibmcloud.formatter', (event) => {
				if (event.message === 'Deleting container *testContainer1* in the *testSpaceGuid* space. Change spaces using *space set [space_name]*.') {
					expect(event.message).to.contain('Deleting container *testContainer1* in the *testSpaceGuid* space. Change spaces using *space set [space_name]*.');
				}
				else if (event.message === 'Container *testContainer1* has been successfully deleted.'){
					expect(event.message).to.contain('Container *testContainer1* has been successfully deleted.');
					done();
				}
			});

			// 2. Handle the dialog questions.
			var replyFn = function(msg){
				// 3. Sends a message to the room with the response to dialog requesting container name.
				if (msg === 'Are you sure that you want to remove container *testContainer1*?') {
					room.user.say('mimiron', 'yes');
				}
				else {
					done(Error('Unexpected dialog question: ' + msg));
				}

			};

			// 1. Mock Natural Language message by calling emit.
			var res = { message: {text: 'I want to remove container testContainer1', user: {id: 'mimiron'}}, response: room, reply: replyFn };
			room.robot.emit('bluemix.container.remove', res, { containername: 'testContainer1' });
		});

		it('should fail remove container due to missing containername parameter ', function(done) {

			room.robot.on('ibmcloud.formatter', (event) => {
				expect(event.message).to.contain('I\'m having problems understanding the name of your container. To remove an container use *container remove [container]*');
				done();
			});
			// 1. Mock Natural Language message by calling emit.
			var res = { message: {text: 'I want to remove container', user: {id: 'mimiron'}}, response: room };
			room.robot.emit('bluemix.container.remove', res, {});
		});
	});

	context('container start - user says `I want to start container testContainer1`', function() {
		it('should start `testContainer1`', function(done) {

			room.robot.on('ibmcloud.formatter', (event) => {
				expect(event.message).to.be.a('string');
				expect(event.message).to.contain('Starting container *testContainer1*.');
				done();
			});

			var res = { message: {text: 'I want to start container testContainer1'}, response: room };
			room.robot.emit('bluemix.container.start', res, { containername: 'testContainer1' });
		});


		it('should fail to start `testContainer4Name`', function(done) {

			room.robot.on('ibmcloud.formatter', (event) => {
				expect(event.message).to.be.a('string');
				expect(event.message).to.contain('Failed to start container *testContainer4Name*');
				done();
			});

			var res = { message: {text: 'I want to start container testContainer4Name'}, response: room };
			room.robot.emit('bluemix.container.start', res, { containername: 'testContainer4Name' });
		});

		it('should fail start container due to missing containername parameter ', function(done) {

			room.robot.on('ibmcloud.formatter', (event) => {
				expect(event.message).to.contain('I\'m having problems understanding the name of your container. To start an container use *container start [container]*');
				done();
			});
			// 1. Mock Natural Language message by calling emit.
			var res = { message: {text: 'I want to start container', user: {id: 'mimiron'}}, response: room };
			room.robot.emit('bluemix.container.start', res, {});
		});
	});


	context('container status', function() {
		it('should display status `testContainer1` when user says `What is the status of container testContainer1?`', function(done) {

			// 4. Listens for dialog response.
			room.robot.on('ibmcloud.formatter', (event) => {
				if (event.message === 'Getting status for *testContainer1* in the *testSpaceGuid* space.') {
					expect(event.message).to.contain('Getting status for *testContainer1* in the *testSpaceGuid* space.');
				}
				else if (event.attachments){
					expect(event.attachments.length).to.eql(1);
					expect(event.attachments[0].title).to.eql('testContainer1');
					done();
				}
			});

			// 1. Mock Natural Language message by calling emit.
			var res = { message: {text: 'What is the status of container testContainer1?', user: {id: 'mimiron'}}, response: room };
			room.robot.emit('bluemix.container.status', res, { containername: 'testContainer1' });

		});

		it('should fail display status due to missing containername parameter ', function(done) {

			room.robot.on('ibmcloud.formatter', (event) => {
				expect(event.message).to.contain('I\'m having problems understanding the name of your container. To display the status of an container use *container status [container]*');
				done();
			});
			// 1. Mock Natural Language message by calling emit.
			var res = { message: {text: 'What is the status of container', user: {id: 'mimiron'}}, response: room };
			room.robot.emit('bluemix.container.status', res, {});
		});
	});

	context('container stop', function() {
		it('should stop `testContainer1` when user says `I want to stop container testContainer1`', function(done) {

			// 4. Listens for dialog response.
			room.robot.on('ibmcloud.formatter', (event) => {
				expect(event.message).to.contain('Stopping container *testContainer1*.');
				done();
			});

			// 2. Handle the dialog question.
			var replyFn = function(msg){
				// 3. Respond to open dialog.
				if (msg.indexOf('Are you sure that you want to stop') >= 0) {
					return room.user.say('mimiron', 'yes');
				}
			};

			// 1. Mock Natural Language message by calling emit.
			var res = { message: {text: 'I want to stop container testContainer1', user: {id: 'mimiron'}}, response: room, reply: replyFn };
			room.robot.emit('bluemix.container.stop', res, { containername: 'testContainer1' });
		});

		it('should fail stop container due to missing containername parameter ', function(done) {

			room.robot.on('ibmcloud.formatter', (event) => {
				expect(event.message).to.contain('I\'m having problems understanding the name of your container. To stop an container use *container stop [container]*');
				done();
			});
			// 1. Mock Natural Language message by calling emit.
			var res = { message: {text: 'I want to stop container', user: {id: 'mimiron'}}, response: room };
			room.robot.emit('bluemix.container.stop', res, {});
		});
	});

	context('user calls `containergroup help`', function() {
		it('should respond with help', function(done) {
			room.robot.on('ibmcloud.formatter', (event) => {
				expect(event.message).to.be.a('string');
				expect(event.message).to.contain('containergroup delete');
				expect(event.message).to.contain('containergroup list|show');
				expect(event.message).to.contain('containergroup scale');
				done();
			});

			var res = { message: {text: 'I want help with containergroups'}, response: room };
			room.robot.emit('bluemix.containergroup.help', res, {});
		});
	});

	context('containergroup list - user says `I want to list my containergroups`', function() {
		it('should list containergroups', function(done) {

			room.robot.on('ibmcloud.formatter', (event) => {
				if (event && event.attachments) {
					expect(event).to.exist;
					expect(event.attachments).to.exist;
					expect(event.attachments.length).to.exist;
					expect(event.attachments.length).to.eql(1);
					expect(event.attachments[0].title).to.eql('testContainerGroup1');
					done();
				}
			});

			var res = { message: {text: 'I want to list my containergroups'}, user: {id: 'mimiron'}, response: room };
			room.robot.emit('bluemix.containergroup.list', res, {});

		});
	});

	context('containergroup remove - user says `I want to remove containergroup...`', function() {
		it('should remove `testContainerGroup1`', function(done) {

			// 5. Listens for dialog response.
			room.robot.on('ibmcloud.formatter', (event) => {
				if (event.message === 'Deleting container group *testContainerGroup1* in the *testSpaceGuid* space. Change spaces using *space set [space_name]*.') {
					expect(event.message).to.contain('Deleting container group *testContainerGroup1* in the *testSpaceGuid* space. Change spaces using *space set [space_name]*.');
				}
				else if (event.message === 'Container group *testContainerGroup1* has been successfully deleted.'){
					expect(event.message).to.contain('Container group *testContainerGroup1* has been successfully deleted.');
					done();
				}
			});

			// 2. Handle the dialog questions.
			var replyFn = function(msg){
				// 3. Sends a message to the room with the response to dialog requesting containergroup name.
				if (msg === 'Are you sure that you want to remove container group *testContainerGroup1*?') {
					room.user.say('mimiron', 'yes');
				}
				else {
					done(Error('Unexpected dialog question: ' + msg));
				}

			};

			// 1. Mock Natural Language message by calling emit.
			var res = { message: {text: 'I want to remove containergroup testContainerGroup1', user: {id: 'mimiron'}}, response: room, reply: replyFn };
			room.robot.emit('bluemix.containergroup.remove', res, { containergroupname: 'testContainerGroup1' });
		});

		it('should fail remove containergroup due to missing containergroupname parameter ', function(done) {

			room.robot.on('ibmcloud.formatter', (event) => {
				expect(event.message).to.contain('I\'m having problems understanding the name of your containergroup. To remove a containergroup use *containergroup remove [containergroup]*');
				done();
			});
			// 1. Mock Natural Language message by calling emit.
			var res = { message: {text: 'I want to remove containergroup', user: {id: 'mimiron'}}, response: room };
			room.robot.emit('bluemix.containergroup.remove', res, {});
		});
	});

	context('containergroup scale - user says `I want to scale containergroup` tests', function() {
		it('should scale `testContainerGroup1` when user says `I want to scale containergroup testContainerGroup1 to 4 instances.`', function(done) {

			// 4. Listens for dialog response.
			room.robot.on('ibmcloud.formatter', (event) => {
				if (event.message === 'Scaling container group *testContainerGroup1* in the *testSpace* space to *4* instances.') {
					expect(event.message).to.contain('Scaling container group *testContainerGroup1* in the *testSpace* space to *4* instances.');
				}
				else if (event.message === 'Scaled container group *testContainerGroup1* successfully to *4* instance(s).'){
					expect(event.message).to.contain('Scaled container group *testContainerGroup1* successfully to *4* instance(s).');
					done();
				}
			});

			// 1. Mock Natural Language message by calling emit.
			var res = { message: {text: 'I want to scale containergroup testContainerGroup1 to 4 instances.', user: {id: 'mimiron'}}, response: room };
			room.robot.emit('bluemix.containergroup.scale', res, { containergroupname: 'testContainerGroup1', instances: '4' });

		});

		it('should fail scale containergroup due to missing containergroupname parameter ', function(done) {

			room.robot.on('ibmcloud.formatter', (event) => {
				expect(event.message).to.contain('I\'m having problems understanding the name of your containergroup. To scale a containergroup use *containergroup scale [containergroup] [numInstances]*');
				done();
			});
			// 1. Mock Natural Language message by calling emit.
			var res = { message: {text: 'I want to scale containergroup to 4 instances', user: {id: 'mimiron'}}, response: room };
			room.robot.emit('bluemix.containergroup.scale', res, { instances: '4' });
		});

		it('should fail scale containergroup due to missing instances parameter ', function(done) {

			room.robot.on('ibmcloud.formatter', (event) => {
				expect(event.message).to.contain('I\'m having problems understanding the number of desired instances. To scale an containergroup use *containergroup scale [containergroup] [numInstances]*');
				done();
			});
			// 1. Mock Natural Language message by calling emit.
			var res = { message: {text: 'I want to scale containergroup testContainerGroup1', user: {id: 'mimiron'}}, response: room };
			room.robot.emit('bluemix.containergroup.scale', res, { containergroupname: 'testContainerGroup1' });
		});
	});

	context('verify entity functions', function() {

		it('should retrieve set of container names', function(done) {
			const entities = require('../src/lib/container.entities');
			var res = { message: {text: '', user: {id: 'mimiron'}}, response: room };
			entities.getContainerNames(room.robot, res, 'containername', {}).then(function(containerNames) {
				expect(containerNames.length).to.eql(3);
				done();
			}).catch(function(error) {
				done(error);
			});
		});

		it('should retrieve set of container group names', function(done) {
			const entities = require('../src/lib/container.entities');
			var res = { message: {text: '', user: {id: 'mimiron'}}, response: room };
			entities.getContainerGroupNames(room.robot, res, 'containergroupname', {}).then(function(containerGroupNames) {
				expect(containerGroupNames.length).to.eql(1);
				done();
			}).catch(function(error) {
				done(error);
			});
		});
	});

});
