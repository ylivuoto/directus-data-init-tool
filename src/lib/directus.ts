import { createDirectus, authentication, rest, schemaApply, schemaDiff, readMe} from '@directus/sdk';
import retrieveBackup from './retrieve.js';

export class DClient {
    private token: string | undefined = '';
    private url: string | undefined = '';
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

    public async check(value: string): Promise<boolean> {
	this.updateToken(value);
	return await this.client.request(readMe())
	    .then(() => true)
	    .catch(() => false);
    }

    public async load() {
	const schema = retrieveBackup();

	if(!schema){
	    console.log('Schema not defined.')
	    return;
	}

	const diff = await this.client.request(schemaDiff(schema))

	if(!diff) {
	    console.log('Schema diff empty.')
	    return;
	}
	
	await this.client.request(schemaApply(diff))
	    .catch((error) => console.log(error));
    }
}
