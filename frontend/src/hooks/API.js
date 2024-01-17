async function handleAuthenticate(signature, publicAddress, nonce, credentials) {
  let response = await fetch(new URL('http://localhost:3001/auth/signin'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ signature, publicAddress, nonce, credentials }),
    credentials: 'include'
  });
  return await response.json();
}

async function createVC(credentials, publicAddress) {
  let response = await fetch(new URL('http://localhost:3001/auth/signup'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ credentials, publicAddress }),
    credentials: 'include'
  });
  return await response.json();
}

const API = { handleAuthenticate, createVC }

export default API;