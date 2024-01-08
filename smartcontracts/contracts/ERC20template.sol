// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IERC721template.sol";

contract ERC20template is
    ERC20("test", "testSymbol"),
    ERC20Burnable,
    ReentrancyGuard
{
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    string private _name;
    string private _symbol;
    uint256 private _cap;
    uint8 private constant _decimals = 18;
    bool private initialized = false;
    address private _erc721Address;
    address private paymentCollector;
    string private _licenseType;
    uint256 private _price;
    uint256 private _licensePeriod; //questo valore è un numero intero e rappresenta i mesi

    uint256 public constant BASE = 1e18;

    mapping(address => uint256) public nonces;
    mapping(address => bool) private _minter;
    mapping(address => uint256) private _userStartPolicy;

    constructor() {}

    event NewPaymentCollector(
        address indexed caller,
        address indexed _newPaymentCollector,
        uint256 timestamp,
        uint256 blockNumber
    );

    modifier onlyNotInitialized() {
        require(
            !initialized,
            "ERC20Template: token instance already initialized"
        );
        _;
    }

    /**
     * @dev initialize
     *      Called prior contract initialization (e.g creating new Datatoken instance)
     *      Calls private _initialize function. Only if contract is not initialized.
     * @param strings_ refers to an array of strings
     *                      [0] = name token
     *                      [1] = symbol
     * @param addresses_ refers to an array of addresses passed by user
     *                     [0]  = minter account who can mint datatokens (can have multiple minters)
     *                     [1]  = paymentCollector  initial paymentCollector  for this DT
     *                     [2]  = publishing Market Address
     *                     [3]  = publishing Market Fee Token
     * @param erc721Address_ refers to an array of addresses passed by the factory = erc721Address
     *
     * @param licenseType_ refers to license type => "period" or "usage"
     * @param price_ refers to price of tyhe license associated to a NFT
     * @param uints_  refers to cap_ the total ERC20 cap
     *                     Currently not used, usefull for future templates
     */
    function initialize(
        string[] calldata strings_,
        address[] calldata addresses_,
        address erc721Address_,
        uint256 uints_,
        string calldata licenseType_,
        uint256 price_,
        uint256 licensePeriod_
    ) external onlyNotInitialized returns (bool) {
        return
            _initialize(
                strings_,
                addresses_,
                erc721Address_,
                uints_,
                licenseType_,
                price_,
                licensePeriod_
            );
    }

    /**
     * @dev _initialize
     *      Private function called on contract initialization.
     * @param strings_ refers to an array of strings
     *                      [0] = name token
     *                      [1] = symbol
     * @param addresses_ refers to an array of addresses passed by user
     *                     [0]  = minter account who can mint datatokens (can have multiple minters)
     *                     [1]  = paymentCollector  initial paymentCollector  for this DT
     *                     [2]  = publishing Market Address
     * @param erc721Address_ refers to an array of addresses passed by the factory = erc721Address
     * @param uints_  refers to cap_ the total ERC20 cap
     * @param licenseType_ refers to license type => "period" or "usage"
     * @param price_ refers to price of tyhe license associated to a NFT
     * param bytes_  refers to an array of bytes
     *                     Currently not used, usefull for future templates
     */
    function _initialize(
        string[] memory strings_,
        address[] memory addresses_,
        address erc721Address_,
        uint256 uints_,
        string calldata licenseType_,
        uint256 price_,
        uint256 licensePeriod_
    ) private returns (bool) {
        address erc721Address = erc721Address_;
        require(
            erc721Address != address(0),
            "ERC20Template: Invalid minter,  zero address"
        );

        // require(uints_ != 0, "DatatokenTemplate: Invalid cap value");
        // _cap = uints_;
        _cap = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
        _name = strings_[0];
        _symbol = strings_[1];
        _licenseType = licenseType_;
        _erc721Address = erc721Address;
        _price = price_;
        _licensePeriod = licensePeriod_;
        initialized = true;
        // add a default minter, similar to what happens with manager in the 721 contract
        //in ocean they use a specific contract for this. Not necessary at the moment for this version
        _minter[addresses_[0]] = true;
        if (addresses_[1] != address(0)) {
            _setPaymentCollector(addresses_[1]);
            emit NewPaymentCollector(
                msg.sender,
                addresses_[1],
                block.timestamp,
                block.number
            );
        }
        _mint(addresses_[0], _cap - 1);
        return initialized;
    }

    function _setPaymentCollector(address _newPaymentCollector) internal {
        paymentCollector = _newPaymentCollector;
    }

    /**
     * @dev mint
     *      Only the minter address can call it.
     *      msg.value should be higher than zero and gt or eq minting fee
     * @param account refers to an address that token is going to be minted to.
     * @param value refers to amount of tokens that is going to be minted.
     */
    function mint(address account, uint256 value) external {
        require(_minter[msg.sender] == true, "ERC20Template: NOT MINTER");
        require(
            totalSupply().add(value) <= _cap,
            "DatatokenTemplate: cap exceeded"
        );
        _mint(account, value);
    }

    function setDateStartPolicy(
        uint256 _dateTimestamp,
        address _customer
    ) external {
        _userStartPolicy[_customer] = _dateTimestamp;
    }

    /**
     * @dev name
     *      It returns the token name.
     * @return Datatoken name.
     */
    function name() public view override returns (string memory) {
        return _name;
    }

    /**
     * @dev symbol
     *      It returns the token symbol.
     * @return Datatoken symbol.
     */
    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    /**
     * @dev price
     *      It returns the license price.
     * @return Datatoken price.
     */
    function price() public view returns (uint) {
        return _price;
    }

    function getlicenseType() public view returns (string memory) {
        return _licenseType;
    }

    /**
     * @dev getERC721Address
     *      It returns the parent ERC721
     * @return ERC721 address.
     */
    function getERC721Address() public view returns (address) {
        return _erc721Address;
    }

    function getLicensePeriod() public view returns (uint256) {
        return _licensePeriod;
    }

    function getStartLicenseDate(
        address _customer
    ) external view returns (uint256) {
        return _userStartPolicy[_customer];
    }


    function deleteLicense(address _erc721, address[] memory templateLicenses, address[] memory factoryLicenses) external {
        require(_minter[msg.sender] == true, "DL1"); //può chiamarla solo l'owner della licenza
        IERC721template erc721template = IERC721template(payable(_erc721));
        erc721template.deleteLicense(address(this), templateLicenses, factoryLicenses);
        selfdestruct(payable(msg.sender));
    }

    /**
     * @dev cap
     *      it returns the capital.
     * @return Datatoken cap.
     */
    function cap() external view returns (uint256) {
        return _cap;
    }

    /**
     * @dev isInitialized
     *      It checks whether the contract is initialized.
     * @return true if the contract is initialized.
     */

    function isInitialized() external view returns (bool) {
        return initialized;
    }

    function setName(string memory _newName) external {
        require(_minter[msg.sender] == true, "ERC20template: not the owner!");
        _name = _newName;
    }

    function setSymbol(string memory _newSymbol) external {
        require(_minter[msg.sender] == true, "ERC20template: not the owner!");
        _symbol = _newSymbol;
    }

    function setPrice(uint256 _newPrice) external {
        require(_minter[msg.sender] == true, "ERC20template: not the owner!");
        _price = _newPrice;
    }

    function setPeriod(uint256 _newPeriod) external {
        require(_minter[msg.sender] == true, "ERC20template: not the owner!");
        require(keccak256(abi.encodePacked(_licenseType)) == keccak256(abi.encodePacked("period")), "ERC20template: not periodic license");
        require(_newPeriod > 0, "ERC20template: 0 is not valid value");
        _licensePeriod = _newPeriod;
    }

    function setCap(uint256 _newCap) external {
        require(_minter[msg.sender] == true, "ERC20template: not the owner!");
        require( totalSupply() <= _newCap, "ERC20template: cap is too low");
        _cap = _newCap;
    }

    /**
     * @dev fallback function
     *      this is a default fallback function in which receives
     *      the collected ether.
     */
    fallback() external payable {}

    /**
     * @dev receive function
     *      this is a default receive function in which receives
     *      the collected ether.
     */
    receive() external payable {}
}
