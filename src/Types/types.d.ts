export interface IFaction {
  symbol: string;
  name: string;
  description: string
  headquarters: string;
}

export interface IRegisterUser {
  symbol: string;
  faction: string;
}

export interface IUser {
  accountId: string;
  symbol: string;
  token: string;
  factionName: string;
}

export interface IContract {
  id: string;
  factionSymbol: string;
  type: string;
  accepted: boolean;
  deadlineToAccept: string;
  expiration: string;
  fulfilled: boolean;
  terms: {
    payment: {
      onAccepted: number;
      onFulfilled: number;
    }
  }
}