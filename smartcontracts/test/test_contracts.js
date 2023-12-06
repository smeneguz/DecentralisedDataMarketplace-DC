const FactoryERC721 = artifacts.require("FactoryERC721");
const DataCellarToken = artifacts.require("DataCellarToken");
const ERC721templateABI = require("../build/contracts/ERC721template.json");
const ERC20templateABI = require("../build/contracts/ERC20template.json");
const dataCellarTokenABI = require("../build/contracts/DataCellarToken.json");
const managementPaymentABI = require("../build/contracts/ManagementPayment.json");
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
let factoryContract = "";

contract("DataCellarToken", function (accounts) {
  const owner = accounts[0];
  const customer = accounts[1];
  it("contract deploy", async function () {
    let contract = await DataCellarToken.deployed({ from: owner });
    return assert.isTrue(contract.constructor.isDeployed());
  });
  it("convert ETH to DATACELL", async function () {
    let contract = await DataCellarToken.deployed({ from: owner });
    await contract.convertEtherToTokens({
      from: customer,
      value: web3.utils.toWei("1", "ether"),
    });
    let dataCellarToken = await contract.balanceOf(customer);
    //console.log(dataCellarToken.toString());
    return assert.equal(dataCellarToken.toString(), "200");
  });
  it("mint coin by the not the owner", async function () {
    let contract = await DataCellarToken.deployed({ from: owner });
    try {
      await contract.mint(customer, 10000, { from: customer });
      assert.fail("I have minted DATACELL but I'm not the contract owner");
    } catch (err) {
      assert.isTrue(err.message.includes("caller is not the owner"));
    }
    //return assert.isTrue(true);
  });
  it("mint coin by the the owner", async function () {
    let contract = await DataCellarToken.deployed({ from: owner });
    try {
      await contract.mint(customer, 10000);
      const balance = await contract.balanceOf(customer);
      assert.equal(balance.toString(), "10200");
    } catch (err) {
      assert.fail("DATACELL token not minted");
    }
    //return assert.isTrue(true);
  });
});

contract("FactoryERC721", function (accounts) {
  const owner = accounts[0];
  const customer = accounts[1];
  const secondcustomer = accounts[2];
  it("contract deploy", async function () {
    let contract = await FactoryERC721.deployed();
    return assert.isTrue(contract.constructor.isDeployed());
  });
  it("Create ERC721template (NFT)", async function () {
    let contract = await FactoryERC721.deployed({ from: owner });
    let nftCreation = await contract.ERC721deploy(
      "First NFT",
      "ex1",
      "http://primotoken.com",
      true,
      { from: customer }
    );
    //console.log(nftCreation.logs[0].args); //NFT inside
    assert.equal(await contract.getCurrentNFTCount(), 1);
    //console.log(await contract.erc721array(1));
    const erc721array = await contract.geterc721array();
    assert.equal(erc721array.length, 1); //check length of erc721 array
    assert.equal(erc721array[0], nftCreation.logs[0].args.newTokenAddress); //check the owner of the nft
    assert.equal(nftCreation.logs[0].args.admin, customer);
    return assert.equal(nftCreation.logs[0].event, "createERC721"); //check release of the right event
  });
  it("New NFT license PERIOD through ERC721template contract", async function () {
    factoryContract = await checknewperiodlicense(
      owner,
      customer,
      secondcustomer
    );
  });
  it("Buy NFT license PERIOD", async function () {
    //customer buys second nft of secondcustomer
    factoryContract = factoryContract.contract;
    const nft = await factoryContract.erc721array.call(1); //(array index)
    const license = await factoryContract.erc721licenses.call(nft, 0); //(mapping key, index array of value)
    //customer buys dataCellarToken to buy nft of secondcustomer
    const dataCellarTokenAddress = await factoryContract.datacellarToken.call(); //address of datacellartoken contract
    const dataCellarTokenContract = new web3.eth.Contract(
      dataCellarTokenABI.abi,
      dataCellarTokenAddress
    );
    const licenseContract = new web3.eth.Contract(
      ERC20templateABI.abi,
      license
    );
    //convert ether to DataCellarToken
    await dataCellarTokenContract.methods.convertEtherToTokens().send({
      from: customer,
      value: web3.utils.toWei("10", "ether"),
      gas: 20000000,
    });
    const balance = await dataCellarTokenContract.methods
      .balanceOf(customer)
      .call();
    //check dataCellarToken balance
    assert.equal(balance.toString(), "2000");
    //customer permit third party to exchange his datacellartokens
    await dataCellarTokenContract.methods
      .approve(await factoryContract.paymentManager.call(), 200)
      .send({ from: customer, gas: 200000 });
    //secondcustomer permit third party to release license for nft bought by customer
    await licenseContract.methods
      .approve(await factoryContract.paymentManager.call(), 1)
      .send({ from: secondcustomer, gas: 200000 });
    //buy the license
    const transaction = await factoryContract.buyNFTlicensePeriod(
      nft,
      license,
      {
        from: customer,
      }
    );
    return assert.equal(transaction.logs[0].event, "NFTBoughtPeriod");
  });
  it("New NFT license USAGE through ERC721template contract", async function () {
    const nft = await factoryContract.erc721array.call(1);
    const erc721templateContract = new web3.eth.Contract(
      ERC721templateABI.abi,
      nft
    );
    const token = await erc721templateContract.methods
      .createERC20(
        ["secondToken", "ST"],
        [secondcustomer, secondcustomer, secondcustomer],
        1000000000000000,
        "usage",
        5
      )
      .send({ from: secondcustomer, gas: 20000000 });
    const license = await factoryContract.erc721licenses.call(nft, 1);
    const erc20templateContract = new web3.eth.Contract(
      ERC20templateABI.abi,
      license
    );
    assert.isTrue(await erc20templateContract.methods.isInitialized().call());
    assert.equal(
      await erc20templateContract.methods.name().call(),
      "secondToken"
    );
    assert.equal(await erc20templateContract.methods.symbol().call(), "ST");
    assert.equal(await erc20templateContract.methods.price().call(), 5);
  });
  it("Buy NFT license USAGE", async function () {
    const nft = await factoryContract.erc721array.call(1); //(array index)
    const license = await factoryContract.erc721licenses.call(nft, 1); //(mapping key, index array of value)
    const usageNumber = 10; //number of time customer want to use the nft (10 time usage)
    //customer buys dataCellarToken to buy nft of secondcustomer
    const dataCellarTokenAddress = await factoryContract.datacellarToken.call(); //address of datacellartoken contract
    const dataCellarTokenContract = new web3.eth.Contract(
      dataCellarTokenABI.abi,
      dataCellarTokenAddress
    );
    const licenseContract = new web3.eth.Contract(
      ERC20templateABI.abi,
      license
    );
    //convert ether to DataCellarToken
    const balance = await dataCellarTokenContract.methods
      .balanceOf(customer)
      .call();
    //check dataCellarToken balance
    assert.equal(balance.toString(), "1800"); //this because customer bought license at 200 DCT in previous test
    //customer permit third party to exchange his datacellartokens
    await dataCellarTokenContract.methods
      .approve(await factoryContract.paymentManager.call(), usageNumber * 5) //usageNumber*5 --> total amount of money necessary to buy the token (5 per unit)
      .send({ from: customer, gas: 200000 });
    //secondcustomer permit third party to release license for nft bought by customer
    await licenseContract.methods
      .approve(await factoryContract.paymentManager.call(), usageNumber)
      .send({ from: secondcustomer, gas: 200000 });
    //buy the license
    const transaction = await factoryContract.buyNFTlicenseUsage(
      nft,
      license,
      usageNumber,
      {
        from: customer,
      }
    );
    return assert.equal(transaction.logs[0].event, "NFTBoughtUsage");
  });
  it("check consume NFT with period license", async function () {
    const nft = await factoryContract.erc721array.call(1); //(array index)
    const license = await factoryContract.erc721licenses.call(nft, 0);
    const erc721templateContract = new web3.eth.Contract(
      ERC721templateABI.abi,
      nft
    );
    //check license exists
    assert.equal(
      await erc721templateContract.methods.isDeployed(license).call(),
      true
    );
    const res = await erc721templateContract.methods
      .requestConsumeNFT(license)
      .send({ from: customer, gas: 2000000 });
    return assert.equal(res.events.nftConsumedPeriod.returnValues.result, true);
  });
});

