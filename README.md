[![Build Status](https://travis-ci.org/ibm-cloud-solutions/hubot-ibmcloud-container-management.svg?branch=master)](https://travis-ci.org/ibm-cloud-solutions/hubot-ibmcloud-container-management)
[![Coverage Status](https://coveralls.io/repos/github/ibm-cloud-solutions/hubot-ibmcloud-container-management/badge.svg?branch=cleanup)](https://coveralls.io/github/ibm-cloud-solutions/hubot-ibmcloud-container-management?branch=master)
[![Dependency Status](https://dependencyci.com/github/ibm-cloud-solutions/hubot-ibmcloud-container-management/badge)](https://dependencyci.com/github/ibm-cloud-solutions/hubot-ibmcloud-container-management)
[![npm](https://img.shields.io/npm/v/hubot-ibmcloud-container-management.svg?maxAge=2592000)](https://www.npmjs.com/package/hubot-ibmcloud-container-management)

# hubot-ibmcloud-container-management

Script package that exposes various IBM Cloud Container functionality through Hubot.

## Getting Started
  * [Usage](#usage)
  * [Commands](#commands)
  * [Hubot Adapter Setup](#hubot-adapter-setup)
  * [Development](#development)
  * [License](#license)
  * [Contribute](#contribute)

## Usage

If you are new to Hubot visit the [getting started](https://hubot.github.com/docs/) content to get a basic bot up and running.  Next, follow these steps for adding this external script into your hubot:

1. `cd` into your hubot directory
2. Install this package via `npm install hubot-ibmcloud-container-management --save`
2. Install this package via `npm install hubot-ibmcloud-formatter --save`
3. Add `hubot-ibmcloud-container-management`, `hubot-ibmcloud-formatter` to your `external-scripts.json`
4. Add the necessary environment variables:
```
HUBOT_BLUEMIX_API=<Bluemix API URL>
HUBOT_BLUEMIX_ORG=<Bluemix Organization>
HUBOT_BLUEMIX_SPACE=<Bluemix space>
HUBOT_BLUEMIX_USER=<Bluemix User ID>
HUBOT_BLUEMIX_PASSWORD=<Password for the Bluemix use>
```

5. Start up your bot & off to the races!


## Commands

- `hubot container delete|destroy|remove [container]` - Deletes a container in the active space.
- `hubot container list|show` - Lists all of the containers in the active space.
- `hubot container logs [container]` - Gets recent logs for a container.
- `hubot container start [container]` - Starts the contatiner in the active space.
- `hubot container status [container]` - Get status for a container.
- `hubot container stop [container]` - Stops the contatiner in the active space.
- `hubot container(s) help` - Show available container commands.

- `hubot containergroup delete|destroy|remove [container_group]` - Deletes a container group in the active space.
- `hubot containergroup list|show` - Lists all of the container groups in the active space.
- `hubot containergroup scale [container_group] [number]` - Scale the [container_group] to [number] instances.
- `hubot containergroup(s) help` - Show available containergroup commands.

## Hubot Adapter Setup

Hubot supports a variety of adapters to connect to popular chat clients.  For more feature rich experiences you can setup the following adapters:
- [Slack setup](https://github.com/ibm-cloud-solutions/hubot-ibmcloud-container-management/blob/master/docs/adapters/slack.md)
- [Facebook Messenger setup](https://github.com/ibm-cloud-solutions/hubot-ibmcloud-container-management/blob/master/docs/adapters/facebook.md)

## Development

Please refer to the [CONTRIBUTING.md](https://github.com/ibm-cloud-solutions/hubot-ibmcloud-container-management/blob/master/CONTRIBUTING.md) before starting any work.  Steps for running this script for development purposes:

### Configuration Setup

1. Create `config` folder in root of this project.
2. Create `env` in the `config` folder, with the following contents:
```
export HUBOT_BLUEMIX_API=<Bluemix API URL>
export HUBOT_BLUEMIX_ORG=<Bluemix Organization>
export HUBOT_BLUEMIX_SPACE=<Bluemix space>
export HUBOT_BLUEMIX_USER=<Bluemix User ID>
export HUBOT_BLUEMIX_PASSWORD=<Password for the Bluemix use>
```
3. In order to view content in chat clients you will need to add `hubot-ibmcloud-formatter` to your `external-scripts.json` file. Additionally, if you want to use `hubot-help` to make sure your command documentation is correct. Create `external-scripts.json` in the root of this project, with the following contents:
```
[
	"hubot-help",
	"hubot-ibmcloud-formatter"
]
```
4. Lastly, run `npm install` to obtain all the dependent node modules.

### Running Hubot with Adapters

Hubot supports a variety of adapters to connect to popular chat clients.

If you just want to use:
 - Terminal: run `npm run start`
 - [Slack: link to setup instructions](https://github.com/ibm-cloud-solutions/hubot-ibmcloud-container-management/blob/master/docs/adapters/slack.md)
 - [Facebook Messenger: link to setup instructions](https://github.com/ibm-cloud-solutions/hubot-ibmcloud-container-management/blob/master/docs/adapters/facebook.md)

## License <a id="license"></a>

See [LICENSE.txt](https://github.com/ibm-cloud-solutions/hubot-ibmcloud-container-management/blob/master/LICENSE.txt) for license information.

## Contribute <a id="contribute"></a>

Please check out our [Contribution Guidelines](https://github.com/ibm-cloud-solutions/hubot-ibmcloud-container-management/blob/master/CONTRIBUTING.md) for detailed information on how you can lend a hand.
