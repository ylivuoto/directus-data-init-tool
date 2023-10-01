import inquirer from 'inquirer';
import { DClient } from './lib/directus.js';
import { questions, initials } from './lib/constants.js';
import { exec } from 'node:child_process'

import { v4 as uuidv4 } from 'uuid';

const client = new DClient();

const description = 'Apply a template to a blank Directus instance.'
console.log(description);

interface IPrompts {
    url: string;
    token: string;
    collections: Array<string>;
}

const key = uuidv4();
const secret = uuidv4();
let directusDir = '~/';
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
    })
    .catch((error: any) => {
	if (error.isTtyError) {
	    console.log('TTY err');
	    // Prompt couldn't be rendered in the current environment
	} else {
	    // Something else went wrong
	    console.log('Prompter error.')
	    console.log(error);
	}
    });

// Invoke the docker command after initial setup is done
inits.then(() => {
    console.log('Starting up the directus related containers...')
    exec(`docker stack deploy --compose-file ${directusDir}/${composeFile} directus_cms`);
});

// And similarly prompt further questions after init is done
inits.then(() =>{
inquirer
    .prompt(questions)
    .then(async (answers: IPrompts) => {
	console.log(answers)
	client.updateURL(answers.url);
	client.updateToken(answers.token);
	client.updateCollections(answers.collections)
	await client.load();
    })
    .catch((error: any) => {
	if (error.isTtyError) {
	    console.log('TTY err');
	    // Prompt couldn't be rendered in the current environment
	} else {
	    // Something else went wrong
	    console.log('Prompter error.')
	    console.log(error);
	}
    });
});
