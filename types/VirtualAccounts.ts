import { Currency } from "./Transaction";

export interface OpenVirtualAccountParams {
    smartAccountAddress: string;
    gridUserId: string;
    currency: Currency;
}


