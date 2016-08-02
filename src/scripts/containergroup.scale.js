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

const containerGroups = new ic.ContainerGroups();

// Match patterns:
// scale containergroup <name> <num>
// scale containergroup <name> <num> instances
// scale containergroup <name> to <num>
// scale containergroup <name> to <num> instances
const SCALE_RE = /containergroup\s+scale\s+(\S+)(|\sto)\s(\d+)(|\sinstances)/i;
const SCALE_ID = 'bluemix.containergroup.scale';

// Slack entry point.
module.exports = (robot) => {

	// Natural Language match
	robot.on(SCALE_ID, (res, parameters) => {
		robot.logger.debug(`${TAG}: ${SCALE_ID} Natural Language match. res.message.text=${res.message.text}.`);
		if (parameters && parameters.containergroupname) {
			if (parameters && parameters.instances) {
				processScale(robot, res, parameters.containergroupname, parameters.instances);
			}
			else {
				robot.logger.error(`${TAG}: Error extracting instances from text [${res.message.text}].`);
				let message = i18n.__('cognitive.parse.problem.containergroup.scale.instances');
				robot.emit('ibmcloud.formatter', { response: res, message: message});
			}
		}
		else {
			robot.logger.error(`${TAG}: Error extracting Containergroup Name from text [${res.message.text}].`);
			let message = i18n.__('cognitive.parse.problem.containergroup.scale');
			robot.emit('ibmcloud.formatter', { response: res, message: message});
		}
	});

	// RegEx match
	robot.respond(SCALE_RE, {	id: SCALE_ID }, function(res) {
		robot.logger.debug(`${TAG}: ${SCALE_ID} RegEx match. res.message.text=${res.message.text}.`);
		let containergroupname = res.match[1];
		let numInstances = parseInt(res.match[3], 10);
		processScale(robot, res, containergroupname, numInstances);
	});

	function processScale(robot, res, name, numInstances) {
		robot.logger.debug(`${TAG}: ${SCALE_ID} res.message.text=${res.message.text}.`);
		const spaceGuid = cf.activeSpace(robot, res).guid;
		const spaceName = cf.activeSpace(robot, res).name;
		robot.logger.info(`${TAG}: Scaling container group ${name} to ${numInstances} instance(s)`);

		if (name) {
			let message = i18n.__('containergroup.scale.in.progress', name, numInstances);
			robot.emit('ibmcloud.formatter', { response: res, message: message});
			robot.logger.info(`${TAG}: Asynch call using containerGroups library to scale container group with name ${name} to ${numInstances} instances.`);
			containerGroups.scale(numInstances, name, spaceGuid).then((result) => {
				let message = i18n.__('containergroup.scale.success', name, numInstances);
				robot.emit('ibmcloud.formatter', { response: res, message: message});
				activity.emitBotActivity(robot, res, { activity_id: 'activity.containergroup.scale', space_name: spaceName, space_guid: spaceGuid});
			}, (response) => {
				let message = i18n.__('containergroup.scale.failure', name, response);
				robot.emit('ibmcloud.formatter', { response: res, message: message});
			});
		}
		else {
			let message = i18n.__('containergroup.name.not.found', name);
			robot.emit('ibmcloud.formatter', { response: res, message: message});
		}
	};
};
