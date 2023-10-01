import { DClient } from './directus.js';
const client = new DClient();

export const initials = [
    {
	type: 'input',
	name: 'directus_dir',
	default: '~/directus-on-docker',
	message: "Please give a directus root-folder:",
    },
    {
	type: 'input',
	name: 'admin_email',
	default: 'admin@example.com',
	message: "Please give an admin email:",
    },
    {
	type: 'password',
	mask: '.',
	name: 'admin_password',
	message: "Please give an admin password:",
    },
    {
	type: 'input',
	name: 'postgres_db',
	default: 'directus',
	message: "Please give a name for database:",
    },
    {
	type: 'input',
	name: 'postgres_user',
	default: 'directus',
	message: "And a database username:",
    },
        {
	type: 'password',
	mask: '.',
	name: 'postgres_password',
	message: "And a password:",
    },
]

export const questions = [
    {
	type: 'checkbox',
	name: 'collections',
	default: [
	    'roles',
	    'users',
	    'permissions',
	    'dashboards',
	    'panels',
	    'flows',
	    'operations',
	    'presets',
	    'settings',
	    'translations',
	    'relations'
	],
	message: "What collections needs to be included",
	choices: [
	    'roles',
	    'users',
	    'permissions',
	    'dashboards',
	    'panels',
	    'flows',
	    'operations',
	    'presets',
	    'settings',
	    'translations',
	    'relations',
	    'files',
	    'folders'
	]
    },
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
