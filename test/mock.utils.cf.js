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
const testResources = require(path.resolve(__dirname, 'resources/apps', 'test.resources.js'));

const endpoint = 'http://mytest';
const cfVersion = 'v2';
const validApp = 'testApp1';
const invalidApp = 'testApp4';
const notFoundApp = 'testApp3Name';
const validService1 = 'validService1';

module.exports = {

	setupMockery: function() {
		let cfScope = nock(endpoint)
			.persist();

		// https://apidocs.cloudfoundry.org/236/info/get_info.html
		cfScope.get(`/${cfVersion}/info`)
			.reply(200, testResources.cfInfo);
		// https://apidocs.cloudfoundry.org/236/organizations/list_all_organizations.html
		cfScope.get(`/${cfVersion}/organizations`)
			.reply(200, testResources.organizations);
		// https://apidocs.cloudfoundry.org/236/organizations/get_organization_summary.html
		cfScope.get(`/${cfVersion}/organizations/testOrgGuid/summary`)
			.reply(200, testResources.spaces);
		// https://apidocs.cloudfoundry.org/236/spaces/get_space_summary.html
		cfScope.get(`/${cfVersion}/spaces/testSpaceGuid/summary`)
		.reply(200, testResources.spaceSummary);
		// https://apidocs.cloudfoundry.org/236/apps/get_app_summary.html
		cfScope.get(`/${cfVersion}/apps/${validApp}Guid/summary`)
			.reply(200, testResources.appSummary);
		cfScope.get(`/${cfVersion}/apps/${invalidApp}Guid/summary`)
			.reply(404);
		// https://apidocs.cloudfoundry.org/236/apps/get_detailed_stats_for_a_started_app.html
		cfScope.get(`/${cfVersion}/apps/${validApp}Guid/stats`)
			.reply(200, testResources.appStats);
		// https://apidocs.cloudfoundry.org/236/apps/get_the_instance_information_for_a_started_app.html
		cfScope.get(`/${cfVersion}/apps/${validApp}Guid/instances`)
			.reply(200, testResources.appInstances);

		// http://apidocs.cloudfoundry.org/236/services/list_all_services.html
		cfScope.get(`/${cfVersion}/services?results-per-page=100&page=1`)
			.reply(200, testResources.services);
		// http://apidocs.cloudfoundry.org/236/services/list_all_service_plans_for_the_service.html
		cfScope.get(`/${cfVersion}/services/${validService1}Guid/service_plans`)
			.reply(200, testResources.servicePlans);
		// http://apidocs.cloudfoundry.org/236/service_instances/creating_a_service_instance.html
		cfScope.post(`/${cfVersion}/service_instances`)
			.reply(201, testResources.serviceCreated);
		// http://apidocs.cloudfoundry.org/236/service_bindings/create_a_service_binding.html
		cfScope.post(`/${cfVersion}/service_bindings`)
			.reply(201, {});
		// http://apidocs.cloudfoundry.org/236/service_instances/list_all_service_bindings_for_the_service_instance.html
		cfScope.get(`/${cfVersion}/service_instances/${validService1}Guid/service_bindings`)
			.reply(200, testResources.serviceBindings);
		// http://apidocs.cloudfoundry.org/236/service_bindings/delete_a_particular_service_binding.html
		cfScope.delete(`/${cfVersion}/service_bindings/serviceBinding1Guid`)
			.reply(204, {});
		// http://apidocs.cloudfoundry.org/236/service_instances/delete_a_service_instance.html
		cfScope.delete(`/${cfVersion}/service_instances/validService1Guid`)
			.reply(204, {});

		// http://apidocs.cloudfoundry.org/236/events/list_all_events.html
		cfScope.get(new RegExp('/' + cfVersion + '/events' + '(.*)'))
			.reply(200, testResources.events);

		// http://apidocs.cloudfoundry.org/213/apps/list_all_apps.html
		cfScope.get(`/${cfVersion}/apps?q=name%3A${notFoundApp}%3Bspace_guid%3AtestSpaceGuid`)
			.reply(200, {resources: []});
		cfScope.get(`/${cfVersion}/apps?q=name%3A${invalidApp}Name%3Bspace_guid%3AtestSpaceGuid`)
			.reply(200, {resources: []});
		cfScope.get(`/${cfVersion}/apps?q=name%3A${validApp}Name%3Bspace_guid%3AtestSpaceGuid`)
			.reply(200, testResources.apps);

		// http://apidocs.cloudfoundry.org/217/apps/updating_an_app.html
		cfScope.put(`/${cfVersion}/apps/${validApp}Guid`)
			.reply(201, {});
		cfScope.put(`/${cfVersion}/apps/${invalidApp}Guid`)
			.reply(404, 'not found');
		// http://apidocs.cloudfoundry.org/214/apps/delete_a_particular_app.html
		cfScope.delete(`/${cfVersion}/apps/${validApp}Guid`)
			.reply(204);
		cfScope.delete(`/${cfVersion}/apps/${invalidApp}Guid`)
			.reply(404, 'not found');
		// https://apidocs.cloudfoundry.org/236/apps/restage_an_app.html
		cfScope.post(`/${cfVersion}/apps/${validApp}Guid/restage`)
			.reply(201, {});
		cfScope.post(`/${cfVersion}/apps/${invalidApp}Guid/restage`)
			.reply(404, 'not found');

		cfScope.get(`/recent?app=${validApp}Guid`)
			.reply(204, testResources.appLogs);
		cfScope.get('/recent?app=testAppLongLogsGuid')
			.reply(204, testResources.appLongLogs);
		cfScope.get(`/recent?app=${invalidApp}Guid`)
			.reply(404, 'not found');

		cfScope.post('/uaa/oauth/token')
			.reply(200, testResources.creds);

	}
};
