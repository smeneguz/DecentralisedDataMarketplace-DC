export default interface LicensePeriod{
    usernameOwner: string;
    price: number; //single price subscription in DataCellarToken for all the period
    name: string; 
    symbol: string;
    minters: string[];
    cap: number;
    period: number; //at the momento we don't have any possibility to make valuable this information!! WE NEED TO MODIFY THE ERC20CONTRACT!
    nftAddress: string;
}