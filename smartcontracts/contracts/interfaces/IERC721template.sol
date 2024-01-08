// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

interface IERC721template {

    event TokenURIUpdate(
        address indexed updatedBy,
        string tokenURI,
        uint256 tokenID,
        uint256 timestamp,
        uint256 blockNumber
    );

    event licenseERC20Created(
        string nameT,
        string symbolT,
        address owner,
        uint256 cap,
        string licenseType,
        uint256 price,
        address licenseErc20
    );
    event nftConsumedPeriod(
        bool result,
        address nft,
        uint startDate,
        uint todayDate
    );
    event nftConsumedUsage(bool result, address nft, uint usageRemain);

    function initialize(
        address owner,
        string calldata name_,
        string calldata symbol_,
        address tokenFactory,
        string memory tokenURI,
        bool transferable_
    ) external returns (bool);

    function setTokenURI(uint256 tokenId, string memory tokenURI) external;

    function createERC20(
        string[] calldata strings,
        address[] calldata addresses,
        uint256 uints,
        string memory licenseType,
        uint256 price,
        uint256 licensePeriod
    ) external returns (address);

    function requestConsumeNFT(address licenseConsume) external returns (bool);

    function transferable() external view returns(bool);

    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function isInitialized() external view returns (bool);

    function ownerAddress() external view returns (address);

    function getTokenUri() external view returns (string memory);

    function getTokensList() external view returns (address[] memory);

    function isDeployed(address datatoken) external view returns (bool);

    function getFactory() external view returns (address);

    function deleteLicense(address _erc20, address[] memory templateLicenses, address[] memory factoryLicenses) external;

    function deleteNft(address[] memory nftList) external;

    function setName(string memory _newName) external;

    function setSymbol(string memory _newSymbol) external;

    function setTransferable(bool _newTransferable) external;
}
