
import { replicateCouchDB, getFetchWithCouchDBAuthorization, RxCouchDBReplicationState } from "rxdb/plugins/replication-couchdb";
import { getDatabase } from "../db";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
let replications: RxCouchDBReplicationState<any>[] = [];


export const syncClient = async() => {
    const syncURL = 'http://' + window.location.hostname + ':5984/';
    console.log('host: ' + syncURL);
    const db = await getDatabase();

  // Setup replication to couchdb
     // sync
    console.log('DatabaseService: sync');
    /* 
    // this failed because of auth. don't know how to specify username/password with fetch
    await Promise.all(
        Object.values(db.collections).map(async (col) => {
            try {
                // create the CouchDB database
                await fetch(
                    syncURL + col.name + '/',
                    {
                        method: 'PUT'
                    }
                );
            } catch (err) { 
                console.log('Got error creating CouchDB database:');
                console.dir(err);
            }
        })
    ); */
    console.log('DatabaseService: sync - start live');
    Object.values(db.collections).map(col => col.name).map(colName => {
        const colname = colName.toLowerCase();
        const url = syncURL + colname + '/';
        console.log('url: ' + url);
      const replicationState = replicateCouchDB({
            replicationIdentifier: colname + '-' + url,
            collection: db[colName],
            url,
            fetch: getFetchWithCouchDBAuthorization('admin', 'jimbo'),
            live: true,
            pull: {},
            push: {},
            autoStart: true
        });
        replicationState.error$.subscribe(err => {
            console.log('Got replication error:');
            console.dir(err);
        });
        replications.push(replicationState);
    });

};


export function cancelReplication() {
  for (const rep of replications) {
    rep.cancel();
  }
  replications = [];
}

