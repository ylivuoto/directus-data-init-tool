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

export const retrieveConfig = (dir: string, collection: string) => {
    const f = fs.readFileSync(`${dir}/${collection}.json`, 'utf8');
    let items = JSON.parse(f);

    if(!Array.isArray(items)) return items;
    
    for(let item of items){
	delete item.translations;
	delete item.panels;
	delete item.operations
	delete item.users;

	if(item.user) item.user = null;
	if(item.resolve) item.resolve = null;
	if(item.reject) item.reject = null;
    }

    return items;
}
