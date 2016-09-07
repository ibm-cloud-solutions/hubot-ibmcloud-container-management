// Description:
//	Listens for commands to initiate actions against Bluemix for containers
//
// Configuration:
//	 HUBOT_BLUEMIX_API Bluemix API URL
//	 HUBOT_BLUEMIX_ORG Bluemix Organization
//	 HUBOT_BLUEMIX_SPACE Bluemix space
//	 HUBOT_BLUEMIX_USER Bluemix User ID
//	 HUBOT_BLUEMIX_PASSWORD Password for the Bluemix User
//
// Commands:
//   hubot container(s) help - Show available commands in the container category.
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

const path = require('path');
const TAG = path.basename(__filename);

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

const HELP_RE = /(container|containers)\s+help/i;
const HELP_ID = 'bluemix.container.help';

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
		robot.logger.debug(`${TAG}: container help res.message.text=${res.message.text}.`);
		robot.logger.info(`${TAG}: Listing help container...`);
		// hubot container delete|destroy|remove [container] - Deletes a container in the active space.
		// hubot container list|show - Lists all of the containers in the active space.
		// hubot container logs [container] - Gets recent logs for a container.
		// hubot container start [container] - Starts the contatiner in the active space.
		// hubot container status [container] - Get status for a container.
		// hubot container stop [container] - Stops the contatiner in the active space.

		let help = robot.name + ' container delete|destroy|remove [container] - ' + i18n.__('help.container.delete') + '\n'
			+ robot.name + ' container list|show - ' + i18n.__('help.container.show') + '\n'
			+ robot.name + ' container logs [container] - ' + i18n.__('help.container.logs') + '\n'
			+ robot.name + ' container start [container] - ' + i18n.__('help.container.start') + '\n'
			+ robot.name + ' container status [container] - ' + i18n.__('help.container.status') + '\n'
			+ robot.name + ' container stop [container] - ' + i18n.__('help.container.stop') + '\n';

		robot.emit('ibmcloud.formatter', { response: res, message: '\n' + help });
	};
};
