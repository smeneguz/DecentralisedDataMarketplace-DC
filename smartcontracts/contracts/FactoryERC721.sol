// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./ERC721template.sol";
import "./ERC20template.sol";
import "./DataCellarToken.sol";
import "./ManagementPayment.sol";

contract FactoryERC721 {
    address private ownerF;
    uint256 private currentNFTCount;
    mapping(address => address) public erc721List;
    mapping(address => bool) public erc20List;
    DataCellarToken public datacellarToken;
    ManagementPayment public paymentManager;

    address[] public erc721array;
    mapping(address => address) public erc20listToerc721;
    mapping(address => address[]) public erc721licenses;

    modifier erc721check(address _nft) {
        require(
            erc721List[_nft] != address(0),
            "FactoryERC721: nft doesn't exist"
        );
        _;
    }
    modifier erc721toerc20check(address _erc20license, address _nft) {
        require(
            erc20listToerc721[_erc20license] == _nft,
            "FactoryERC721: license doesn't exist"
        );
        _;
    }

    constructor(address payable _datacellarToken) {
        ownerF = msg.sender;
        paymentManager = new ManagementPayment(_datacellarToken);
        datacellarToken = DataCellarToken(_datacellarToken);
    }

    function ERC721deploy(
        string calldata name_,
        string calldata symbol_,
        string memory tokenURI,
        bool transferable_
    ) external returns (address) {
        require(msg.sender != address(0));
        ERC721template NFT = new ERC721template();
        require(address(NFT) != address(0));
        erc721List[address(NFT)] = address(NFT);
        currentNFTCount += 1;
        require(
            NFT.initialize(
                msg.sender,
                name_,
                symbol_,
                address(this),
                tokenURI,
                transferable_
            )
        );
        erc721array.push(address(NFT));
        return address(NFT);
    }

    function deleteLicense(address _erc20, address _erc721, address[] memory licenses) external {
        require(msg.sender == _erc721);
        erc20List[_erc20] = false;
        erc20listToerc721[_erc20] = address(0);
        erc721licenses[_erc721] = licenses;
    }

    function deleteNFT(address _erc721, address[] memory nftList) external {
        require(erc721licenses[_erc721].length == 0);
        erc721List[_erc721] = address(0);
        erc721array = nftList;
    }

    function geterc721array() external view returns (address[] memory) {
        return erc721array;
    }

    function geterc20array(address _erc721Addr) external view returns (address [] memory){
        return erc721licenses[_erc721Addr];
    }

    struct tokenStruct {
        string[] strings;
        address[] addresses;
        uint256 uints;
        string licenseType;
        uint256 price;
        uint256 licensePeriod;
        address owner;
    }

    function createToken(
        string[] memory strings,
        address[] memory addresses,
        uint256 uints,
        string memory licenseType,
        uint256 price,
        uint256 licensePeriod
    ) external returns (address token) {
        require(erc721List[msg.sender] == msg.sender);
        token = _createToken(
            strings,
            addresses,
            uints,
            licenseType,
            price,
            licensePeriod,
            msg.sender
        );
        return token;
    }

    function _createToken(
        string[] memory strings,
        address[] memory addresses,
        uint256 uints,
        string memory licenseType,
        uint256 price,
        uint256 licensePeriod,
        address owner
    ) internal returns (address) {
        require(uints != 0);
        ERC20template erc20contract = new ERC20template();

        erc20List[address(erc20contract)] = true;
        erc20listToerc721[address(erc20contract)] = owner;
        erc721licenses[owner].push(address(erc20contract));

        require(address(erc20contract) != address(0));
        tokenStruct memory tokenData = tokenStruct(
            strings,
            addresses,
            uints,
            licenseType,
            price,
            licensePeriod,
            owner
        );
        
        require(
            erc20contract.initialize(
                tokenData.strings,
                tokenData.addresses,
                msg.sender,
                tokenData.uints,
                tokenData.licenseType,
                tokenData.price,
                tokenData.licensePeriod
            )
        );
        return address(erc20contract);
    }

    function buyNFTlicensePeriod(
        address _nft,
        address _erc20license
    ) external erc721check(_nft) erc721toerc20check(_erc20license, _nft) {
        paymentManager.paymentLicensePeriod(
                _nft,
                _erc20license,
                msg.sender
            );
    }

    function buyNFTlicenseUsage(
        address _nft,
        address _erc20license,
        uint256 _usage
    ) external erc721check(_nft) erc721toerc20check(_erc20license, _nft) {
        paymentManager.paymentLicenseUsage(
                _nft,
                _erc20license,
                msg.sender,
                _usage
            );
    }
}
