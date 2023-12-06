const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/database.sqlite', (err: any) =>{
    if(err){
        console.error(err.message);
    }
});


export default db;