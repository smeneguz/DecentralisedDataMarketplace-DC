import { SDKProvider } from "@metamask/sdk";

declare global {
  interface Window{
    ethereum?:SDKProvider,

  }
}