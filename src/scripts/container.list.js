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

const LIST_RE = /container\s+(show|list)/i;
const LIST_ID = 'bluemix.container.list';

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
		robot.logger.info(`${TAG}: Listing containers...`);
		let resultJson = null;
		const spaceGuid = cf.activeSpace(robot, res).guid;
		const spaceName = cf.activeSpace(robot, res).name;
		// Get containers info.
		robot.logger.info(`${TAG}: Asynch call using containers library to get containers for space guid ${spaceGuid}.`);
		ic.containers.getContainers(spaceGuid).then((result) => {
			let containerNames = [];
			resultJson = JSON.parse(result);
			// Set the container cache.
			ic.setCache(spaceGuid, resultJson);
			let arrayPro = [];
			resultJson.map((container) => {
				containerNames.push(container.Name);
				arrayPro.push(containerAttach(container, spaceGuid));
			});
			Promise.all(arrayPro).then((attachments) => {
				// Emit as an attachment
				robot.emit('ibmcloud.formatter', {
					response: res,
					attachments
				});
				activity.emitBotActivity(robot, res, { activity_id: 'activity.container.list', space_name: spaceName, space_guid: spaceGuid});
			});
			// });
			nlcconfig.updateGlobalParameterValues('IBMcloudContainerManagment_containername', containerNames);
		}).catch((reason) => {
			robot.logger.error(`${TAG}: reason=${reason}`);
			if (reason && reason.dumpstack) {
				robot.logger.error(reason.dumpstack);
			}
			robot.emit('ibmcloud.formatter', { response: res, message: i18n.__('containers.not.found')});
		});
	}
	function containerAttach(container, spaceGuid){
		const ports = container.Ports.reduce((list, port) => {
			if (list) {
				list += '\n';
			}
			list += 'Private: ' + port.PrivatePort + ' Public: ' + port.PublicPort;
			return list;
		}, '');
		let cache = ic.getCache(spaceGuid);
		const attachment = {
			title: container.Name,
			color: palette[container.Status.toLowerCase()] || palette.normal
		};
		attachment.fields = [
			{title: 'status', value: container.Status.toLowerCase(), short: true},
			{title: 'memory', value: container.Memory + 'M', short: true},
			{title: 'Network', value: container.NetworkSettings.IPAddress, short: true},
			{title: 'ports', value: ports},
			{title: 'group', value: (container.Group && container.Group.Name) ? container.Group.Name : 'Not applicable'}
		];
		let p = new Promise((resolve, reject) => {
			ic.containers.memoryUsage(cache[container.Name], spaceGuid).then((result) => {
				let resultJson = JSON.parse(result);
				let data = resultJson[0].datapoints;
				let sum = 0;
				for (let i = 0; i < data.length; i++) {
					if (parseFloat(data[i], 10)) {
						sum = sum + parseFloat(data[i], 10);
						i++;
					}
				}
				let memUsage = Number(sum / 60).toFixed(2);
				attachment.fields.push({title: 'memory usage', value: memUsage + 'M', short: true});
				return attachment;
			}).then((attachment) => {
				ic.containers.cpuUsage(cache[container.Name], spaceGuid).then((result) => {
					let resultJson = JSON.parse(result);
					let data = resultJson[0].datapoints;
					let sum = 0;
					for (let i = 0; i < data.length; i++) {
						if (parseFloat(data[i], 10)) {
							sum = sum + parseFloat(data[i], 10);
							i++;
						}
					}
					let cpuUsage = Number(sum / 60).toFixed(2);
					attachment.fields.push({title: 'cpu usage(%)', value: cpuUsage, short: true});
					resolve(attachment);
				});
			});
		});
		return p;
	}
};
