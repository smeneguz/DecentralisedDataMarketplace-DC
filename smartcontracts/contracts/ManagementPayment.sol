// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./interfaces/IERC721template.sol";
import "./interfaces/IERC20template.sol";
import "./DataCellarToken.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ManagementPayment {
    using SafeMath for uint256;
    DataCellarToken public datacellarToken;

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

    constructor(address payable _datacellarToken) {
        datacellarToken = DataCellarToken(_datacellarToken);
    }

    function paymentLicensePeriod(
        address _nft,
        address _erc20license,
        address _buyer
    )
        external
        returns (
            string memory name,
            address owner,
            string memory symbol,
            string memory uri,
            uint date
        )
    {
        IERC721template nft = IERC721template(_nft);
        IERC20template license = IERC20template(_erc20license);

        require(
            nft.transferable() == true,
            "FactoryERC721: ERC721template: not transferable nft"
        );
        require(
            datacellarToken.allowance(_buyer, address(this)) >= license.price(),
            "FactoryERC721: ERC20template: not enough token (allowed) to buy license"
        );
        require(
            license.allowance(nft.ownerAddress(), address(this)) >= 1,
            "ERC20Template: owner has not enough token (allowed) to release license. As owner of the nft you can mint an amount of token or allow to spend an amount from third party"
        );
        require(
            nft.ownerAddress() != _buyer,
            "ManagementPayment: You are the owner of the nft. You don't need to buy a license"
        );

        datacellarToken.transferFrom(
            _buyer,
            nft.ownerAddress(),
            license.price()
        );

        license.transferFrom(nft.ownerAddress(), _buyer, 1);
        license.setDateStartPolicy(block.timestamp, _buyer);
        emit NFTBoughtPeriodFinalized(
            nft.name(),
            nft.ownerAddress(),
            nft.symbol(),
            nft.getTokenUri(),
            license.getStartLicenseDate(msg.sender)
        );
        name = nft.name();
        owner = nft.ownerAddress();
        symbol = nft.symbol();
        uri = nft.getTokenUri();
        date = license.getStartLicenseDate(msg.sender);
    }

    function paymentLicenseUsage(
        address _nft,
        address _erc20license,
        address _buyer,
        uint256 _usage
    )
        external
        returns (
            string memory name,
            address owner,
            string memory symbol,
            string memory uri,
            uint usage
        )
    {
        IERC721template nft = IERC721template(_nft);
        IERC20template license = IERC20template(_erc20license);

        require(
            nft.transferable() == true,
            "FactoryERC721: ERC721template: not transferable nft"
        );

        require(
            datacellarToken.allowance(_buyer, address(this)) >=
                license.price().mul(_usage),
            "FactoryERC721: ERC20template: not enough token (allowed) to buy license"
        );

        require(
            _usage <= 100,
            "FactoryERC721: Too many usage requested. Maximum number is equal to 100 per time"
        );
        require(
            license.allowance(nft.ownerAddress(), address(this)) >= _usage,
            "ERC20Template: owner has not enough token to release license. As owner of the nft you can mint an amount of token"
        );
        require(
            nft.ownerAddress() != _buyer,
            "ManagementPayment: You are the owner of the nft. You don't need to buy a license"
        );

        datacellarToken.transferFrom(
            _buyer,
            nft.ownerAddress(),
            license.price().mul(_usage)
        );

        license.transferFrom(nft.ownerAddress(), _buyer, _usage);
        emit NFTBoughtUsageFinalized(
            nft.name(),
            nft.ownerAddress(),
            nft.symbol(),
            nft.getTokenUri(),
            _usage
        );
        name = nft.name();
        owner = nft.ownerAddress();
        symbol = nft.symbol();
        uri = nft.getTokenUri();
        usage = _usage;
    }
}
