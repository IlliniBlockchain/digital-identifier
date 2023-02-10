// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./addressToString.sol";
import "hardhat/console.sol";

contract ERC721Identifier is ERC721Enumerable, AccessControl {
    
    // creating a minter role for access throughout the contract
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    using Counters for Counters.Counter;

    // counter _token.ids to increment for each new nft minted
    Counters.Counter private _tokenIds;

    // base URI that stays constant for all NFTs (if I switch to IPFS, I won't need this)
    string private baseURI = "";


    // Taken from the URI storage contract.  This is map associates token IDs with their given URIs which is nessecary if there is no way to reverse engineer the URIs later down the line
    // So if I use the getsandbox then I can use a public address as a query parameter to find the appropriate URI
    // if I use IPFS hashes will be random, there is no way to reverse engineer URIs so I must store them
    mapping(uint256 => string) private _tokenURIs;

    event NewIdentifierMinted(address indexed from, address indexed to, uint256 tokenID, string tokenURI, uint256 timestamp);


    // Constructor takes a collection name and symbol to describe the collection.  Sets the minter role to the wallet minting the contract, and sets the base URI
    constructor(string memory name_, string memory symbol_, string memory baseURI_) ERC721(name_, symbol_) {
        _grantRole(MINTER_ROLE, msg.sender);
        _setBaseURI(baseURI_);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Enumerable, AccessControl) returns (bool) {
    return
        interfaceId == type(IERC721).interfaceId ||
        interfaceId == type(IERC721Metadata).interfaceId ||
        interfaceId == type(IERC721Enumerable).interfaceId ||
        super.supportsInterface(interfaceId);
    }

    /**
     * @dev Hook that is called before any token transfer. This includes minting
     * and burning.
     *
     * Calling conditions:
     *
     * - When `from` and `to` are both non-zero, ``from``'s `tokenId` will be
     * transferred to `to`.
     * - When `from` is zero, `tokenId` will be minted for `to`.
     * - When `to` is zero, ``from``'s `tokenId` will be burned.
     * - `from` and `to` are never both zero.
     **/

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        virtual
        override(ERC721Enumerable)
    {
        console.log("Checking if has minter role");
        require(hasRole(MINTER_ROLE, msg.sender), "ERC721Identifer: this digital ID is bound to your wallet.  Contact the minter (Synchrony) if you wish to change the location of your ID");
        // require(from == address(0) || to == address(0), "Non transferrable token"); Still debating if I even want Synchrony to have this privilege
        require((to != address(0)), "This token can not be burned or minted by anyone other than the minter.  Please contact Synchrony if you wish to burn your ID");
        require((balanceOf(to) == 0), "Can only hold one digitalID per wallet, this wallet already has one!");
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function mint(address to) public {
        require(
            hasRole(MINTER_ROLE, msg.sender),
            "ERC721Identifer: Only MINTER_ROLE has this permission.  Your account does not have MINTER_ROLE"
        );
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, Strings.toHexString(uint256(uint160(to)), 20)); // the second argument here should be the IPFS storage hash
        console.log("%s has been given a token with id %s and uri %s", to, newTokenId, tokenURI(newTokenId));
        emit NewIdentifierMinted(msg.sender, to, newTokenId, tokenURI(newTokenId), block.timestamp);
    }

    function _setBaseURI(string memory baseURI_) internal {
        baseURI = baseURI_;
    }

    function _baseURI() internal view override returns(string memory) {
        return baseURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        return super.tokenURI(tokenId);
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }
}