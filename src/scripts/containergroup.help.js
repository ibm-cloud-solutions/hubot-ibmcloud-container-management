// Description:
//	Listens for commands to initiate actions against Bluemix for container groups
//
// Configuration:
//	 HUBOT_BLUEMIX_API Bluemix API URL
//	 HUBOT_BLUEMIX_ORG Bluemix Organization
//	 HUBOT_BLUEMIX_SPACE Bluemix space
//	 HUBOT_BLUEMIX_USER Bluemix User ID
//	 HUBOT_BLUEMIX_PASSWORD Password for the Bluemix User
//
// Commands:
//   hubot containergroup(s) help - Show available commands in the containergroup category.
//
// Author:
//	chambrid
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

const HELP_RE = /(containergroup|containergroups)\s+help/i;
const HELP_ID = 'bluemix.containergroup.help';

module.exports = (robot) => {

	// Natural Language match
	robot.on(HELP_ID, (res, parameters) => {
		robot.logger.debug(`${TAG}: ${HELP_ID} Natural Language match. res.message.text=${res.message.text}.`);
		processHelp(robot, res);
	});

	// RegEx match
	robot.respond(HELP_RE, {	id: HELP_ID }, function(res) {
		robot.logger.debug(`${TAG}: ${HELP_ID} RegEx match. res.message.text=${res.message.text}.`);
		processHelp(robot, res);
	});

	function processHelp(robot, res) {
		robot.logger.debug(`${TAG}: ${HELP_ID} res.message.text=${res.message.text}.`);
		robot.logger.info(`${TAG}: Listing help containergroup...`);
		// hubot containergroup delete|destroy|remove [container_group] - Deletes a container group in the active space.
		// hubot containergroup list|show  - Lists all of the container groups in the active space.
		// hubot containergroup scale [container_group] [num]  - Scale the [container_group] to [num] instances.

		let help = robot.name + ' containergroup delete|destroy|remove [container_group] - ' + i18n.__('help.containergroup.delete') + '\n';
		help += robot.name + ' containergroup list|show - ' + i18n.__('help.containergroup.show') + '\n';
		help += robot.name + ' containergroup scale [container_group] [number] - ' + i18n.__('help.containergroup.scale') + '\n';

		robot.emit('ibmcloud.formatter', { response: res, message: '\n' + help});
	};
};
