// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IFactoryERC721.sol";
import "./interfaces/IERC20template.sol";

contract ERC721template is
    ERC721("Template", "TemplateSymbol"),
    ReentrancyGuard
{
    string private _name;
    string private _symbol;
    address private _tokenFactory;
    address[] public deployedERC20List;
    mapping(address => bool) private deployedERC20;
    bool public transferable;
    bool private _initialized;
    address private _owner;
    string private _tokenURI; //imported from an other oceanprotocol contract

    struct permissions {
        bool updateMetadata;
        bool deployERC20;
        bool store;
    }

    permissions private _ownerPermission;

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

    modifier onlyNFTOwner() {
        require(msg.sender == ownerOf(1), "ERC721Template: not NFTOwner");
        _;
    }

    //create the NFT
    //At the moment we consider that the owner of a dataset/model CAN'T give his right on NFT to someone else
    function initialize(
        address owner,
        string calldata name_,
        string calldata symbol_,
        address tokenFactory,
        string memory tokenURI,
        bool transferable_
    ) external returns (bool) {
        require(!_initialized, "Token instance already initialized");
        require(
            owner != address(0),
            "ERC721Template:: Invalid minter,  zero address"
        );
        bool initResult = _initialize(
            owner,
            name_,
            symbol_,
            tokenFactory,
            tokenURI,
            transferable_
        );
        return (initResult);
    }

    /**
     * @dev _initialize
     *      Calls private _initialize function. Only if contract is not initialized.
     *       This function mints an NFT (tokenId=1) to the owner
     *       and add owner as Manager Role (Roles admin)
     * @param owner NFT Owner
     * @param name_ NFT name
     * @param symbol_ NFT Symbol
     * @param tokenFactory NFT factory address
     * @param tokenURI tokenURI for token 1
     
     @return boolean
     */

    function _initialize(
        address owner,
        string memory name_,
        string memory symbol_,
        address tokenFactory,
        string memory tokenURI,
        bool transferable_
    ) internal returns (bool) {
        require(
            owner != address(0),
            "ERC721Template:: Invalid minter,  zero address"
        );

        _name = name_;
        _symbol = symbol_;
        _tokenFactory = tokenFactory;
        _initialized = true;
        _owner = owner;
        //hasMetaData = false;
        transferable = transferable_;
        _safeMint(owner, 1);
        //_addManager(owner);

        // we add the nft owner to all other roles (so that doesn't need to make multiple transactions)
        //Roles storage user = permissions[owner];
        _ownerPermission.updateMetadata = true;
        _ownerPermission.deployERC20 = true;
        _ownerPermission.store = true;
        // no need to push to auth since it has been already added in _addManager()
        _setTokenURI(1, tokenURI); //this function is implemented inside other contracts custom of OceanProtocol

        return _initialized;
    }

    function _setTokenURI(
        uint256 tokenId,
        string memory tokenURI
    ) internal virtual {
        require(
            _exists(tokenId),
            "ERC721URIStorage: URI set of nonexistent token"
        );
        _tokenURI = tokenURI;
    }

    function setTokenURI(uint256 tokenId, string memory tokenURI) public {
        require(msg.sender == ownerOf(tokenId), "ERC721Template: not NFTOwner");
        _setTokenURI(tokenId, tokenURI);
        emit TokenURIUpdate(
            msg.sender,
            tokenURI,
            tokenId,
            /* solium-disable-next-line */
            block.timestamp,
            block.number
        );
    }

    /**
     * @dev createERC20
     *        ONLY user with deployERC20 permission (assigned by Manager) can call it
             Creates a new ERC20 datatoken.
            It also adds initial minting and fee management permissions to custom users.
     * @param strings refers to an array of strings
     *                      [0] = name
     *                      [1] = symbol
     * @param addresses refers to an array of addresses
     *                     [0]  = minter account who can mint datatokens (can have multiple minters)
     *                     [1]  = publishing Market Address
     *                     [2]  = publishing Market Fee Token
     * @param uints  refers to cap_ the total ERC20 cap
     *                     Currently not used, usefull for future templates
     * @param licenseType refers on license type:
     *                      - usage;
     *                      - periodic;
     @return ERC20 token address
     */

    //NFT owner is the only one who can generate erc20 contract

    function createERC20(
        uint256 _templateIndex,
        string[] calldata strings,
        address[] calldata addresses,
        uint256 uints,
        string memory licenseType,
        uint256 price,
        uint256 licensePeriod
    ) external nonReentrant onlyNFTOwner returns (address) {
        require(
            _ownerPermission.deployERC20,
            "ERC721Template: NOT ERC20DEPLOYER_ROLE"
        );

        address token = IFactoryERC721(_tokenFactory).createToken(
            _templateIndex,
            strings,
            addresses,
            uints,
            licenseType,
            price,
            licensePeriod
        );

        emit licenseERC20Created(
            strings[0],
            strings[1],
            addresses[0],
            uints,
            licenseType,
            price,
            token
        );
        deployedERC20[token] = true;

        deployedERC20List.push(token);
        return token;
    }

    //User want to consume nft, but we need to check his license subscription

    function requestConsumeNFT(address licenseConsume) public returns (bool) {
        require(
            deployedERC20[licenseConsume] == true,
            "ERC721template: license not defined"
        );
        IERC20template license = IERC20template(payable(licenseConsume));
        string memory licensetype = license.getlicenseType();
        require(
            license.balanceOf(msg.sender) > 0,
            "ERC721template: no more token availability to consume nft"
        );
        if (
            keccak256(abi.encodePacked((licensetype))) ==
            keccak256(abi.encodePacked(("usage")))
        ) {
            //at the moment we are saying the usage is happening now, but it will happen next
            license.transferFrom(msg.sender, _owner, 1);
            emit nftConsumedUsage(
                true,
                address(this),
                license.balanceOf(msg.sender)
            );
            return true;
        } else {
            uint256 totalDays = license.getLicensePeriod() * 30 days;
            if (
                block.timestamp - license.getStartLicenseDate(msg.sender) <
                totalDays
            ) {
                emit nftConsumedPeriod(
                    true,
                    address(this),
                    license.getStartLicenseDate(msg.sender),
                    block.timestamp
                );
                return true;
            } else {
                //bruciamo il datatoken. non trasferiamo al proprietario
                license.transferFrom(msg.sender, _owner, 1);
                emit nftConsumedPeriod(
                    false,
                    address(this),
                    license.getStartLicenseDate(msg.sender),
                    block.timestamp
                );
                return false;
            }
        }
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
     * @dev isInitialized
     *      It checks whether the contract is initialized.
     * @return true if the contract is initialized.
     */

    function isInitialized() external view returns (bool) {
        return _initialized;
    }

    function ownerAddress() external view returns (address) {
        return _owner;
    }

    function getTokenUri() external view returns (string memory) {
        return _tokenURI;
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

    function getTokensList() external view returns (address[] memory) {
        return deployedERC20List;
    }

    function isDeployed(address datatoken) external view returns (bool) {
        return deployedERC20[datatoken];
    }

    function getFactory() public view returns (address) {
        return _tokenFactory;
    }

    function deleteLicense(address _erc20, address[] memory templateLicenses, address[] memory factoryLicenses) external {
        require(deployedERC20[_erc20] == true, "DL1");
        require(msg.sender == _erc20, "DL2");
        deployedERC20[_erc20] = false;
        deployedERC20List = templateLicenses;
        IFactoryERC721 factory = IFactoryERC721(payable(_tokenFactory));
        factory.deleteLicense(_erc20, address(this), factoryLicenses);
    }

    function deleteNft(address[] memory nftList) external {
        require(deployedERC20List.length == 0, "There are still some licenses!");
        require(_owner == msg.sender, "Not the owner!");
        IFactoryERC721 factory = IFactoryERC721(payable(_tokenFactory));
        factory.deleteNFT(address(this), nftList);
        selfdestruct(payable(msg.sender));
    }

    function setName(string memory _newName) external onlyNFTOwner{
        _name = _newName;
    }

    function setSymbol(string memory _newSymbol) external onlyNFTOwner {
        _symbol = _newSymbol;
    }

    function setTransferable(bool _newTransferable) external onlyNFTOwner {
        transferable = _newTransferable;
    }
}
