import { DClient } from './directus.js';
const client = new DClient();

export const initials = [
    {
	type: 'checkbox',
	name: 'collections',
	default: [
	    'operations',
	    'panels',
	    'presets',
	    'permissions',
	    'roles',
	    'settings',
	    'translations',
	    'users',
	    'flows',
	],
	message: "What collections needs to be included",
	choices: [
	    'operations',
	    'panels',
	    'presets',
	    'permissions',
	    'roles',
	    'settings',
	    'translations',
	    'users',
	    'flows',
	    'files',
	    'folders'
	]
    },
]

export const questions = [
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
	    const valid = await client.check(value).then((res: any) => {
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
