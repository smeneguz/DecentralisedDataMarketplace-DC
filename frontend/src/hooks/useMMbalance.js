import web3Init from './web3.core';

const chainObj = web3Init();

export const convertDataCellarToken = async (address, value) => {
  try {
    await chainObj.DataCellarToken.methods.convertEtherToTokens().send({ from: address, value: chainObj.web3.utils.toWei(value, 'ether'), gas: 500000, gasPrice: '10000000000' })
    const balance = await chainObj.DataCellarToken.methods.balanceOf(address).call({ from: address })
    return parseInt(balance);
  } catch (err) {
    throw new Error(`Error converting ETH in DataCellar tokens. `);
  }
}

export const getBalance = async (address) => {
  try {
    const balance = await chainObj.DataCellarToken.methods.balanceOf(address).call({ from: address })
    return parseInt(balance);
  } catch (err) {
    throw new Error(`Error getting the balance of DataCellar tokens. `);
  }
}

export const getGasBalance = async (address) => {
  try {
    const balanceWei = await chainObj.web3.eth.getBalance(address)
    const balanceEther = chainObj.web3.utils.fromWei(balanceWei, 'ether');
    return parseFloat(balanceEther);
  } catch (err) {
    throw new Error(`Error getting the balance of ethereum. `);
  }
}


