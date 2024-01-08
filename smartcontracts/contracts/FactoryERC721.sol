// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./interfaces/IERC721template.sol";
import "./interfaces/IERC20template.sol";
import "./interfaces/IManagementPayment.sol";
import "./utils/Deployer.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FactoryERC721 is Deployer, Ownable {
    uint256 private currentNFTCount;
    IManagementPayment public paymentManager;

    address[] public erc721array;
    mapping(address => address) public erc20listToerc721;
    mapping(address => address[]) public erc721licenses;

    uint256 private nftTemplateCount;

    struct Template {
        address templateAddress;
        bool isActive;
    }

    mapping(uint256 => Template) public nftTemplateList;

    mapping(uint256 => Template) public templateList;

    mapping(address => address) public erc721List;

    mapping(address => bool) public erc20List;

    uint256 private currentTokenCount = 0;
    uint256 public templateCount;

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

    modifier erc721check(address _nft) {
        require(
            erc721List[_nft] != address(0)
        );
        _;
    }
    modifier erc721toerc20check(address _erc20license, address _nft) {
        require(
            erc20listToerc721[_erc20license] == _nft
        );
        _;
    }

    constructor(address payable _managementPayment, address _template721, address _template20) {
        paymentManager = IManagementPayment(_managementPayment);
        add721TokenTemplate(_template721);
        add20TokenTemplate(_template20);
    }

    function _isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize, which returns 0 for contracts in
        // construction, since the code is only stored at the end of the
        // constructor execution.

        uint256 size;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }

    function ERC721deploy(
        string calldata name_,
        string calldata symbol_,
        uint256 _templateIndex,
        string memory tokenURI,
        bool transferable_
    ) external returns (address) {
        require(
            _templateIndex <= nftTemplateCount && _templateIndex != 0,
            "ERC721DTFactory: Template index doesnt exist"
        );
        Template memory tokenTemplate = nftTemplateList[_templateIndex];
        require(
            tokenTemplate.isActive,
            "ERC721DTFactory: ERC721Token Template disabled"
        );
        require(msg.sender != address(0));
        address token = deploy(tokenTemplate.templateAddress);

        require(
            token != address(0),
            "ERC721DTFactory: Failed to perform minimal deploy of a new token"
        );

        erc721List[token] = token;
        currentNFTCount += 1;
        IERC721template tokenInstance = IERC721template(token);

        emit createERC721(
            token,
            name_,
            msg.sender,
            symbol_,
            tokenURI,
            transferable_,
            tokenTemplate.templateAddress
        );
        
        require(
            tokenInstance.initialize(
                msg.sender,
                name_,
                symbol_,
                address(this),
                tokenURI,
                transferable_
            ),
            "ERC721DTFactory: Unable to initialize token instance"
        );
        erc721array.push(token);
        return token;
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
        uint256 _templateIndex,
        string[] memory strings,
        address[] memory addresses,
        uint256 uints,
        string memory licenseType,
        uint256 price,
        uint256 licensePeriod
    ) external returns (address token) {
        require(erc721List[msg.sender] == msg.sender);
        token = _createToken(
            _templateIndex,
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
        uint256 _templateIndex,
        string[] memory strings,
        address[] memory addresses,
        uint256 uints,
        string memory licenseType,
        uint256 price,
        uint256 licensePeriod,
        address owner
    ) internal returns (address) {
        require(uints != 0);

        require(
            _templateIndex <= templateCount && _templateIndex != 0,
            "ERC20Factory: Template index doesnt exist"
        );

        Template memory tokenTemplate = templateList[_templateIndex];

        require(
            tokenTemplate.isActive,
            "ERC20Factory: ERC721Token Template disabled"
        );

        address token = deploy(tokenTemplate.templateAddress);
        erc20List[token] = true;

        require(
            token != address(0),
            "ERC721Factory: Failed to perform minimal deploy of a new token"
        );
        currentTokenCount += 1;

        erc20listToerc721[token] = owner;
        erc721licenses[owner].push(token);

        IERC20template tokenInstance = IERC20template(token);

        emit TokenCreated(
            token,
            strings[0],
            strings[1],
            uints,
            licenseType,
            owner,
            tokenTemplate.templateAddress
        );

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
            tokenInstance.initialize(
                tokenData.strings,
                tokenData.addresses,
                msg.sender,
                tokenData.uints,
                tokenData.licenseType,
                tokenData.price,
                tokenData.licensePeriod
            )
        );
        return token;
    }

    function buyNFTlicensePeriod(
        address _nft,
        address _erc20license
    ) external erc721check(_nft) erc721toerc20check(_erc20license, _nft) {
        (
            string memory name,
            address owner,
            string memory symbol,
            string memory uri,
            uint date
        ) = paymentManager.paymentLicensePeriod(
                _nft,
                _erc20license,
                msg.sender
        );
        emit licensePeriodBought(name, owner, symbol, uri, date);
    }

    function buyNFTlicenseUsage(
        address _nft,
        address _erc20license,
        uint256 _usage
    ) external erc721check(_nft) erc721toerc20check(_erc20license, _nft) {
        (
            string memory name,
            address owner,
            string memory symbol,
            string memory uri,
            uint usage
        ) = paymentManager.paymentLicenseUsage(
                _nft,
                _erc20license,
                msg.sender,
                _usage
            );
        emit licenseUsageBought(name, owner, symbol, uri, usage);
    }

    /**
     * @dev add a new NFT Template.
      Only Factory Owner can call it
     * @param _templateAddress new template address
     * @return the actual template count
     */
    
    function add721TokenTemplate(address _templateAddress)
        public
        onlyOwner
        returns (uint256)
    {
        require(
            _templateAddress != address(0),
            "ERC721DTFactory: ERC721 template address(0) NOT ALLOWED"
        );
        require(_isContract(_templateAddress), "ERC721Factory: NOT CONTRACT");
        nftTemplateCount += 1;
        Template memory template = Template(_templateAddress, true);
        nftTemplateList[nftTemplateCount] = template;
        emit Template721Added(_templateAddress,nftTemplateCount);
        return nftTemplateCount;
    }

    function add20TokenTemplate(address _templateAddress)
        public
        onlyOwner
        returns (uint256)
    {
        require(
            _templateAddress != address(0),
            "ERC20Factory: ERC721 template address(0) NOT ALLOWED"
        );
        require(_isContract(_templateAddress), "ERC20Factory: NOT CONTRACT");
        templateCount += 1;
        Template memory template = Template(_templateAddress, true);
        templateList[templateCount] = template;
        emit Template20Added(_templateAddress, templateCount);
        return templateCount;
    }

    /**
     * @dev reactivate a disabled NFT Template.
            Only Factory Owner can call it
     * @param _index index we want to reactivate
     */
    
    // function to activate a disabled token.
    function reactivate721TokenTemplate(uint256 _index) external onlyOwner {
        require(
            _index <= nftTemplateCount && _index != 0,
            "ERC721DTFactory: Template index doesnt exist"
        );
        Template storage template = nftTemplateList[_index];
        template.isActive = true;
    }

      /**
     * @dev disable an NFT Template.
      Only Factory Owner can call it
     * @param _index index we want to disable
     */
    function disable721TokenTemplate(uint256 _index) external onlyOwner {
        require(
            _index <= nftTemplateCount && _index != 0,
            "ERC721DTFactory: Template index doesnt exist"
        );
        Template storage template = nftTemplateList[_index];
        template.isActive = false;
    }
}
