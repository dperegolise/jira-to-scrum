# Angular Project Template 

This is a basic UI-only template that provides a quick start-up for an opinionated Angular project.

It assumes you are running a REST service at any known location, but lets the UI developer run completely alone with his/her own node Express server.

##Set Up

These setup instructions are for Windows.  However, this stack will run on UNIX, Mac OS, etc,
We also assume you have open access to the web for node and git code.

1. Clone the repository.
2. Make sure you have the following applications installed:
	1. node.js  https://nodejs.org/
	
	2. Once installed, install the following global node modules:
		    npm install -g bower
    		npm install -g gulp
    		npm install -g karma
    		npm install -g jasmine-node
    		
	3. Now open a terminal at the project root.
	
			npm install
			
			bower install
			
3. Now fill in the project details in **package.json** and **bower.json**.  The project ***name*** in package.json will be used to cache-bust the app, so it has to file system friendly.


## What You Get
This template is an industrial strength project set-up, with lots of tooling to create a high quality, tested application.

We follow the guidelines in https://github.com/agilethought/angularjs-styleguide

Here is a run-down of the project parts, by major directory:

### Config : Instructions for building and testing the app
buildConfig.js is used by the gulp process to determine what files to process which way.
It is reasonably documented.  **Vendor libraries are explicitly added here**.  The process does not add all libraries in the vendor library.

### Data: Mock Data for the back-end REST endpoints

Check out he readme.md file there.

### E2E: End to end tests

We'd house our protractor tests here.  See https://github.com/mbcooper/ProtractorExample

### Fixtures: Angular mock data modules for unit tests

### Karma

### Server

### Src

### Vendor

### Other files @ root


## Source File Organization

## Gulp Tasks
