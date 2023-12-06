import React from 'react';
import { Button, Container, List, Divider, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'; 
import axios from 'axios';
import Router from 'next/router'

const useStyles = makeStyles({
    signin:{
        marginTop: '50px',
        width: '100%',
        marginBottom: '30px'
    },
    title: {
        fontSize: '50px',
        textAlign: 'center',
        fontFamily: 'Verdana, Geneva, Tahoma, sans-serif',
        marginBottom: '50px'
    },
    signup: {
        width: '100%',
        marginBottom: '50px'
    }
})

export default function Login(){
    const classes = useStyles();
    const[username, setUsername] = React.useState("");
    const[password, setPassword] = React.useState("");

    async function handleSignIn(event: React.MouseEvent<HTMLButtonElement>){
        event.preventDefault();
        const formData  = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        try{
            const res = await axios.post("/api/signin", formData);
            localStorage.setItem('jwt', res.data.token);
            Router.push({
                pathname: "/home/"+username, 
                query: {jwt: res.data.token}
            }, "/home/"+username);
        }catch(err){
            console.error(err)
        }

    }

    return(
        <div style={{backgroundColor: "lightsteelblue"}}>
            <Container fixed>
                <p className={classes.title}> Data Cellar Marketplace Demo</p>
                <List>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <TextField
                        required
                        id="outlined-required"
                        label="Username"
                        onChange={(event)=>setUsername(event.target.value)}
                    />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <TextField
                        required
                        id="outlined-required"
                        label="Password"
                        onChange={(event)=>setPassword(event.target.value)}
                    />
                    </div>
                    <Button variant="contained" color='primary' className={classes.signin} onClick={(event) => handleSignIn(event)}>Sign in</Button>
                    <Divider style={{ borderBottom: '1px solid black' }} variant="middle"/>
                    <br></br>
                    <br></br>
                    <Button variant="contained" color='primary' className={classes.signup} href='/signup'>Sign up</Button>
                </List>
            </Container>
        </div>
    )
}