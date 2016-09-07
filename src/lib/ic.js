/*
  * Licensed Materials - Property of IBM
  * (C) Copyright IBM Corp. 2016. All Rights Reserved.
  * US Government Users Restricted Rights - Use, duplication or
  * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
  */
'use strict';

const request = require('request');
const cf = require('hubot-cf-convenience');

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

const env = {
	endpoint: process.env.HUBOT_BLUEMIX_API
};


/**
 * This public class manages the operations related with Containers in Bluemix
 */
class Containers {

	/**
	 * The constructor that sets the containers api endpoint
	 */
	constructor() {
		this.endpoint = (env.endpoint || '').replace('/api', '/containers-api');
	}

	/**
	 * Gets the information about containers in a given space
	 *
	 * @param {string} spaceGuid  [The space where the containers exist]
	 * @return {array} [Array of JSON response about the container]
	 */
	getContainers(spaceGuid) {
		// GET /containers/json?all=1
		let options = {
			method: 'GET',
			url: this.endpoint + '/v3/containers/json?all=1',
			headers: {
				'X-Auth-Token': cf.token.access_token,
				'X-Auth-Project-Id': spaceGuid,
				Accept: 'application/json'
			}
		};
		let promise = new Promise((resolve, reject) => {
			request(options, function(error, response, body) {
				if (error) {
					reject(body);
				}
				else {
					resolve(body);
				}
			});
		});
		return promise;
	}

	/**
	 * Stop a Container
	 *
	 * @param  {String} containerGuid     [Container guid]
	 * @param {string} spaceGuid  [The space where the containers exist]
	 * @return {JSON}              [information about the container]
	 */
	stop(containerGuid, spaceGuid) {
		// POST /containers/{containerGuid}/start
		let options = {
			method: 'POST',
			url: this.endpoint + '/v3/containers/' + containerGuid + '/stop',
			headers: {
				'X-Auth-Token': cf.token.access_token,
				'X-Auth-Project-Id': spaceGuid,
				Accept: 'application/json'
			}
		};
		let promise = new Promise((resolve, reject) => {
			request(options, function(error, response, body) {
				if (error) {
					reject(body);
				}
				else {
					resolve(body);
				}
			});
		});
		return promise;
	}

	/**
	 * Start a Container
	 *
	 * @param  {String} containerGuid     [Container guid]
	 * @param {string} spaceGuid  [The space where the containers exist]
	 * @return {JSON}              [information about the container]
	 */
	start(containerGuid, spaceGuid) {
		// POST /containers/{containerGuid}/start
		let options = {
			method: 'POST',
			url: this.endpoint + '/v3/containers/' + containerGuid + '/start',
			headers: {
				'X-Auth-Token': cf.token.access_token,
				'X-Auth-Project-Id': spaceGuid,
				Accept: 'application/json'
			}
		};
		let promise = new Promise((resolve, reject) => {
			request(options, function(error, response, body) {
				if (error) {
					reject(body);
				}
				else {
					resolve(body);
				}
			});
		});
		return promise;
	}

	/**
	 * Delete a Container
	 *
	 * @param  {String} containerGuid     [Container guid]
	 * @param {string} spaceGuid  [The space where the containers exist]
	 * @return {JSON}              [information about the container]
	 */
	remove(containerGuid, spaceGuid) {
		// DELETE /containers/{containerGuid}
		let options = {
			method: 'DELETE',
			url: this.endpoint + '/v3/containers/' + containerGuid,
			headers: {
				'X-Auth-Token': cf.token.access_token,
				'X-Auth-Project-Id': spaceGuid,
				Accept: 'application/json'
			}
		};
		let promise = new Promise((resolve, reject) => {
			request(options, function(error, response, body) {
				if (error) {
					reject(body);
				}
				else {
					resolve(body);
				}
			});
		});
		return promise;
	}

	/**
	 * Get Container logs
	 *
	 * @param  {String} containerGuid     [Container guid]
	 * @param {string} spaceGuid  [The space where the containers exist]
	 * @return {JSON}              [information about the container]
	 */
	logs(containerGuid, spaceGuid) {
		// GET /containers/{containerGuid}/logs
		let options = {
			method: 'GET',
			url: this.endpoint + '/v3/containers/' + containerGuid + '/logs',
			headers: {
				'X-Auth-Token': cf.token.access_token,
				'X-Auth-Project-Id': spaceGuid,
				Accept: 'application/json'
			}
		};
		let promise = new Promise((resolve, reject) => {
			request(options, function(error, response, body) {
				if (error) {
					reject(body);
				}
				else {
					resolve(body);
				}
			});
		});
		return promise;
	}
}


/**
 * This public class manages the operations related with ContainerGroups in Bluemix
 */
class ContainerGroups {

	/**
	 * The constructor that sets the containers api endpoint
	 */
	constructor() {
		this.endpoint = (env.endpoint || '').replace('/api', '/containers-api');
	}

