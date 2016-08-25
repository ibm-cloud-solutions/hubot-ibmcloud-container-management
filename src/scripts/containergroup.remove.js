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
const ic = require('../lib/ic');
const utils = require('hubot-ibmcloud-utils').utils;
const containerGroups = new ic.ContainerGroups();
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

const Conversation = require('hubot-conversation');
const REMOVE_RE = /containergroup\s+(remove|delete|destroy)\s+(.*)/i;
const REMOVE_ID = 'bluemix.containergroup.remove';

function removeDialog(switchBoard, res, robot, name, spaceGuid, spaceName) {
	let prompt = i18n.__('containergroup.remove.prompt', name);
	let negativeResponse = i18n.__('general.safe.this.time', name);
	utils.getConfirmedResponse(res, switchBoard, prompt, negativeResponse).then((dialogResult) => {
		robot.logger.info(`${TAG}: Confirming destruction of ${name}`);
		let message = i18n.__('containergroup.remove.in.progress', name, cf.activeSpace().name);
		robot.emit('ibmcloud.formatter', { response: res, message: message});
		// Remove the containergroup.
		robot.logger.info(`${TAG}: Asynch call using containerGroups library to remove container group with name ${name}.`);
		containerGroups.remove(name, spaceGuid).then((result) => {
			var resultJson = JSON.parse(result);
			if (resultJson && parseInt(resultJson.rc, 10) > 200 && resultJson.description) {
				throw resultJson.description;
			}
			let message = i18n.__('containergroup.remove.success', name);
			robot.emit('ibmcloud.formatter', { response: res, message: message});

			activity.emitBotActivity(robot, res, { activity_id: 'activity.containergroup.remove', space_name: spaceName, space_guid: spaceGuid});
		}, (response) => {
			robot.logger.error(`${TAG}: response=${response}`);
			let message = i18n.__('containergroup.remove.failure', name, response);
			robot.emit('ibmcloud.formatter', { response: res, message: message});
		}).catch((reason) => {
			robot.logger.error(`${TAG}: reason=${reason}`);
			robot.logger.error(reason.dumpstack);
			let message = i18n.__('containergroup.remove.failure', name, reason);
			robot.emit('ibmcloud.formatter', { response: res, message: message});
		});
	});
}
// Slack entry point.
module.exports = (robot) => {

	// Register entity handling functions
	entities.registerEntityFunctions();

	var switchBoard = new Conversation(robot);

	// Natural Language match
	robot.on(REMOVE_ID, (res, parameters) => {
		robot.logger.debug(`${TAG}: ${REMOVE_ID} Natural Language match. res.message.text=${res.message.text}.`);
		if (parameters && parameters.containergroupname) {
			processRemove(robot, res, parameters.containergroupname);
		}
		else {
			robot.logger.error(`${TAG}: Error extracting Containergroup Name from text [${res.message.text}].`);
			let message = i18n.__('cognitive.parse.problem.containergroup.remove');
			robot.emit('ibmcloud.formatter', { response: res, message: message});
		}
	});

	// RegEx match
	robot.respond(REMOVE_RE, {	id: REMOVE_ID }, function(res) {
		robot.logger.debug(`${TAG}: ${REMOVE_ID} RegEx match. res.message.text=${res.message.text}.`);
		let containergroupname = res.match[2];
		processRemove(robot, res, containergroupname);
	});

	function processRemove(robot, res, name) {
		robot.logger.debug(`${TAG}: ${REMOVE_ID} res.message.text=${res.message.text}.`);
		const spaceGuid = cf.activeSpace(robot, res).guid;
		const spaceName = cf.activeSpace(robot, res).name;

		robot.logger.info(`${TAG}: Destroying containergroup ${name}`);

		removeDialog(switchBoard, res, robot, name, spaceGuid, spaceName);
	};
};
