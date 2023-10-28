import inquirer from 'inquirer';
import { DClient } from './lib/directus.js';
import { questions, initials, frontend } from './lib/constants.js';
import { exec } from 'node:child_process'
import fs from 'fs';

import { v4 as uuidv4 } from 'uuid';


console.log("Apply a template to a blank Directus instance. \n\n");
console.log('\x1b[1;31m', 'Works properly only on Linux.\n', '\x1b[0m');

const client = new DClient();

interface IPrompts {
    url: string;
    token: string;
    collections: Array<string>;
}

interface IFrontend {
    server_token: string;
    nextjs_dir: string;
}

const logError = (e :any) => {
    // Handle error here
    if (e.isTtyError) {
	console.log('TTY err');
	// Prompt couldn't be rendered in the current environment
    } else {
	// Something else went wrong
	console.log('Prompter error.')
	console.log(e);
    }
}

const key = uuidv4();
const secret = uuidv4();
let directusDir = '/headless-site/directus-on-docker';
let nextjsDir = '/headless-site/directus-nextjs';
let composeFile = 'docker-compose.yml';

// Prompt some initial values like secrets, collections etc.
const inits = inquirer
    .prompt(initials)
    .then(async (answers: any) => {
	exec(`printf ${answers.admin_email} | docker secret create admin_email -`);
	console.log('Admin email wrote.');
	exec(`printf ${answers.admin_password} | docker secret create admin_password -`);
	console.log('Admin password wrote.');
	exec(`printf ${answers.postgres_db} | docker secret create postgres_db -`);
	console.log('PostgreSQL database name wrote.');
	exec(`printf ${answers.postgres_user} | docker secret create postgres_user -`);
	console.log('PostgreSQL username wrote.');
	exec(`printf ${answers.postgres_password} | docker secret create postgres_password -`);
	console.log('PostgreSQL user password wrote.');
	exec(`printf ${key} | docker secret create project_key -`);
	console.log('Key for directus wrote.');
	exec(`printf ${secret} | docker secret create project_secret -`);
	console.log('Secret for directus wrote.');
	console.log('\n');
	directusDir = answers.directus_dir;
	return;
    })
    .catch((error: any) => {
	logError(error);
    });

// Invoke the docker command after initial setup is done
inits.then(() => {
    console.log('Starting up the directus related containers...')
    exec(`docker stack deploy --compose-file ${directusDir}/${composeFile} directus_cms`);
});

// And similarly prompt further questions after init is done
const conf = inits.then(async () =>{
    return inquirer
	.prompt(questions)
	.then(async (answers: IPrompts) => {
	    client.updateURL(answers.url);
	    client.updateToken(answers.token);
	    client.updateCollections(answers.collections)
	    await client.load();
	})
	.catch((error: any) => {
	    logError(error);
	});
});

// Run nextjs frontend container with correct env values
conf.then( () => {
    inquirer
	.prompt(frontend)
	.then(async (answers: IFrontend) => {
	    const envs = `DIRECTUS_URL="${client.getUrl()}"\nDIRECTUS_WEBAPI="${answers.server_token}"`
	    fs.writeFileSync('./.env', envs, { 
	    encoding: "utf8", 
	    flag: "w", 
	});
	    
	    nextjsDir = answers.nextjs_dir;
	    console.log('Starting up the frontend container...')
	    exec(`docker stack deploy --compose-file ${nextjsDir}/${composeFile} nextjs_frontend`);
	})
	.catch((error: any) => {
	    logError(error);
	});
});
