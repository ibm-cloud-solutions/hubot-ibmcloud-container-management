/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2016. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
'use strict';

module.exports = {
	es_acknowledged: {
		acknowledged: true
	},
	es_created: {
		created: true
	},
	es_query_nothing: {
		aggregations: {
			bot_activity: {
				buckets: []
			}
		}
	},
	es_query_untranslated_keys: {
		aggregations: {
			bot_activity: {
				buckets: [
					{
						key: 'activity.badkey',
						doc_count: 1
					},
					{
						key: 'activity.app.start',
						doc_count: 1
					},
					{
						key: 'activity.badkey',
						doc_count: 3
					}
				]
			}
		}
	},
	es_query_today: {
		aggregations: {
			bot_activity: {
				buckets: [
					{
						key: 'activity.threshold.violation.cpu',
						doc_count: 1
					},
					{
						key: 'activity.threshold.violation.memory',
						doc_count: 1
					},
					{
						key: 'activity.threshold.violation.disk',
						doc_count: 1
					},
					{
						key: 'activity.app.event',
						doc_count: 1
					},
					{
						key: 'activity.app.start',
						doc_count: 1
					},
					{
						key: 'activity.app.crash',
						doc_count: 1
					},
					{
						key: 'activity.app.logs',
						doc_count: 1
					},
					{
						key: 'activity.app.stop',
						doc_count: 1
					},
					{
						key: 'activity.app.remove',
						doc_count: 1
					},
					{
						key: 'activity.service.create',
						doc_count: 1
					},
					{
						key: 'activity.service.remove',
						doc_count: 1
					},
					{
						key: 'activity.github.deploy',
						doc_count: 1
					}
				]
			}
		}
	},
	es_query_week: {
		aggregations: {
			bot_activity: {
				buckets: [
					{
						key: 'activity.threshold.violation.cpu',
						doc_count: 11
					},
					{
						key: 'activity.threshold.violation.memory',
						doc_count: 12
					},
					{
						key: 'activity.threshold.violation.disk',
						doc_count: 13
					},
					{
						key: 'activity.app.event',
						doc_count: 2
					},
					{
						key: 'activity.app.start',
						doc_count: 3
					},
					{
						key: 'activity.app.crash',
						doc_count: 4
					},
					{
						key: 'activity.app.logs',
						doc_count: 5
					},
					{
						key: 'activity.app.stop',
						doc_count: 6
					},
					{
						key: 'activity.app.remove',
						doc_count: 7
					},
					{
						key: 'activity.service.create',
						doc_count: 8
					},
					{
						key: 'activity.service.remove',
						doc_count: 9
					},
					{
						key: 'activity.github.deploy',
						doc_count: 10
					}
				]
			}
		}
	},
	es_query_prob_nothing: {
		aggregations: {
			app_problems: {
				buckets: []
			}
		}
	},
	es_query_prob_today: {
		aggregations: {
			app_problems: {
				buckets: [
			        {
			          	key: "testapp6",
			          	doc_count: 6,
			          	app_activity_type: {
			            	buckets: [
			              		{
			                		key: "activity.threshold.violation.cpu",
			                		doc_count: 1
			              		},
			              		{
			                		key: "activity.threshold.violation.disk",
			                		doc_count: 1
			              		},
			              		{
			                		key: "activity.app.crash",
			                		doc_count: 3
			              		}
			            	]
			          	}
			        },
			        {
			          	key: "testapp5",
			          	doc_count: 5,
			          	app_activity_type: {
			            	buckets: [
			              		{
			                		key: "activity.app.crash",
			                		doc_count: 5
			              		}
			            	]
			          	}
			        },
			        {
			          	key: "testapp4",
			          	doc_count: 4,
			          	app_activity_type: {
			            	buckets: [
			              		{
			                		key: "activity.threshold.violation.cpu",
			                		doc_count: 4
			              		}
			            	]
			          	}
			        }
				]
			}
		}
	},
	es_query_prob_week: {
		aggregations: {
			app_problems: {
				buckets: [
			        {
			          	key: "testapp6",
			          	doc_count: 12,
			          	app_activity_type: {
			            	buckets: [
			              		{
			                		key: "activity.threshold.violation.disk",
			                		doc_count: 4
			              		},
			              		{
			                		key: "activity.threshold.violation.cpu",
			                		doc_count: 3
			              		},
			              		{
			                		key: "activity.threshold.violation.memory",
			                		doc_count: 1
			              		},
			              		{
			                		key: "activity.app.crash",
			                		doc_count: 4
			              		}
			            	]
			          	}
			        },
			        {
			          	key: "testapp5",
			          	doc_count: 10,
			          	app_activity_type: {
			            	buckets: [
			              		{
			                		key: "activity.threshold.violation.memory",
			                		doc_count: 3
			              		},
			              		{
			                		key: "activity.threshold.violation.cpu",
			                		doc_count: 1
			              		},
			              		{
			                		key: "activity.app.crash",
			                		doc_count: 6
			              		}
			            	]
			          	}
			        },
			        {
			          	key: "testapp4",
			          	doc_count: 8,
			          	app_activity_type: {
			            	buckets: [
			              		{
			                		key: "activity.threshold.violation.disk",
			                		doc_count: 4
			              		},
			              		{
			                		key: "activity.threshold.violation.memory",
			                		doc_count: 4
			              		}
			            	]
			          	}
			        },
			        {
			          	key: "testapp3",
			          	doc_count: 6,
			          	app_activity_type: {
			            	buckets: [
			              		{
			                		key: "activity.app.crash",
			                		doc_count: 5
			              		},
			              		{
			                		key: "activity.threshold.violation.disk",
			                		doc_count: 1
			              		}
			            	]
			          	}
			        },
			        {
			          	key: "testapp2",
			          	doc_count: 4,
			          	app_activity_type: {
			            	buckets: [
			              		{
			                		key: "activity.threshold.violation.memory",
			                		doc_count: 3
			              		},
			              		{
			                		key: "activity.app.crash",
			                		doc_count: 1
			              		}
			            	]
			          	}
			        },
			        {
			          	key: "testapp1",
			          	doc_count: 2,
			          	app_activity_type: {
			            	buckets: [
			              		{
			                		key: "activity.app.crash",
			                		doc_count: 2
			              		}
			            	]
			          	}
			        }
				]
			}
		}
	},
	es_query_prob_invalid: {
		aggregations: {
			app_problems: {
				buckets: {
					length: 1
			    }
			}
		}
	},
};
