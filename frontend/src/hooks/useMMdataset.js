import web3Init from './we3.core';
import template721 from '../contract/ERC721template.json';

const chainObj = web3Init();


export const createDataset = async (address, name, symbol, tokenURI, transferable) => {
  try {
    await chainObj.factory721.methods.ERC721deploy(name, symbol, 1, tokenURI, transferable).send({ from: address, gas: 5000000, gasPrice: '10000000000' })
  } catch (err) {
    throw new Error(`Error creating the new dataset.`);
  }
}

export const getOwnDatasets = async (address) => {
  try {
    const response = await chainObj.factory721.methods.geterc721array().call({ from: address })
    const NFTlist = await Promise.all(response.map(async (nftAddress) => {
      const erc721template = new chainObj.web3.eth.Contract(template721.abi, nftAddress);
      const ownerAddress = await erc721template.methods.ownerAddress().call({ from: address });
      if (address.toLowerCase() === ownerAddress.toLowerCase()) {
        const name = await erc721template.methods.name().call({ from: address });
        const symbol = await erc721template.methods.symbol().call({ from: address });
        const getTokenUri = await erc721template.methods.getTokenUri().call({ from: address });
        const transferable = await erc721template.methods.transferable().call({ from: address });
        return { nftAddress, name, symbol, getTokenUri, transferable }
      }
    }))
    const NFTlistFiltered = NFTlist.filter((nft) => nft !== undefined);
    return NFTlistFiltered;
  } catch (err) {
    throw new Error(`Error getting your own datasets.`);
  }
}

export const deleteDataset = async (address, nftAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const erc721 = new chainObj.web3.eth.Contract(template721.abi, nftAddress)
      let nftList = await chainObj.factory721.methods.geterc721array().call({ from: address });
      const index = nftList.indexOf(nftAddress);
      const newNftList = nftList.filter((item, i) => { if (index !== i) { return item } else { return undefined } });
      const NFTlistFiltered = newNftList.filter((nft) => nft !== undefined);
      const deployedLicenses = await erc721.methods.getTokensList().call({ from: address });
      if (deployedLicenses.length > 0) {
        reject(new Error("There are still some licenses associated with this dataset."));
      } else {
        await erc721.methods.deleteNft(NFTlistFiltered).send({ from: address, gas: 5000000, gasPrice: '10000000000' });
        resolve();
      }
    } catch (err) {
      reject(new Error(`Error deleting the dataset.`));
    }
  });
}

export const updateDataset = async (address, nftAddress, updateData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const erc721 = new chainObj.web3.eth.Contract(template721.abi, nftAddress);
      const owner = await erc721.methods.ownerAddress().call({ from: address });
      if (owner.toLowerCase() !== address.toLowerCase()) {
        reject(new Error("You are not the owner of the dataset"));
      } else {
        const propertyToFunctionMap = {
          name: async (value) => {
            await erc721.methods.setName(value).send({ from: address, gas: 50000, gasPrice: '10000000000' });
          },
          symbol: async (value) => {
            await erc721.methods.setSymbol(value).send({ from: address, gas: 50000, gasPrice: '10000000000' });
          },
          tokenURI: async (value) => {
            await erc721.methods.setTokenURI(1, value).send({ from: address, gas: 50000, gasPrice: '10000000000' });
          },
          transferable: async (value) => {
            await erc721.methods.setTransferable(value).send({ from: address, gas: 50000, gasPrice: '10000000000' })
          }
        }
        for (const key in updateData) {
          await propertyToFunctionMap[key](updateData[key]);
        }
        resolve();
      }

    } catch (err) {
      reject(new Error(`Error updating the dataset.`));
    }
  });
}
