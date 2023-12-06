import { useRouter } from 'next/router';
import Header from '@/src/header';
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles((theme) => ({
    form: {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '300px',
      margin: '0 auto',
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
      },
    },
  }));

export default function addItem(){
    const router = useRouter();
    const classes = useStyles();
    const [checked, setChecked] = useState(false);
    const [periodic, setPeriodic] = useState(false);
    const [usage, setUsage] = useState(false);

  const handlePeriodicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPeriodic(event.target.checked);
    setUsage(!event.target.checked);
  };

  const handleUsageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsage(event.target.checked);
    setPeriodic(!event.target.checked);
  };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Add your form submission logic here
      };

    return( 
        <>
        <Header username={router.query.username!} />
        <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
            label="Name"
            variant="outlined"
            required
            />
            <TextField
            label="Symbol"
            variant="outlined"
            required
            />
            <TextField
            label="URI"
            variant="outlined"
            multiline
            required
            />
            <FormControlLabel
                control={
                    <Checkbox
                    checked={checked}
                    onChange={(event) => setChecked(!checked)}
                    color="primary"
                    />
                }
                label="Transferable"
            />
            {checked && 
                <>
                <div>Associa una licenza con cui gli altri utenti possono acquistare il tuoi dato/servizio</div>
                <FormControlLabel
                    control={
                    <Checkbox
                        checked={periodic}
                        onChange={handlePeriodicChange}
                        color="primary"
                    />
                    }
                    label="Periodic license"
                />
                <FormControlLabel
                    control={
                    <Checkbox
                        checked={usage}
                        onChange={handleUsageChange}
                        color="primary"
                    />
                    }
                    label="Usage license"
                />
                </>
            }
            {periodic &&
                <>
                </>
            }
            {usage &&
                <>
                </>
            }
            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
        </form>
        </>
    )
}