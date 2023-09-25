import fs from 'fs';

export default function retrieveBackup() {
    try {
	const f = fs.readFileSync('./backups/schema/snapshot.json', 'utf8')
	const schema = JSON.parse(f);
	return schema;
    } catch(error) {
        console.log(error);
	return;
    }
}

export const retrieveConfig = (collection: string) => {
    const f = fs.readFileSync(`./backups/${collection}.json`, 'utf8');
    return JSON.parse(f);
}
