import React, { useEffect } from 'react';
import { Button, Container, ButtonGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import Header from '@/src/header';
import axios from 'axios';

export async function getServerSideProps(context: any){
    // Logica di gestione della richiesta
    // Restituisci un oggetto props
    try{
    const data = await axios.get("http://localhost:3000/api/getData", 
    {
      params: {username: context.params.username}, 
      headers: {
      'Authorization': `Bearer ${context.query.jwt}`
    }});
      //here we need to find all the NFT available to show them on the home
      //TODO
      console.log(data)
      //FINISH
      return{props: {context: context.query}}
    } catch(err: any) {
        return {
            redirect: {
              permanent: false,
              destination: "/",
            },
            props:{},
          };
    }
  };

export default function Home(){
    const router = useRouter();

    return( 
        <>
        <Header username={router.query.username!} />
        <div>Ciao</div>
        </>
    )
}