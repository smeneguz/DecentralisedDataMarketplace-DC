import web3Init from './web3.core';
import template721 from '../contract/ERC721template.json';
import template20 from '../contract/ERC20template.json';

const chainObj = web3Init();

export const getPurchasedDatasets = async (address) => {
  try {
    const erc721arr = await chainObj.factory721.methods.geterc721array().call({ from: address })
    let nft_DataLicenses = [];
    for (let i = 0; i < erc721arr.length; i++) {
      const erc721template = new chainObj.web3.eth.Contract(template721.abi, erc721arr[i]);
      const owner = await erc721template.methods.ownerAddress().call({ from: address });
      if (owner.toLowerCase() === address.toLowerCase()) { continue; }
      const name = await erc721template.methods.name().call({ from: address });
      const symbol = await erc721template.methods.symbol().call({ from: address });
      const tokenURI = await erc721template.methods.getTokenUri().call({ from: address });
      const erc20arr = await chainObj.factory721.methods.geterc20array(erc721arr[i]).call({ from: address });
      const dataToken = await Promise.all(erc20arr.map(async (erc20) => {
        const erc20template = new chainObj.web3.eth.Contract(template20.abi, erc20);
        const balance = await erc20template.methods.balanceOf(address).call({ from: address });
        if (balance > 0) { return true; }
      }))
      const dataTokenFiltered = dataToken.filter((datatoken) => datatoken !== undefined);
      if (dataTokenFiltered.length > 0) {
        nft_DataLicenses.push({ name, symbol, tokenURI, address: erc721arr[i] })
      }
    }
    return nft_DataLicenses;
  } catch (err) {
    throw new Error(`Error getting datasets for which you have purchased a license.`);
  }
}

export const getPurchasedLicenses = async (address, nftAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const erc721arr = await chainObj.factory721.methods.geterc721array().call({ from: address })
      if (erc721arr.indexOf(nftAddress) === -1) {
        reject(new Error('The nftAddress provided is not a valid address.'));
      }
      const erc20arr = await chainObj.factory721.methods.geterc20array(nftAddress).call({ from: address });
      const dataToken = await Promise.all(erc20arr.map(async (erc20) => {
        const erc20template = new chainObj.web3.eth.Contract(template20.abi, erc20);
        const balance = await erc20template.methods.balanceOf(address).call({ from: address });
        if (parseInt(balance) > 0) {
          const name = await erc20template.methods.name().call({ from: address });
          const symbol = await erc20template.methods.symbol().call({ from: address });
          const type = await erc20template.methods.getlicenseType().call({ from: address });
          if (type === "period") {
            const periodMonth = await erc20template.methods.getLicensePeriod().call({ from: address });
            const periodInt = parseInt(periodMonth);
            const startLicense = await erc20template.methods.getStartLicenseDate(address).call({ from: address });
            const startDate = new Date(parseInt(startLicense) * 1000)
            const endDate = new Date(startDate)
            endDate.setMonth(startDate.getMonth() + parseInt(periodMonth))
            const formattedStartDate = startDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
            const formattedEndDate = endDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
            return { name, symbol, type, period: periodInt, startDate: formattedStartDate, endDate: formattedEndDate, balance: parseInt(balance), address: erc20 }
          }
          return { name, symbol, type, balance: parseInt(balance), address: erc20 }
        }
      }));
      const dataTokenFiltered = dataToken.filter((datatoken) => datatoken !== undefined)
      resolve(dataTokenFiltered);
    } catch (err) {
      reject(new Error(`Error getting purchased licenses.`));
    }
  });
}

export const consumeNFT = async (address, nftAddress, licenseAddress) => {
  try {
    const erc721 = new chainObj.web3.eth.Contract(template721.abi, nftAddress)
    const erc20 = new chainObj.web3.eth.Contract(template20.abi, licenseAddress)
    const owner = await erc721.methods.ownerAddress().call({ from: address });
    const allowanceOwner = await erc20.methods.allowance(owner, nftAddress).call({ from: address });
    const allowanceConsumer = await erc20.methods.allowance(address, nftAddress).call({ from: address });
    if (parseInt(allowanceConsumer) === 0) {
      await erc20.methods.approve(nftAddress, 1).send({ from: address, gas: 5000000, gasPrice: '10000000000' })
    }
    if (parseInt(allowanceOwner) === 0) {
      await erc20.methods.approve(nftAddress, 1).send({ from: owner, gas: 5000000, gasPrice: '10000000000' })
    }
    await erc721.methods.requestConsumeNFT(licenseAddress).send({ from: address, gas: 5000000, gasPrice: '10000000000' })
  } catch (err) {
    throw new Error(`Error consuming the selected NFT.`);
  }
}