// Description:
//	Listens for commands to initiate actions against Bluemix
//
// Configuration:
//	 HUBOT_BLUEMIX_API Bluemix API URL
//	 HUBOT_BLUEMIX_ORG Bluemix Organization
//	 HUBOT_BLUEMIX_SPACE Bluemix space
//	 HUBOT_BLUEMIX_USER Bluemix User ID
//	 HUBOT_BLUEMIX_PASSWORD Password for the Bluemix User
//
// Author:
//	jamesjong
//
/*
  * Licensed Materials - Property of IBM
  * (C) Copyright IBM Corp. 2016. All Rights Reserved.
  * US Government Users Restricted Rights - Use, duplication or
  * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
  */
'use strict';

var path = require('path');
var TAG = path.basename(__filename);

const Conversation = require('hubot-conversation');
const cf = require('hubot-cf-convenience');
const ic = require('../lib/ic');
const activity = require('hubot-ibmcloud-activity-emitter');
const utils = require('hubot-ibmcloud-utils').utils;
// --------------------------------------------------------------
// i18n (internationalization)
// It will read from a peer messages.json file.  Later, these
// messages can be referenced throughout the module.
// --------------------------------------------------------------
const i18n = new (require('i18n-2'))({
	locales: ['en'],
	extension: '.json',
	// Add more languages to the list of locales when the files are created.
	directory: __dirname + '/../messages',
	defaultLocale: 'en',
	// Prevent messages file from being overwritten in error conditions (like poor JSON).
	updateFiles: false
});
// At some point we need to toggle this setting based on some user input.
i18n.setLocale('en');

const STOP_RE = /container\s+stop\s+(.*)/i;
const STOP_ID = 'bluemix.container.stop';

module.exports = (robot) => {

	var switchBoard = new Conversation(robot);

	// Natural Language match
	robot.on(STOP_ID, (res, parameters) => {
		robot.logger.debug(`${TAG}: ${STOP_ID} Natural Language match. res.message.text=${res.message.text}.`);
		if (parameters && parameters.containername) {
			processStop(robot, res, parameters.containername);
		}
		else {
			robot.logger.error(`${TAG}: Error extracting Container Name from text [${res.message.text}].`);
			let message = i18n.__('cognitive.parse.problem.container.stop');
			robot.emit('ibmcloud.formatter', { response: res, message: message});
		}
	});

	// RegEx match
	robot.respond(STOP_RE, {	id: STOP_ID }, function(res) {
		robot.logger.debug(`${TAG}: ${STOP_ID} RegEx match. res.message.text=${res.message.text}.`);
		let containername = res.match[1];
		processStop(robot, res, containername);
	});

	function processStop(robot, res, name) {
		robot.logger.debug(`${TAG}: ${STOP_ID} res.message.text=${res.message.text}.`);
		const spaceGuid = cf.activeSpace(robot, res).guid;
		const spaceName = cf.activeSpace(robot, res).name;
		var cache = ic.getCache(spaceGuid);

		robot.logger.info(`${TAG}: Confirming stop of container ${name}.`);
		let prompt = i18n.__('container.stop.prompt', name);
		let negativeResponse = i18n.__('general.safe.this.time', name);
		utils.getConfirmedResponse(res, switchBoard, prompt, negativeResponse).then((dialogResult) => {
			robot.logger.info(`${TAG}: Stopping container with name ${name}`);
			if (cache && cache[name]) {
				let message = i18n.__('container.stop.in.progress', name);
				robot.emit('ibmcloud.formatter', { response: res, message: message});
				robot.logger.info(`${TAG}: Asynch call using containers library to stop container with name ${name}.`);
				ic.containers.stop(cache[name], spaceGuid).then((result) => {
					let message = i18n.__('container.stop.success', name);
					robot.emit('ibmcloud.formatter', { response: res, message: message});
					activity.emitBotActivity(robot, res, { activity_id: 'activity.container.stop', space_name: spaceName, space_guid: spaceGuid});
				}, (response) => {
					let message = i18n.__('container.stop.failure', name, response);
					robot.emit('ibmcloud.formatter', { response: res, message: message});
				});
			}
			else {
				robot.logger.info(`${TAG}: Asynch call using containers library to get containers for space guid ${spaceGuid}.`);
				ic.containers.getContainers(spaceGuid).then((result) => {
					var resultJson = JSON.parse(result);
					ic.setCache(spaceGuid, resultJson, false);
					cache = ic.getCache(spaceGuid);
					if (cache && cache[name]) {
						robot.logger.info(`${TAG}: Asynch call using containers library to stop container with name ${name}.`);
						ic.containers.stop(cache[name], spaceGuid).then((result) => {
							let message = i18n.__('container.stop.success', name);
							robot.emit('ibmcloud.formatter', { response: res, message: message});
							activity.emitBotActivity(robot, res, { activity_id: 'activity.container.stop', space_name: spaceName, space_guid: spaceGuid});
						}, (response) => {
							let message = i18n.__('container.stop.failure', name, response);
							robot.emit('ibmcloud.formatter', { response: res, message: message});
						});
					}
					else {
						let message = i18n.__('container.name.not.found', name);
						robot.emit('ibmcloud.formatter', { response: res, message: message});
					}
				}).catch((reason) => {
					robot.logger.error(`${TAG}: reason=${reason}`);
					robot.logger.error(reason.dumpstack);
					let message = i18n.__('container.stop.failure', name, reason);
					robot.emit('ibmcloud.formatter', { response: res, message: message});
				});
			}
		});
	};
};
