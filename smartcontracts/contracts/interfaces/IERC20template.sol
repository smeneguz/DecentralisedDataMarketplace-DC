// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

interface IERC20template {

    event NewPaymentCollector(
        address indexed caller,
        address indexed _newPaymentCollector,
        uint256 timestamp,
        uint256 blockNumber
    );

    function initialize(
        string[] calldata strings_,
        address[] calldata addresses_,
        address erc721Address_,
        uint256 uints_,
        string calldata licenseType_,
        uint256 price_,
        uint256 licensePeriod_
    ) external returns (bool);

    function mint(address account, uint256 value) external;

    function setDateStartPolicy(
        uint256 _dateTimestamp,
        address _customer
    ) external;

    function balanceOf(address owner) external view returns (uint256);

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function price() external view returns (uint);

    function getlicenseType() external view returns (string memory);

    function getERC721Address() external view returns (address);

    function getLicensePeriod() external view returns (uint256);

    function getStartLicenseDate(
        address _customer
    ) external view returns (uint256);

    function deleteLicense(address _erc721, address[] memory templateLicenses, address[] memory factoryLicenses) external;

    function cap() external view returns (uint256);

    function isInitialized() external view returns (bool);

    function setName(string memory _newName) external;

    function setSymbol(string memory _newSymbol) external;

    function setPrice(uint256 _newPrice) external;

    function setPeriod(uint256 _newPeriod) external;

    function setCap(uint256 _newCap) external;
}