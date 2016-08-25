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

const cf = require('hubot-cf-convenience');
const activity = require('hubot-ibmcloud-activity-emitter');
const ic = require('../lib/ic');
const palette = require('hubot-ibmcloud-utils').palette;
const entities = require('../lib/container.entities');
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

const LOGS_RE = /container\s+logs(\s(for|of))?\s(.*)/i;
const LOGS_ID = 'bluemix.container.logs';

module.exports = (robot) => {

	// Register entity handling functions
	entities.registerEntityFunctions();

	// Natural Language match
	robot.on(LOGS_ID, (res, parameters) => {
		robot.logger.debug(`${TAG}: ${LOGS_ID} Natural Language match. res.message.text=${res.message.text}.`);
		if (parameters && parameters.containername) {
			processLogs(robot, res, parameters.containername);
		}
		else {
			robot.logger.error(`${TAG}: Error extracting Container Name from text [${res.message.text}].`);
			let message = i18n.__('cognitive.parse.problem.container.logs');
			robot.emit('ibmcloud.formatter', { response: res, message: message});
		}
	});

	// RegEx match
	robot.respond(LOGS_RE, {	id: LOGS_ID }, function(res) {
		robot.logger.debug(`${TAG}: ${LOGS_ID} RegEx match. res.message.text=${res.message.text}.`);
		let containername = res.match[3];
		processLogs(robot, res, containername);
	});

	function processLogs(robot, res, name) {
		robot.logger.debug(`${TAG}: bluemix.container.logs res.message.text=${res.message.text}.`);
		const spaceGuid = cf.activeSpace(robot, res).guid;
		const spaceName = cf.activeSpace(robot, res).name;
		var cache = ic.getCache(spaceGuid);
		robot.logger.info(`${TAG}: Getting logs for container with name ${name}`);

		if (cache && cache[name]) {
			let message = i18n.__('container.get.logs.in.progress', name);
			robot.emit('ibmcloud.formatter', { response: res, message: message});
			robot.logger.info(`${TAG}: Asynch call using containers library to get logs for container ${name}.`);
			ic.containers.logs(cache[name], spaceGuid).then((result) => {
				const attachment = {
					title: name,
					color: palette.normal,
					text: result
				};
				// Emit as an attachment
				robot.emit('ibmcloud.formatter', {
					response: res,
					attachments: [attachment]
				});
				let message = i18n.__('container.get.logs.success', name);
				robot.emit('ibmcloud.formatter', { response: res, message: message});
				activity.emitBotActivity(robot, res, { activity_id: 'activity.container.logs', space_name: spaceName, space_guid: spaceGuid});
			}, (response) => {
				let message = i18n.__('container.get.logs.failure', name, response);
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
					robot.logger.info(`${TAG}: Asynch call using containers library to get logs for container ${name}.`);
					ic.containers.logs(cache[name], spaceGuid).then((result) => {
						console.log('result:' + result);
						const attachment = {
							title: name,
							color: palette.normal,
							text: result
						};
						// Emit as an attachment
						robot.emit('ibmcloud.formatter', {
							response: res,
							attachments: [attachment]
						});
						activity.emitBotActivity(robot, res, { activity_id: 'activity.container.logs', space_name: spaceName, space_guid: spaceGuid});
					}, (response) => {
						let message = i18n.__('container.get.logs.failure', name, response);
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
				let message = i18n.__('container.get.logs.failure', name, reason);
				robot.emit('ibmcloud.formatter', { response: res, message: message});
			});
		}
	};
};
