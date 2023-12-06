// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title Data Cellar ERC20 Token Contract
 * @author Alessandro Mozzato - LINKS Foundation as Data Cellar partner
 * @dev Implementation of the Data Cellar Token.
 */

contract DataCellarToken is Ownable, ERC20Capped {
    using SafeMath for uint256;

    uint8 constant DECIMALS = 18;
    uint256 constant CAP = 1410000000;
    uint256 TOTALSUPPLY = CAP.mul(uint256(10) ** DECIMALS);
    uint256 public conversionRate;

    // keep track token holders
    address[] private accounts = new address[](0);
    mapping(address => bool) private tokenHolders;

    /**
     * @dev DataCellarToken constructor
     * @param contractOwner refers to the owner of the contract
     */
    constructor(
        address contractOwner
    ) ERC20("DataCellar Token", "DATACELL") ERC20Capped(TOTALSUPPLY) Ownable() {
        conversionRate = 2000; // 200 DATACELL equal 1 ETH
        transferOwnership(contractOwner);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function convertEtherToTokens() public payable {
        require(
            msg.value > 0,
            "DataCellarToken: You should send 1 wei at least"
        );
        uint256 tokensToTransfer = (msg.value * conversionRate) /
            (10 ** DECIMALS); // Calcolo della quantità di token da trasferire
        /*require(
            balanceOf(address(this)) >= tokensToTransfer,
            "Il contratto non ha abbastanza token da trasferire"
        ); // Verifica che il contratto abbia abbastanza token per effettuare la conversione
        */
        require(
            totalSupply().add(tokensToTransfer) <= cap(),
            "DataCellarToken: cap exceeded"
        );
        _mint(msg.sender, tokensToTransfer);
        //_transfer(address(this), msg.sender, tokensToTransfer); // Trasferimento dei token all'indirizzo del mittente
    }

    /**
     * @dev fallback function
     *      this is a default fallback function in which receives
     *      the collected ether.
     */
    fallback() external payable {
        revert("Invalid ether transfer");
    }

    /**
     * @dev receive function
     *      this is a default receive function in which receives
     *      the collected ether.
     */
    receive() external payable {
        revert("Invalid ether transfer");
    }
}
