/*
* Licensed Materials - Property of IBM
* (C) Copyright IBM Corp. 2016. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/
'use strict';

module.exports = {
	cfInfo: {
		authorization_endpoint: 'http://mytest/uaa'
	},
	creds: {
		access_token: 'mycredformockservice'
	},
	organizations: {
		resources: [
			{
				metadata: {
					guid: 'testOrgGuid'
				},
				entity: {
					name: 'testOrg'
				}
			}
		]
	},
	spaces: {
		spaces: [
			{
				guid: 'testSpaceGuid',
				name: 'testSpace',
				app_count: 2
			}
		]
	},
	spaceSummary: {
		apps: [
			{
				guid: 'testApp1Guid',
				urls: [
					'testApp1Url'
				],
				name: 'testApp1Name',
				instances: 1,
				running_instances: 1,
				state: 'STOPPED',
				memory: 1024,
				disk_quota: 1024,
				service_names: []
			},
			{
				guid: 'testApp2Guid',
				urls: [
					'testApp2Url'
				],
				name: 'testApp2Name',
				instances: 1,
				running_instances: 1,
				state: 'STOPPED',
				memory: 1024,
				disk_quota: 1024,
				service_names: []
			},
			{
				guid: 'testApp4Guid',
				urls: [
					'testApp4Url'
				],
				name: 'testApp4Name',
				instances: 1,
				running_instances: 1,
				state: 'STOPPED',
				memory: 1024,
				disk_quota: 1024,
				service_names: []
			}
		]
	},
	appLogs: '1:M 01 Jun 21:07:56.537 # Server started, Redis version 3.2.0\n1:M 01 Jun 21:07:56.544 * The server is now ready to accept connections on port 637',
	appSummary: {
		running_instances: 1,
		memory: 1024,
		instances: 1,
		disk_quota: 1024,
		package_updated_at: '2016-04-22T19:33:29Z',
		state: 'RUNNING',
		services: []
	},
	appStats: {
		0: {
			state: 'RUNNING',
			stats: {
				usage: {
					disk: 66392064,
					mem: 29880320,
					cpu: 0.13511219703079957
				},
				uris: [
					'app_name.example.com'
				]
			}
		}
	},
	appInstances: {
		0: {
			since: 1403140717.984577
		}
	},
	containers: [{
		Id: 1,
		Ports: [{
			Private: 6790,
			Public: 80
		}],
		Name: 'testContainer1',
		Status: 'Running',
		Memory: '64',
		NetworkSettings: {
			IPAddress: '1.1.1.1'
		}
	},
	{
		Id: 2,
		Ports: [{
			Private: 3000,
			Public: 3000
		}],
		Name: 'testContainer2',
		Status: 'Running',
		Memory: '256',
		NetworkSettings: {
			IPAddress: '2.2.2.2'
		}
	},
	{
		Id: 3,
		Ports: [{
			Private: 8080,
			Public: 8080
		}],
		Name: 'testContainer3',
		Status: 'Running',
		Memory: '128',
		NetworkSettings: {
			IPAddress: '2.1.2.3'
		}
	}],
	containerGroups: [
		{
			Id: '1234',
			Name: 'testContainerGroup1',
			Status: 'update complete',
			Port: 80,
			ImageName: 'registry.ng.bluemix.net/node:latest',
			NumberInstances: {
				CurrentSize: 1
			},
			Routes: ['testroute.com'],
			Memory: 64
		}
	],
	containerGroup: {
		Id: '1234',
		Name: 'testContainerGroup1',
		Status: 'update complete',
		Port: 80,
		ImageName: 'registry.ng.bluemix.net/node:latest',
		NumberInstances: {
			CurrentSize: 1
		},
		Routes: ['testroute.com'],
		Memory: 64
	},
	services: {
		resources: [
		]
	},
	containerLogs: '1:M 01 Jun 21:07:56.537 # Server started, Redis version 3.2.0\n1:M 01 Jun 21:07:56.544 * The server is now ready to accept connections on port 637',
	openwhiskNamespaces: [ 'testOrg_testSpace', 'namespace1', 'namespace2'],
	openwhiskActions: [ {
		name: 'action1',
		version: '0.1',
		publish: true
	}, {
		name: 'action2',
		version: '0.1',
		publish: false
	}],
	openwhiskAction: {
		activationId: '19012842023'
	},
	memDatapoints: [{
		target: 'absolute(sumSeries(scale(testSpaceGuid.0000.1.memory.memory-used,1e-06)))',
		datapoints: [
			[
				323.44064,
				1474893420
			],
			[
				323.44064,
				1474893450
			],
			[
				323.44064,
				1474893450
			],
			[
				323.44064,
				1474893450
			],
			[
				323.44064,
				1474893450
			],
			[
				323.44064,
				1474893450
			]
		]
	}
],
	cpuDatapoints: [
		{
			target: 'absolute(sumSeries(offset(testSpaceGuid.0000.1.cpu-0.cpu-idle,-100)))',
			datapoints: [
				[
					0.18213099999999827,
					1474895250
				],
				[
					0.5615010000000069,
					1474895280
				],
				[
					0.5615010000000069,
					1474895280
				],
				[
					0.5615010000000069,
					1474895280
				],
				[
					0.5615010000000069,
					1474895280
				]
			]
		}]
};