async function checknewperiodlicense(owner, customer, secondcustomer) {
  let contract = await FactoryERC721.deployed({ from: owner });
  await contract.ERC721deploy(
    "Second NFT",
    "ex2",
    "http://secondotoken.com",
    true,
    { from: secondcustomer }
  );
  assert.equal(await contract.getCurrentNFTCount(), 2);
  const erc721array = await contract.geterc721array();
  //take the instance of the deployed erc721template through the address and the abi created by the solc
  const erc721templateContract = new web3.eth.Contract(
    ERC721templateABI.abi,
    erc721array[1]
  );
  //console.log(erc721templateContract);
  assert.isTrue(await erc721templateContract.methods.isInitialized().call());
  assert.equal(
    await erc721templateContract.methods.name().call(),
    "Second NFT"
  );
  assert.equal(await erc721templateContract.methods.symbol().call(), "ex2");
  assert.equal(
    await erc721templateContract.methods.ownerAddress().call(),
    secondcustomer
  );
  assert.equal(
    await erc721templateContract.methods.getTokenUri().call(),
    "http://secondotoken.com"
  );
  const token = await erc721templateContract.methods
    .createERC20(
      ["firstToken", "FT"],
      [secondcustomer, secondcustomer, secondcustomer],
      1000000000000000,
      "period",
      200
    )
    .send({ from: secondcustomer, gas: 20000000 });
  const erc20list = await erc721templateContract.methods.getTokensList().call();
  assert.equal(erc20list.length, 1);
  const erc20templateContract = new web3.eth.Contract(
    ERC20templateABI.abi,
    erc20list[0].toString()
  );
  assert.isTrue(await erc20templateContract.methods.isInitialized().call());
  assert.equal(await erc20templateContract.methods.name().call(), "firstToken");
  assert.equal(await erc20templateContract.methods.symbol().call(), "FT");
  assert.equal(await erc20templateContract.methods.price().call(), 200);
  assert.equal(
    await erc20templateContract.methods.getERC721Address().call(),
    erc721array[1]
  );
  return { contract };
}
