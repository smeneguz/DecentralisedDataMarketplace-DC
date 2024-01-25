import web3Init from './web3.core';
import template721 from '../contract/ERC721template.json';
import template20 from '../contract/ERC20template.json';

const chainObj = web3Init();

export const getPublicDatasets = async (address) => {
  try {
    const response = await chainObj.factory721.methods.geterc721array().call({ from: address })
    const NFTlist = await Promise.all(response.map(async (nftAddress) => {
      const erc721template = new chainObj.web3.eth.Contract(template721.abi, nftAddress);
      const transferable = await erc721template.methods.transferable().call({ from: address });
      const ownerAddress = await erc721template.methods.ownerAddress().call({ from: address });
      if (transferable && (address.toLowerCase() !== ownerAddress.toLowerCase())) {
        const name = await erc721template.methods.name().call({ from: address });
        const symbol = await erc721template.methods.symbol().call({ from: address });
        const getTokenUri = await erc721template.methods.getTokenUri().call({ from: address });
        return { name, symbol, ownerAddress, getTokenUri, nftAddress }
      }
    }))
    const NFTlistFiltered = NFTlist.filter((nft) => nft !== undefined);
    return NFTlistFiltered;
  } catch (err) {
    throw new Error(`Error getting all public datasets.`);
  }
}

export const getPublicLicenses = async (address, nftAddress) => {
  try {
    const erc721template = new chainObj.web3.eth.Contract(template721.abi, nftAddress);
    const response = await erc721template.methods.getTokensList().call({ from: address })
    const licensesList = await Promise.all(response.map(async (licenseAddress) => {
      const erc20template = new chainObj.web3.eth.Contract(template20.abi, licenseAddress);
      const name = await erc20template.methods.name().call({ from: address });
      const symbol = await erc20template.methods.symbol().call({ from: address });
      const type = await erc20template.methods.getlicenseType().call({ from: address });
      const price = await erc20template.methods.price().call({ from: address });
      const priceInt = parseInt(price, 10);
      if (type === "period") {
        const period = await erc20template.methods.getLicensePeriod().call({ from: address });
        const periodInt = parseInt(period, 10);
        return { name, symbol, type, period: periodInt, price: priceInt, licenseAddress }
      } else {
        const period = 0;
        return { name, symbol, type, period, price: priceInt, licenseAddress }
      }
    }))
    return licensesList;
  } catch (err) {
    throw new Error(`Error getting public licenses.`);
  }
}

export const buyLicense = async (address, purchaseLicense) => {
  try {
    const erc20 = new chainObj.web3.eth.Contract(template20.abi, purchaseLicense.licenseAddress)
    const price = await erc20.methods.price().call({ from: address });
    const type = await erc20.methods.getlicenseType().call({ from: address });
    const erc721 = new chainObj.web3.eth.Contract(template721.abi, purchaseLicense.nftAddress)
    const nftOwner = await erc721.methods.ownerAddress().call({ from: address })
    if (type === "period") {
      await chainObj.DataCellarToken.methods.approve(await chainObj.factory721.methods.paymentManager().call({ from: address }), parseInt(price)).send({ from: address, gas: 50000, gasPrice: '10000000000' })
      await erc20.methods.approve(await chainObj.factory721.methods.paymentManager().call({ from: address }), 1).send({ from: nftOwner, gas: 50000, gasPrice: '10000000000' })
      await chainObj.factory721.methods.buyNFTlicensePeriod(purchaseLicense.nftAddress, purchaseLicense.licenseAddress).send({ from: address, gas: 5000000, gasPrice: '10000000000' })
    } else {
      const amount = parseInt(purchaseLicense.amount);
      const totalNeed = parseInt(price) * amount;
      await chainObj.DataCellarToken.methods.approve(await chainObj.factory721.methods.paymentManager().call({ from: address }), totalNeed).send({ from: address, gas: 50000, gasPrice: '10000000000' })
      await erc20.methods.approve(await chainObj.factory721.methods.paymentManager().call({ from: address }), amount).send({ from: nftOwner, gas: 50000, gasPrice: '10000000000' })
      await chainObj.factory721.methods.buyNFTlicenseUsage(purchaseLicense.nftAddress, purchaseLicense.licenseAddress, amount).send({ from: address, gas: 5000000, gasPrice: '10000000000' })
    }
  } catch (err) {
    throw new Error(`Error by acquiring license.`);
  }
}