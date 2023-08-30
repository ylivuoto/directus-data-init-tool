import fs from 'fs';

export default function retrieveBackup() {
    try {
	const f = fs.readFileSync('./backups/schema.json', 'utf8')
	const schema = JSON.parse(f);
	return schema;
    } catch(error) {
        console.log(error);
	return;
    }
}
