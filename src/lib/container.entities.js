/*
  * Licensed Materials - Property of IBM
  * (C) Copyright IBM Corp. 2016. All Rights Reserved.
  * US Government Users Restricted Rights - Use, duplication or
  * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
  */
'use strict';

const cf = require('hubot-cf-convenience');
const ic = require('./ic');
const nlcconfig = require('hubot-ibmcloud-cognitive-lib').nlcconfig;

const NAMESPACE = 'IBMcloudContainerManagment';
const PARAM_CONTAINERNAME = 'containername';
const PARAM_CONTAINERGROUPNAME = 'containergroupname';

var functionsRegistered = false;


function buildGlobalName(parameterName) {
	return NAMESPACE + '_' + parameterName;
}
function buildGlobalFuncName(parameterName) {
	return NAMESPACE + '_func' + parameterName;
}

function registerEntityFunctions() {
	if (!functionsRegistered) {
		nlcconfig.setGlobalEntityFunction(buildGlobalFuncName(PARAM_CONTAINERNAME), getContainerNames);
		nlcconfig.setGlobalEntityFunction(buildGlobalFuncName(PARAM_CONTAINERGROUPNAME), getContainerGroupNames);
		functionsRegistered = true;
	}
}

function getContainerNames(robot, res, parameterName, parameters) {
	return new Promise(function(resolve, reject) {
		const spaceGuid = cf.activeSpace(robot, res).guid;
		ic.containers.getContainers(spaceGuid).then((result) => {
			let resultJson = JSON.parse(result);
			var containerNames = resultJson.map(function(container){
				return container.Name;
			});
			nlcconfig.updateGlobalParameterValues(buildGlobalName(PARAM_CONTAINERNAME), containerNames);
			resolve(containerNames);
		}).catch(function(err) {
			reject(err);
		});
	});
}

function getContainerGroupNames(robot, res, parameterName, parameters) {
	return new Promise(function(resolve, reject) {
		const spaceGuid = cf.activeSpace(robot, res).guid;
		const containerGroups = new ic.ContainerGroups();
		containerGroups.getContainerGroups(spaceGuid).then((result) => {
			let resultJson = JSON.parse(result);
			var containerGroupNames = resultJson.map(function(containergroup){
				return containergroup.Name;
			});
			nlcconfig.updateGlobalParameterValues(buildGlobalName(PARAM_CONTAINERGROUPNAME), containerGroupNames);
			resolve(containerGroupNames);
		}).catch(function(err) {
			reject(err);
		});
	});
}

module.exports.registerEntityFunctions = registerEntityFunctions;
module.exports.getContainerNames = getContainerNames;
module.exports.getContainerGroupNames = getContainerGroupNames;
