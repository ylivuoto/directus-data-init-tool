import inquirer from 'inquirer';
import { DClient } from './lib/directus.js';

//import {cwd} from 'node:process';
//import fs from 'node:fs';
//import path from 'node:path';

const client = new DClient();

const questions = [
    {
	type: 'input',
	name: 'url',
	default: 'http://localhost:8055',
	message: "What's the instance URL?",
	validate(value: string) {
	    if (validateUrl(value)) {
		client.updateURL(value);
		return true;
	    }

	    return 'Please enter a valid URL.';
	},
    },
    {
	type: 'input',
	name: 'token',
	message: "What's the Admin Token?",
	async validate(value: string) {
	    const valid = await client.check(value).then((res) => {
		console.log(res)
	    if (res) {
		client.updateToken(value);
		return true;
	    }

	    return 'Please enter a valid token.';
	    });

	    return valid;
	},
    },
];

const validateUrl = (url: string) => {
    try {
	new URL(url);
	return true;
    } catch (err) {
	return false;
    }
}

// const validateToken = async () => {
//     let valid: boolean = false;

//     client.check().then((res) => {
// 	valid = res;
// 	return res;
//     });

//     return valid;
// }

const description = 'Apply a template to a blank Directus instance.'
console.log(description);

interface IPrompts {
    url: string;
    token: string;
}


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
