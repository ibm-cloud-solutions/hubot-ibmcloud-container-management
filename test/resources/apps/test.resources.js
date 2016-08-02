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
	apps: {
		resources: [
			{
				metadata: {
					guid: 'testApp1Guid'
				}
			}
		]
	},
	spaces: {
		spaces: [
			{
				guid: 'testSpaceGuid',
				name: 'testSpace',
				app_count: 2,
				service_count: 1,
				mem_dev_total: 0
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
				state: 'STARTED',
				memory: 1024,
				disk_quota: 1024,
				service_names: [
					'validService1'
				]
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
			},
			{
				guid: 'testAppLongLogsGuid',
				urls: [
					'testAppLongLogsUrl'
				],
				name: 'testAppLongLogsName',
				instances: 1,
				running_instances: 1,
				state: 'STARTED',
				memory: 1024,
				disk_quota: 1024,
				service_names: [
					'validService1'
				]
			}
		],
		services: [
			{
				guid: 'validService1Guid',
				name: 'validService1',
				bound_app_count: 1,
				service_plan: {
					service: {
						label: 'validServicePlan1Label'
					},
					name: 'validServicePlan1Name'
				}
			},
			{
				guid: 'validService2Guid',
				name: 'validService2',
				bound_app_count: 0,
				service_plan: {
					service: {
						label: 'validServicePlan2Label'
					},
					name: 'validServicePlan2Name'
				}
			}
		]
	},
	appLogs: 'Log entry 1',
	appLongLogs: {
		routing_key: 'abc',
		signature: 'abc',
		log_message: {
			message: 'Log entry 1',
			message_type: 2,
			timestamp: '123',
			app_id: 'abc',
			source_id: 'abc',
			draing_urls: 'abc',
			source_name: 'abc'
		}
	},
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
				name: 'runningApp',
				usage: {
					disk: 66392064,
					mem: 29880320,
					cpu: 0.99511219703079957
				},
				mem_quota: 29880321,
				disk_quota: 66392065,
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
		Memory: 64,
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
		Memory: 256,
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
		Memory: 128,
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
			{
				metadata: {
					guid: 'validService1Guid'
				},
				entity: {
					label: 'validService1',
					description: 'Description of validService1'
				}
			},
			{
				metadata: {
					guid: 'validService2Guid'
				},
				entity: {
					label: 'validService2',
					description: 'Description of validService2'
				}
			}
		]
	},
	serviceBindings: {
		resources: [
			{
				metadata: {
					guid: 'serviceBinding1Guid'
				},
				entity: {
					app_guid: 'testApp1Guid',
					service_instance_guid: 'validService1Guid'
				}
			}
		]
	},
	servicePlans: {
		resources: [
			{
				metadata: {
					guid: 'servicePlan1Guid'
				},
				entity: {
					name: 'servicePlan1Name',
					description: 'Description of servicePlan1',
					service_guid: 'service1Guid'
				}
			},
			{
				metadata: {
					guid: 'servicePlan2Guid'
				},
				entity: {
					name: 'servicePlan2Name',
					description: 'Description of servicePlan2',
					service_guid: 'service1Guid'
				}
			}
		]
	},
	serviceCreated: {
		metadata: {
			guid: 'validGuid'
		},
		entity: {
			last_operation: {
				state: 'succeeded',
				type: 'create'
			}
		}
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
	events: {
		resources: [
			{
				metadata: {
					guid: 'd0cb3bd7-9e15-4f33-b3e8-726260297bdb',
					url: '/v2/events/d0cb3bd7-9e15-4f33-b3e8-726260297bdb',
					created_at: '2016-04-22T19:33:32Z',
					updated_at: null
				},
				entity: {
					type: 'app.crash',
					actor: 'guid-6ebaf9d1-721e-47ef-b83c-cb34660b9d56',
					actor_type: 'event1ActorType',
					actor_name: 'event1Name',
					actee: 'guid-6c4a057e-4842-49d0-9aac-720e84be6f07',
					actee_type: 'app',
					actee_name: 'event1ActeeName',
					timestamp: '2016-04-22T19:33:32Z',
					space_guid: 'testSpaceGuid',
					organization_guid: 'a8eb500f-d2d4-4436-969e-4c4ed59a0082',
					metadata: {
						index: 34,
						reason: 'reason',
						exit_description: 'exit_description',
						exit_status: 'exit_status',
						request: {
							state: 'request_state'
						}
					}
				}
			}
		]
	}
};
