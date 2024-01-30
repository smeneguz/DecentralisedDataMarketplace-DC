import web3Init from './web3.core';
import template721 from '../contract/ERC721template.json';
import template20 from '../contract/ERC20template.json';

const chainObj = web3Init();

export const createLicense = async (address, NFTaddress, name, symbol, type, period, price, cap) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await chainObj.factory721.methods.geterc721array().call({ from: address })
      const NFTlist = await Promise.all(response.map(async (nftAddress) => {
        const erc721template = new chainObj.web3.eth.Contract(template721.abi, nftAddress);
        const transferable = await erc721template.methods.transferable().call({ from: address });
        const ownerAddress = await erc721template.methods.ownerAddress().call({ from: address });
        if ((address.toLowerCase() === ownerAddress.toLowerCase()) && transferable) {
          const nameDataset = await erc721template.methods.name().call({ from: address });
          const modifiedName = `${nameDataset}_${name}`;
          const symbolDataset = await erc721template.methods.symbol().call({ from: address });
          const modifiedSymbol = `${symbolDataset}_${symbol}`;
          return { nftAddress, name: modifiedName, symbol: modifiedSymbol }
        }
      }))
      const NFTlistFiltered = NFTlist.filter((nft) => nft !== undefined);
      const NFTfound = NFTlistFiltered.find(nft => nft && nft.nftAddress.toLowerCase() === NFTaddress.toLowerCase());
      if (NFTfound) {
        const erc721 = new chainObj.web3.eth.Contract(template721.abi, NFTaddress)
        if (type === "1") {
          await erc721.methods.createERC20(1, [NFTfound.name, NFTfound.symbol], [address, address, address], cap, "usage", price, 0).send({ from: address, gas: 5000000, gasPrice: '10000000000' });
        } else {
          await erc721.methods.createERC20(1, [NFTfound.name, NFTfound.symbol], [address, address, address], cap, "period", price, period).send({ from: address, gas: 5000000, gasPrice: '10000000000' });
        }
        resolve();
      } else {
        reject(new Error(`The reference dataset was not found among your datasets or is not transferable.`));
      }
    } catch (err) {
      reject(new Error(`Error creating the new license.`));
    }
  }
  );
}

export const getOwnLicenses = async (address, nftAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const erc721contract = new chainObj.web3.eth.Contract(template721.abi, nftAddress);
      const owner = await erc721contract.methods.ownerAddress().call();
      if (owner.toLowerCase() !== address.toLowerCase()) {
        reject(Error("You are not the owner of the dataset"));
      } else {
        const licensesList = await chainObj.factory721.methods.geterc20array(nftAddress).call({ from: address });
        const erc20list = await Promise.all(licensesList.map(async (erc20) => {
          const erc20template = new chainObj.web3.eth.Contract(template20.abi, erc20);
          const name = await erc20template.methods.name().call({ from: address });
          const symbol = await erc20template.methods.symbol().call({ from: address });
          const type = await erc20template.methods.getlicenseType().call({ from: address });
          const price = await erc20template.methods.price().call({ from: address });
          const priceInt = parseInt(price, 10);
          if (type === "period") {
            const periodMonth = await erc20template.methods.getLicensePeriod().call({ from: address });
            const periodInt = parseInt(periodMonth, 10);
            return { address: erc20, name, symbol, type, period: periodInt, price: priceInt }
          } else {
            const periodMonth = 0;
            return { address: erc20, name, symbol, type, period: periodMonth, price: priceInt }
          }
        }))
        const erc20listFiltered = erc20list.filter((erc20) => erc20 !== undefined);
        resolve(erc20listFiltered);
      }

    } catch (err) {
      reject(new Error(`Error getting your own licenses.`));
    }
  });
}

export const deleteLicense = async (address, nftAddress, licenseAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const erc721 = new chainObj.web3.eth.Contract(template721.abi, nftAddress)
      const existLicense = await erc721.methods.isDeployed(licenseAddress).call({ from: address });
      if (existLicense === false) {
        reject(new Error("License address doesn't match with nft address"));
      } else {
        const erc20 = new chainObj.web3.eth.Contract(template20.abi, licenseAddress);
        let erc20ArrayFrom721Template = await erc721.methods.getTokensList().call({ from: address });
        let erc20ArrayFromFactory = await chainObj.factory721.methods.geterc20array(nftAddress).call({ from: address });
        const indexFromFactory = erc20ArrayFromFactory.indexOf(licenseAddress);
        const indexFrom721Template = erc20ArrayFrom721Template.indexOf(licenseAddress);
        if (indexFromFactory === -1 || indexFrom721Template === -1) {
          reject(new Error("License not found."));
        } else {
          const newErc20ArrayFrom721Template = erc20ArrayFrom721Template.filter((item, i) => {
            return i !== indexFrom721Template;
          })
          const newErc20ArrayFromFactory = erc20ArrayFromFactory.filter((item, i) => {
            return i !== indexFrom721Template;
          })
          await erc20.methods.deleteLicense(nftAddress, newErc20ArrayFrom721Template, newErc20ArrayFromFactory).send({ from: address, gas: 5000000, gasPrice: '10000000000' })
          resolve();
        }
      }
    } catch (err) {
      reject(new Error(`Error deleting the dataset.`));
    }
  });
}

export const updateLicense = async (address, nftAddress, licenseAddress, updateDataLicense) => {
  return new Promise(async (resolve, reject) => {
    try {
      const erc20 = new chainObj.web3.eth.Contract(template20.abi, licenseAddress);
      const erc721address = await erc20.methods.getERC721Address().call({ from: address })
      if (erc721address.toLowerCase() !== nftAddress.toLowerCase()) {
        reject(new Error("License not associated to " + nftAddress + " nft address"));
      }
      const propertyToFunctionMap = {
        name: async (value) => {
          await erc20.methods.setName(value).send({ from: address, gas: 50000, gasPrice: '10000000000' });
        },
        symbol: async (value) => {
          await erc20.methods.setSymbol(value).send({ from: address, gas: 50000, gasPrice: '10000000000' });
        },
        price: async (value) => {
          await erc20.methods.setPrice(value).send({ from: address, gas: 50000, gasPrice: '10000000000' });
        },
        cap: async (value) => {
          await erc20.methods.setCap(value).send({ from: address, gas: 50000, gasPrice: '10000000000' });
        },
        period: async (value) => {
          await erc20.methods.setPeriod(value).send({ from: address, gas: 50000, gasPrice: '10000000000' });
        }
      }
      for (const key in updateDataLicense) {
        await propertyToFunctionMap[key](updateDataLicense[key]);
      }
      resolve();
    } catch (err) {
      reject(new Error(`Error updating the license.`));
    }
  });
}