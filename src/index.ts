import inquirer from 'inquirer';
import { DClient } from './lib/directus.js';
import { questions, initials } from './lib/constants.js';
import { exec } from 'node:child_process'

const client = new DClient();

//import {cwd} from 'node:process';
//import fs from 'node:fs';
//import path from 'node:path';



const description = 'Apply a template to a blank Directus instance.'
console.log(description);

interface IPrompts {
    url: string;
    token: string;
}


const inits = inquirer
    .prompt(initials)
    .then(async (answers: any) => {
	console.log(answers)
	exec(`printf "test" | docker secret create test_scrt -`)
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

inits.then(() =>{
inquirer
    .prompt(questions)
    .then(async (answers: IPrompts) => {
	client.updateURL(answers.url);
	client.updateToken(answers.token);
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
