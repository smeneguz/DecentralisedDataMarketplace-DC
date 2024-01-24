import React, { useEffect, useState } from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from "./components/Login.js"
import Profile from "./components/Profile.js"
import MarketDatasets from "./components/MarketDatasets.js"
import Signup from "./components/Signup.js"
import Signin from "./components/Signin.js"
import LogOutModal from "./components/ModalLogout.js"
import { Container, Alert, Col, Row } from "react-bootstrap";
import MyNavbar from './components/Navbar';
import { MetaMaskContextProvider, useMetaMask } from './hooks/useMetaMask'
import { jwtDecode } from "jwt-decode";
import { BrowserRouter as Router, Routes, Route, useNavigate, Outlet } from 'react-router-dom';

function App() {
  return (
    <Router>
      <MetaMaskContextProvider>
        <App2 />
      </MetaMaskContextProvider>
    </Router>
  );
}

function App2() {

  const navigate = useNavigate();

  const [showExit, setShowExit] = useState(false);
  const [vc, setVc] = useState("");
  const [profilePage, setProfilePage] = useState(1);
  const [message, setMessage] = useState("");
  const [nftAddress, setNftAddress] = useState("");
  const [nftMarketAddress, setNftMarketAddress] = useState("");
  
  const { wallet, error, errorMessage, clearError, setOpCompleted, authState, setAuthState  } = useMetaMask();

  useEffect(() => {
    const timeId = setTimeout(() => {
      setMessage("");
    }, 10000)

    return () => {
      clearTimeout(timeId)
    }
  }, [message]);
  
  useEffect(() => {
    const cookies = document.cookie.split(';');
    const authTokenCookie = cookies.find(cookie => cookie.trim().startsWith('authToken='));
    if (authTokenCookie) {
      const authToken = authTokenCookie.split('=')[1];
      const { publicAddress, name, surname, email, profession, country, region } = jwtDecode(authToken);
      setAuthState({ publicAddress, name, surname, email, profession, country, region });
    }
  }, []);

  const handleLoggedIn = (auth, publicAddress, credentials) => {
    document.cookie = `authToken=${JSON.stringify(auth)}; path=/; samesite=None; secure`;
    const name = credentials.name;
    const surname = credentials.surname;
    const email = credentials.email;
    const profession = credentials.profession;
    const country = credentials.country;
    const region = credentials.region;
    setAuthState({ publicAddress, name, surname, email, profession, country, region});
    navigate('/');
  };

  const handleLoggedOut = () => {
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setAuthState(undefined);
    setShowExit(false);
    setNftMarketAddress("");
    navigate('/');
  };

  const handleVcCreation = (vcCreated) => {
    setVc(vcCreated);
    setOpCompleted(true);
  }

  function Layout() {
    return (
      <>
        <MyNavbar setShowExit={setShowExit} authState={authState} setNftMarketAddress={setNftMarketAddress} />
        <Container className="box-center" >
          {error &&
            <Alert variant="danger" className="err-alert" onClose={clearError} dismissible >
              <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
              <p> { errorMessage } </p>
            </Alert>
          }
          {message &&
            <Alert variant="success" className="err-alert" onClose={() => setMessage("")} dismissible >
              <Alert.Heading>Operation successfully concluded!</Alert.Heading>
              <p> { message } </p>
            </Alert>
          }
          <LogOutModal showExit={showExit} setShowExit={setShowExit} handleLoggedOut={handleLoggedOut} />
          <Outlet />
        </Container>
      </>
    );
  }

  return (

    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={(wallet.accounts.length > 0 && window.ethereum?.isConnected) ? 
          <MarketDatasets nftMarketAddress={nftMarketAddress} setNftMarketAddress={setNftMarketAddress} authState={authState} setMessage={setMessage}/> :
          <Login />} />
        <Route path="signin" element={<Signin handleLoggedIn={handleLoggedIn} />} />
        <Route path="signup" element={<Signup handleVcCreation={handleVcCreation} vc={vc} setVc={setVc} />} />
        <Route path="profile" element={<Profile authState={authState}  handleLoggedOut={handleLoggedOut} profilePage={profilePage} setProfilePage={setProfilePage} setMessage={setMessage} setNftAddress={setNftAddress} nftAddress={nftAddress} />} />
      </Route>
    </Routes>

  );
}

export default App;