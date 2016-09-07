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

const path = require('path');
const TAG = path.basename(__filename);

const cf = require('hubot-cf-convenience');
const ic = require('../lib/ic');
const palette = require('hubot-ibmcloud-utils').palette;
const activity = require('hubot-ibmcloud-activity-emitter');
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

const STATUS_RE = /container\s+(state|status)(\s+(for|of))?\s+(.*)/i;
const STATUS_ID = 'bluemix.container.status';

// Slack entry point.
module.exports = (robot) => {

	// Register entity handling functions
	entities.registerEntityFunctions();

	// Natural Language match
	robot.on(STATUS_ID, (res, parameters) => {
		robot.logger.debug(`${TAG}: ${STATUS_ID} Natural Language match. res.message.text=${res.message.text}.`);
		if (parameters && parameters.containername) {
			processStatus(robot, res, parameters.containername);
		}
		else {
			robot.logger.error(`${TAG}: Error extracting Container Name from text [${res.message.text}].`);
			let message = i18n.__('cognitive.parse.problem.container.status');
			robot.emit('ibmcloud.formatter', { response: res, message: message});
		}
	});

	// RegEx match
	robot.respond(STATUS_RE, {	id: STATUS_ID }, function(res) {
		robot.logger.debug(`${TAG}: ${STATUS_ID} RegEx match. res.message.text=${res.message.text}.`);
		let containername = res.match[4];
		processStatus(robot, res, containername);
	});

	function processStatus(robot, res, name) {
		robot.logger.debug(`${TAG}: ${STATUS_ID} res.message.text=${res.message.text}.`);
		let resultJson = null;
		const spaceGuid = cf.activeSpace(robot, res).guid;
		const spaceName = cf.activeSpace(robot, res).name;
		robot.logger.info(`${TAG}: Checking the status of container ${name}`);

		robot.logger.info(`${TAG}: Asynch call using containers library to get containers for space guid ${spaceGuid}.`);
		ic.containers.getContainers(spaceGuid).then((result) => {
			resultJson = JSON.parse(result);
			ic.setCache(spaceGuid, resultJson);

			// Iterate the containers and return info for match on name.
			const attachments = resultJson.map((container) => {
				if (container.Name.toLowerCase() === name.toLowerCase()){
					let message = i18n.__('container.status.in.progress', name, spaceName);
					robot.emit('ibmcloud.formatter', { response: res, message: message});
					const ports = container.Ports.reduce((list, port) => {
						if (list) {
							list += '\n';
						}
						list += 'IP: ' + port.IP + ' , Port private: ' + port.PrivatePort + ' public: ' + port.PublicPort;
						return list;
					}, '');

					const attachment = {
						title: container.Name,
						color: palette[container.Status.toLowerCase()] || palette.normal
					};
					attachment.fields = [
						{title: 'status', value: container.Status.toLowerCase(), short: true},
						{title: 'memory', value: container.Memory, short: true},
						{title: 'IP address', value: container.NetworkSettings.IPAddress, short: true},
						{title: 'ports', value: ports}
					];
					return attachment;
				}
			}).filter(function(attachment){
				if (attachment != null){
					return true;
				}
				return false;
			});

			if (attachments.length > 0) {
				// Emit as an attachment
				robot.emit('ibmcloud.formatter', {
					response: res,
					attachments
				});

				activity.emitBotActivity(robot, res, {
					activity_id: 'activity.container.status',
					space_name: spaceName,
					space_guid: spaceGuid
				});
			}
			else {
				let message = i18n.__('container.name.not.found', name);
				robot.emit('ibmcloud.formatter', { response: res, message: message});
			}
		}).catch((reason) => {
			robot.logger.error(`${TAG}: reason=${reason}`);
			robot.logger.error(reason.dumpstack);
			let message = i18n.__('container.name.not.found', name);
			robot.emit('ibmcloud.formatter', { response: res, message: message});
		});
	};
};
