import React from 'react';
import {  Button, Container, InputAdornment, InputLabel, Input, IconButton, FormControl, TextField} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import axios from 'axios';
import {toast, Toaster} from 'react-hot-toast';
import Router from 'next/router'

const useStyle = makeStyles({
    title: {
        fontSize: '50px',
        textAlign: 'center',
        fontFamily: 'Verdana, Geneva, Tahoma, sans-serif',
        marginBottom: '50px'
    }
})

export default function Signup(){
    const classes = useStyle();
    const [showPassword, setShowPassword] = React.useState(false);
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    async function signUpNewUser(event: React.MouseEvent<HTMLButtonElement>){
        //console.log(username, password) le ho messe nelle variabili.
        event.stopPropagation();
        const formData  = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        try{
            await axios.post('/api/signup', formData); //should be true
            toast.success("New User successfully created");
            //console.log(result)
            setTimeout(()=>{
                Router.push({pathname: '/'});
            }, 1000)
        
        }catch(err: any){
            console.log(err)
            toast.error(`Error while adding new user: ${err.response.data.message ?? err.message}`);
        }
    }

    return(
        <div style={{backgroundColor: "lightsteelblue"}}>
            <div><Toaster/></div>
            <Container fixed className={classes.title}>
                <p> Sign up </p>
                <br></br>
                <TextField
                    id="outlined-multiline-flexible"
                    label="Username"
                    multiline
                    maxRows={4}
                    variant="standard"
                    onChange={(event) => setUsername(event.target.value)}
                />
                <br></br>
                <br></br>
                <FormControl variant="standard">
                <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                    <Input
                        id="standard-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                            >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            </InputAdornment>
                        }
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    </FormControl>
                    <br></br>
                    <Button  variant="contained" color='primary' onClick={(event) => signUpNewUser(event)}>Sign up</Button>
            </Container>
        </div>

    )
}