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
const esearchResources = require(path.resolve(__dirname, 'resources/elasticsearch', 'esearch.resources.js'));

const esearch_endpoint = 'http://estest';

module.exports = {

	setupMockery: function() {
		// Mockery for request to Elasticsearch.
		let esScope = nock(esearch_endpoint)
			.persist();

		// put to es index.
		esScope.put(/_template\/.*/)
			.reply(200, esearchResources.es_acknowledged);

		// post to insert doc into es.
		esScope.post('/hubotusage/UsageEntry')
			.reply(200, esearchResources.es_created);

		// respond to es query request.  the request body will contain different keys (prob_nothing,prob_today,prob_week) for
		// which the response will be different.
		esScope.post('/hubotusage/_search?search_type=count', /prob_nothing/)
			.reply(200, esearchResources.es_query_prob_nothing);
		esScope.post('/hubotusage/_search?search_type=count', /prob_today/)
			.reply(200, esearchResources.es_query_prob_today);
		esScope.post('/hubotusage/_search?search_type=count', /prob_week/)
			.reply(200, esearchResources.es_query_prob_week);
		esScope.post('/hubotusage/_search?search_type=count', /prob_invalid/)
			.reply(200, esearchResources.es_query_prob_invalid);

		// respond to es query request.  the request body will contain different keys (nothing,today,week) for
		// which the response will be different.
		esScope.post('/hubotusage/_search?search_type=count', /nothing/)
			.reply(200, esearchResources.es_query_nothing);
		esScope.post('/hubotusage/_search?search_type=count', /untranslated_keys/)
			.reply(200, esearchResources.es_query_untranslated_keys);
		esScope.post('/hubotusage/_search?search_type=count', /today/)
			.reply(200, esearchResources.es_query_today);
		esScope.post('/hubotusage/_search?search_type=count', /week/)
			.reply(200, esearchResources.es_query_week);
	}
};
