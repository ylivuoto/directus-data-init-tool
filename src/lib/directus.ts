import { createDirectus, authentication, rest, schemaApply, schemaDiff, readMe, createRoles, createUsers, createOperations, createPanels, createPermissions, updateSettings, createTranslations, createFlows, createFolders, uploadFiles, createPreset, createDashboards, createRelation, /* readRoles, readUsers, readPermissions, readOperations, readPanels, readPresets, readTranslations, readFlows, readFolders */ } from '@directus/sdk';
import retrieveBackup, { retrieveConfig } from './retrieve.js';

export class DClient {
    private token: string | undefined = '';
    private url: string | undefined = '';
    private collections: Array<string> = [];
    // TODO: Client does not apply URL changes after declaration
    private client =  createDirectus<any>('http://localhost:8055').with(authentication()).with(rest());
    
    constructor(url?: string, token?: string) {
	this.url = url;
	this.token = token;
	this.client.url = new URL(this.url ? this.url : 'http://localhost');
	this.client.setToken(this.token ? this.token : '');
    }

    public updateToken(token: string) {
	this.token = token;
	this.client.setToken(this.token);
    }

    public updateURL(url: string){
	this.url = url;
	this.client.url = new URL(this.url);
    }

    public updateCollections(collections: Array<string>){
	this.collections = collections;
    }

    public async check(value: string): Promise<boolean> {
	this.updateToken(value);
	return await this.client.request(readMe())
	    .then(() => true)
	    .catch(() => false);
    }

    public getUrl(){
	return this.url;
    }

    public async load() {
	const schema = retrieveBackup();

	if(!schema){
	    console.log('Schema not defined.')
	    return true;
	}

	const getDiff = this.client.request(schemaDiff(schema, true))
	    .catch((error) => {
		console.log('Diff error: ', error)
		return true;
	    });

	const apply = getDiff.then(async (diff: any) => {
	    console.log(diff);
		if (!diff) {
		    console.log('Schema diff empty.')
		}

	    return this.client.request(schemaApply(diff))
		.catch((error) => console.log('Schema error: ', error));
	    
	}).catch(() => console.log('Error when apply!'));

	const writeMapping: any = {
	    'roles': createRoles,
	    'users': createUsers,
	    'permissions': createPermissions,
	    'dashboards': createDashboards,
	    'operations': createOperations,
	    'panels': createPanels,
	    'settings': updateSettings,
	    'translations': createTranslations,
	    'flows': createFlows,
	    'files': uploadFiles,
	    'folders': createFolders
	};
	
	apply.then( async () => {
	    for await (const collection of this.collections){
		const write = writeMapping[collection];

		if(!write){
		    console.error(`There is no function for ${collection}`);
		    continue;
		}

		const config = retrieveConfig('./backups', collection);
		this.client.request(write(config)).
		    catch((error) =>
			console.log(`In ${collection}`, error));
	    }
	    
	    const presets = retrieveConfig('./backups', 'presets');
	    const relations = retrieveConfig('./backups', 'relations');
	
	    for await(const preset of presets){
		if(!this.collections.includes('presets')) break;
		this.client.request(createPreset(preset))
		    .catch((error) =>
			console.log(`With presets in ${preset.id}`, error));
	    }

	    for await(const relation of relations){
		if(!this.collections.includes('relations')) break;
		this.client.request(createRelation(relation))
		    .catch((error) =>
			console.log(`With relations in ${relation.collection}`, error));
	    }
	    
	}).catch((error) => console.log('Error with system collections: ', error));

	return;
    }
}
