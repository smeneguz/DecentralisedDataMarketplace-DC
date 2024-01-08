// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

interface IFactoryERC721 {

    event Template721Added(address indexed _templateAddress, uint256 indexed nftTemplateCount);
    event Template20Added(address indexed _templateAddress, uint256 indexed nftTemplateCount);

    event TokenCreated(
        address indexed newTokenAddress,
        string name,
        string symbol,
        uint256 cap,
        string licenseType,
        address creator,
        address indexed templateAddress
    );

    event createERC721(
        address newTokenAddress,
        string tokenName,
        address indexed admin,
        string symbol,
        string tokenURI,
        bool transferable,
        address indexed templateAddress
    );

    event licenseUsageBought(
        string tokenName,
        address indexed admin,
        string symbol,
        string tokenURI,
        uint256 usage
    );

    event licensePeriodBought(
        string tokenName,
        address indexed admin,
        string symbol,
        string tokenURI,
        uint256 dateStartLicense
    );

    function ERC721deploy(
        string calldata name_,
        string calldata symbol_,
        uint256 _templateIndex,
        string memory tokenURI,
        bool transferable_
    ) external returns (address);

    function deleteLicense(address _erc20, address _erc721, address[] memory licenses) external;
    
    function deleteNFT(address _erc721, address[] memory nftList) external;

    function geterc721array() external view returns (address[] memory);

    function geterc20array(address _erc721Addr) external view returns (address [] memory);

    function createToken(
        uint256 _templateIndex,
        string[] memory strings,
        address[] memory addresses,
        uint256 uints,
        string memory licenseType,
        uint256 price,
        uint256 licensePeriod
    ) external returns (address token);

    function buyNFTlicensePeriod(
        address _nft,
        address _erc20license
    ) external;

    function buyNFTlicenseUsage(
        address _nft,
        address _erc20license,
        uint256 _usage
    ) external;

    /**
     * @dev add a new NFT Template.
      Only Factory Owner can call it
     * @param _templateAddress new template address
     * @return the actual template count
     */
    
    function add721TokenTemplate(address _templateAddress)
        external
        returns (uint256);

    function add20TokenTemplate(address _templateAddress)
        external
        returns (uint256);

    function reactivate721TokenTemplate(uint256 _index) external;

    function disable721TokenTemplate(uint256 _index) external;
}