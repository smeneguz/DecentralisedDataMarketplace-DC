
export default interface LicenseUsage{
    usernameOwner: string;
    price: number; //price in DataCellarToken for every single usage
    name: string; //
    symbol: string;
    minters: string[];
    cap: number;
    nftAddress: string;
}