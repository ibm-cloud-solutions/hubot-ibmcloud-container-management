/*
* Licensed Materials - Property of IBM
* (C) Copyright IBM Corp. 2016. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/
'use strict';

const path = require('path');
const nock = require('nock');
nock.disableNetConnect();
nock.enableNetConnect('localhost');
const testResources = require(path.resolve(__dirname, 'resources/containers', 'test.resources.js'));

const endpoint = 'http://mytest';
const icVersion = 'v3';

module.exports = {

	setupMockery: function() {
		let icScope = nock(endpoint)
		.persist();

		icScope.post('/uaa/oauth/token')
		.reply(200, testResources.creds);

		icScope.get(`/${icVersion}/containers/json?all=1`)
		.reply(200, testResources.containers);

		icScope.get('/graphiteData/target=absolute(sumSeries(offset(testSpaceGuid.0000.1.cpu-*.cpu-idle,-100)))&format=json&from=-60min&to=-0min/testSpaceGuid/metric-cpu')
		.reply(200, testResources.cpuDatapoints);

		icScope.get('/graphiteData/target=absolute(sumSeries(scale(testSpaceGuid.0000.1.memory.memory-used,0.000001)))&format=json&from=-60min&to=-0min/testSpaceGuid/metric-memory')
		.reply(200, testResources.memDatapoints);

		icScope.get('/graphiteData/target=absolute(sumSeries(offset(testSpaceGuid.0000.2.cpu-*.cpu-idle,-100)))&format=json&from=-60min&to=-0min/testSpaceGuid/metric-cpu')
		.reply(200, testResources.cpuDatapoints);

		icScope.get('/graphiteData/target=absolute(sumSeries(scale(testSpaceGuid.0000.2.memory.memory-used,0.000001)))&format=json&from=-60min&to=-0min/testSpaceGuid/metric-memory')
		.reply(200, testResources.memDatapoints);

		icScope.get('/graphiteData/target=absolute(sumSeries(offset(testSpaceGuid.0000.3.cpu-*.cpu-idle,-100)))&format=json&from=-60min&to=-0min/testSpaceGuid/metric-cpu')
		.reply(200, testResources.cpuDatapoints);

		icScope.get('/graphiteData/target=absolute(sumSeries(scale(testSpaceGuid.0000.3.memory.memory-used,0.000001)))&format=json&from=-60min&to=-0min/testSpaceGuid/metric-memory')
		.reply(200, testResources.memDatapoints);

		icScope.get(`/${icVersion}/containers/groups`)
		.reply(200, testResources.containerGroups);

		icScope.get(`/${icVersion}/containers/groups/1234`)
		.reply(200, testResources.containerGroup);

		icScope.delete(`/${icVersion}/containers/groups/testContainerGroup1`)
		.reply(200, {});

		icScope.delete(`/${icVersion}/containers/groups/testContainerGroup4`)
		.reply(200, {
			code: 'IC5128E',
			description: 'The container group group4 could not be found. Verify that the container group ID or name is correct.',
			rc: '404'
		});

		icScope.patch(`/${icVersion}/containers/groups/testContainerGroup1`)
		.reply(200, {
			code: 0,
			message: 'string'
		});

		icScope.post(`/${icVersion}/containers/1/start`)
		.reply(200, {});

		icScope.post(`/${icVersion}/containers/1/stop`)
		.reply(200, {});

		icScope.post(`/${icVersion}/containers/1/logs`)
		.reply(200, testResources.containerLogs);

		icScope.delete(`/${icVersion}/containers/1`)
		.reply(200, {});
	}
};