	/**
	 * Gets the information about container groups in a given space
	 *
	 * @param {string} spaceGuid  [The space where the container groups exist]
	 * @return {array} [Array of JSON response about the container]
	 */
	getContainerGroups(spaceGuid) {
		// GET /containers/groups
		let options = {
			method: 'GET',
			url: this.endpoint + '/v3/containers/groups',
			headers: {
				'X-Auth-Token': cf.token.access_token,
				'X-Auth-Project-Id': spaceGuid,
				Accept: 'application/json'
			}
		};
		let promise = new Promise((resolve, reject) => {
			request(options, function(error, response, body) {
				if (error) {
					reject(body);
				}
				else {
					resolve(body);
				}
			});
		});
		return promise;
	}

	/**
	 * Get a Container Group
	 *
	 * @param  {String} containerGroupGuid     [Container Group guid]
	 * @param {string} spaceGuid  [The space where the containers exist]
	 * @return {JSON}              [information about the container]
	 */
	getContainerGroup(containerGroupGuid, spaceGuid) {
		// GET /containers/groups/{containerGroupGuid}
		let options = {
			method: 'GET',
			url: this.endpoint + '/v3/containers/groups/' + containerGroupGuid,
			headers: {
				'X-Auth-Token': cf.token.access_token,
				'X-Auth-Project-Id': spaceGuid,
				Accept: 'application/json'
			}
		};
		let promise = new Promise((resolve, reject) => {
			request(options, function(error, response, body) {
				if (error) {
					reject(body);
				}
				else {
					resolve(JSON.parse(body));
				}
			});
		});
		return promise;
	}

	/**
	 * Delete a Container
	 *
	 * @param  {String} containerGroupGuid     [Container Group guid]
	 * @param {string} spaceGuid  [The space where the containers exist]
	 * @return {JSON}              [information about the container]
	 */
	remove(containerGroupGuid, spaceGuid) {
		// DELETE /containers/{containerGuid}
		let options = {
			method: 'DELETE',
			url: this.endpoint + '/v3/containers/groups/' + containerGroupGuid,
			headers: {
				'X-Auth-Token': cf.token.access_token,
				'X-Auth-Project-Id': spaceGuid,
				Accept: 'application/json'
			}
		};
		let promise = new Promise((resolve, reject) => {
			request(options, function(error, response, body) {
				if (error) {
					reject(body);
				}
				else {
					resolve(body);
				}
			});
		});
		return promise;
	}

	/**
	 * Scale a Container
	 *
	 * @param  {Integer} scale     [Value to scale container]
	 * @param  {String} containerGroupGuid     [Container Group guid]
	 * @param {string} spaceGuid  [The space where the containers exist]
	 * @return {JSON}              [information about the container]
	 */
	scale(scale, containerGroupGuid, spaceGuid) {
		// PATCH /containers/groups/{containerGroupGuid}
		let scaleBody = {
			NumberInstances: {
				Desired: scale
			}
		};
		let options = {
			method: 'PATCH',
			url: this.endpoint + '/v3/containers/groups/' + containerGroupGuid,
			headers: {
				'X-Auth-Token': cf.token.access_token,
				'X-Auth-Project-Id': spaceGuid,
				Accept: 'application/json'
			},
			json: true,
			body: scaleBody
		};
		let promise = new Promise((resolve, reject) => {
			request(options, function(error, response, body) {
				if (error) {
					reject(body);
				}
				else {
					resolve(body);
				}
			});
		});
		return promise;
	}

}


module.exports = {
	Containers,
	ContainerGroups
};

// Container cache
const containers = new Containers();
let containerCache = {};

/**
 * Get the Container cache that maps name to guid
 *
 * @param {string} spaceGuid  [The space where the containers exist]
 * @return {JSON}              [The container cache]
 */
function getCache(spaceGuid) {
	return containerCache[spaceGuid];
}

/**
 * Set the Container cache that maps name to guid
 *
 * @param {string} spaceGuid  [The space where the containers exist]
 * @param {JSON}   resultJson [The container cache to set]
 * @param {Boolean} isRefresh [Boolean indicating whether this is due a refresh]
 * @param {Boolean} doLogging [Boolean indicating whether perform console logging]
 */
function setCache(spaceGuid, resultJson, isRefresh, doLogging) {
	if (resultJson) {
		const cache = resultJson.reduce((maps, container) => {
			maps[container.Name] = container.Id;
			return maps;
		}, {});
		containerCache[spaceGuid] = cache;
		if (doLogging) {
			if (isRefresh) {
				console.log(`[${new Date()}] Container cache refreshed for space:` + cf.guids.space);
			}
			else {
				console.log(`[${new Date()}] Container cache set for space:` + cf.guids.space);
			}
		}
	}
}

// Performs refresh of container cache.
function refreshCache() {
	if (containers && cf && cf.guids && cf.guids.space){
		containers.getContainers(cf.guids.space).then((result) => {
			let resultJson = JSON.parse(result);
			setCache(cf.guids.space, resultJson, true);
		}).catch((reason) => {
			console.error('Error: ' + reason);
		});
	}
}

// Start a timer to refresh the cache.
setInterval(() => {
	refreshCache();
}, 60000); // refresh cache every minute

module.exports.containers = containers;
module.exports.getCache = getCache;
module.exports.setCache = setCache;
