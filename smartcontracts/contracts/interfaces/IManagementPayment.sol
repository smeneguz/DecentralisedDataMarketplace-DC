// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

interface IManagementPayment {

    event NFTBoughtPeriodFinalized(
        string tokenName,
        address indexed admin,
        string symbol,
        string tokenURI,
        uint256 dateStartLicense
    );

    event NFTBoughtUsageFinalized(
        string tokenName,
        address indexed admin,
        string symbol,
        string tokenURI,
        uint256 usage
    );

    function paymentLicensePeriod(
        address _nft,
        address _erc20license,
        address _buyer
    ) external returns (string memory name, address owner, string memory symbol, string memory uri, uint date);

    function paymentLicenseUsage(
        address _nft,
        address _erc20license,
        address _buyer,
        uint256 _usage
    ) external returns (string memory name, address owner, string memory symbol, string memory uri, uint usage);
}