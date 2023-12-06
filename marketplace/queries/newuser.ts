import db from '../db/db';
import bcrypt from 'bcryptjs';

export async function newUser(username: string, password: string, address: string, privatekey: string){
    const hashed_password = await bcrypt.hash(password, 10);
    const user = await new Promise((resolve, reject) =>{
        db.all('SELECT username FROM users WHERE username = ? ', [username], (err: any, rows: any)=>{
            if(err){
                reject(err);
            }
            if(rows.length > 0 ){
                reject("username already exist");
            } else {
                resolve(true);
            }
        })
    })
    return new Promise((resolve, reject) =>{    
    db.run('INSERT INTO users(username, password, address, privatekey) VALUES(?,?,?,?)', [username, hashed_password, address, privatekey], function(err: any){
        if(err){
            reject(err);
        } else {
            resolve(true);
        }
    });
})
}

export async function logIn(username: string, password: string){
    return new Promise((resolve, reject) =>{
        db.all('SELECT username, password FROM users WHERE username = ?', [username], (err: any, rows: any)=>{
            if(err){
                reject(err);
            }
            if(rows.length == 0){
                resolve(false);
            }
            bcrypt.compare(password, rows[0].password, (err, data) =>{
                if(err){
                    reject(err);
                }
                if (data) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        })
    })
}

export async function AddressAndKey(username: string){
    return new Promise((resolve, reject) =>{
        db.all('SELECT address, privatekey FROM users WHERE username = ?', [username], (err: any, rows: any)=>{
            if(err){
                reject(err);
            }
            if(rows.length == 0){
                reject("username doesn't exist");
            }
            resolve(rows[0]);
        })
    })
}

export async function KeyFromAddress(address: string){
    return new Promise((resolve, reject) =>{
        db.all('SELECT privatekey FROM users WHERE address = ?', [address], (err: any, rows: any)=>{
            if(err){
                reject(err);
            }
            if(rows.length == 0){
                reject("Address doesn't exist");
            }
            resolve(rows[0]);
        })
    })
}
