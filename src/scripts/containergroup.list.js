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

const cf = require('hubot-cf-convenience');
const ic = require('../lib/ic');
const palette = require('hubot-ibmcloud-utils').palette;
const activity = require('hubot-ibmcloud-activity-emitter');
const nlcconfig = require('hubot-ibmcloud-cognitive-lib').nlcconfig;

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

const LIST_RE = /containergroup\s+(show|list)/i;
const LIST_ID = 'bluemix.containergroup.list';

const containerGroups = new ic.ContainerGroups();

module.exports = (robot) => {

	// Natural Language match
	robot.on(LIST_ID, (res, parameters) => {
		robot.logger.debug(`${TAG}: ${LIST_ID} - Natural Language match - res.message.text=${res.message.text}.`);
		processList(res);
	});

	// RegEx match
	robot.respond(LIST_RE, {id: LIST_ID}, function(res) {
		robot.logger.debug(`${TAG}: ${LIST_ID} res.message.text=${res.message.text}.`);
		processList(res);
	});

	function processList(res) {
		robot.logger.debug(`${TAG}: ${LIST_ID} res.message.text=${res.message.text}.`);
		robot.logger.info(`${TAG}: Listing the container groups...`);
		let message = i18n.__('containergroup.list.in.progress');
		robot.emit('ibmcloud.formatter', { response: res, message: message});
		var resultJson = null;
		const spaceGuid = cf.activeSpace(robot, res).guid;
		const spaceName = cf.activeSpace(robot, res).name;

		// Get containers info.
		robot.logger.info(`${TAG}: Asynch call using containerGroups library to get container groups with space guid ${spaceGuid}.`);
		containerGroups.getContainerGroups(spaceGuid).then((result) => {
			resultJson = JSON.parse(result);
			robot.logger.info(`${TAG}: Found ${resultJson.length} container groups.`);

			if (resultJson.length === 0) {
				let message = i18n.__('containergroup.none.found');
				robot.emit('ibmcloud.formatter', { response: res, message: message});
				return Promise.resolve();
			}

			var promiseArray = resultJson.map((containergroup) => {
				return containerGroups.getContainerGroup(containergroup.Id, spaceGuid);
			});

			robot.logger.info(`${TAG}: Asynch calls (Promise.all) using containerGroups library to get container group info.`);
			return Promise.all(promiseArray);
		}).then((containerGroupDetailsArray) => {
			// Promise.all combines the result to an array
			// Iterate the container groups and create a suitable response.
			let containergroupNames = [];

			const attachments = resultJson.map((containergroup) => {
				containergroupNames.push(containergroup.Name);

				// find details info for given containergroup
				var cgResult = containerGroupDetailsArray.find((containerGroupDetail) => {
					return containergroup.id === containerGroupDetail.id;
				});
				const ports = containergroup.Port ? containergroup.Port.toString() : 'none';

				const attachment = {
					title: containergroup.Name,
					color: palette[containergroup.Status.toLowerCase()] || palette.normal
				};
				attachment.fields = [
					{title: 'status', value: containergroup.Status.toLowerCase(), short: true},
					{title: 'image', value: cgResult.ImageName},
					{title: 'instances', value: cgResult.NumberInstances.CurrentSize},
					{title: 'routes', value: containergroup.Routes ? containergroup.Routes.toString() : 'none', short: true},
					{title: 'memory', value: cgResult.Memory, short: true},
					{title: 'ports', value: ports}
				];
				return attachment;
			});

			// update names for NLC
			nlcconfig.updateGlobalParameterValues('IBMcloudContainerManagment_containername', containergroupNames);

			// Emit as an attachment
			robot.emit('ibmcloud.formatter', {
				response: res,
				attachments
			});

			activity.emitBotActivity(robot, res, {
				activity_id: 'activity.containergroup.list',
				space_name: spaceName,
				space_guid: spaceGuid
			});
		}).catch((reason) => {
			robot.logger.error(`${TAG}: reason=${reason}`);
			robot.logger.error(reason.dumpstack);
			let message = i18n.__('containergroup.none.found');
			robot.emit('ibmcloud.formatter', { response: res, message: message});
		});
	};
};
