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


export interface IModalSystem {
  waypoint: string;
  shipSymbol: string;
  type: ModalActions;
  cargo: ICargo;
}

export interface IUser {
  accountId: string;
  symbol: string;
  token: string;
  factionName: string;
  location?: string;
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
    },
    deliver?: {
      unitsFulfilled: number;
      tradeSymbol: string;
      unitsRequired: number;
      destinationSymbol: string;
    }[];
  }
  payment: {
    onAccepted: number;
    onFulfilled: number;
  }
}


export interface ITrait {
  symbol: string;
  name: string;
  description: string;
}

export interface ICargo {
  capacity: number;
  units: number;
  inventory: {
    symbol: string;
    name: string;
    description: string;
    units: number;
  }[];
}

export interface IWayPoint {
  systemSymbol: string;
  symbol: string;
  type: string;
  x: number;
  y: number;
  orbitals: any[];
  traits: ITrait[];
  modifiers: any[];
  chart: IChart;
  faction: IFaction;
  isUnderConstruction: boolean;
}

export interface IShipyard {
  modificationFee: number;
  symbol: string;
  shipTypes: string[];
}

export interface IShip {
  symbol: string;
  registration: {
    name: string;
    factionSymbol: string;
    role: string;
  };
  nav: {
    systemSymbol: string;
    waypointSymbol: string;
    status: string;
    type: string;
    flightMode?: string;
    route?: {
      arrival: string;
      departureTime: string;
    }
  };
  crew: {
    current: number;
    capacity: number;
    required: number;
  };
  fuel: {
    current: number;
    capacity: number;
    consumed: {
      amount: number;
      timestamp: string;
    };
  };
  frame: {
    symbol: string;
    name: string;
    description: string;
  };
  reactor: {
    symbol: string;
    name: string;
    description: string;
  };
  engine: {
    symbol: string;
    name: string;
    description: string;
  };
  modules: {
    symbol: string;
    name: string;
    description: string;
  }[];
  mounts: {
    symbol: string;
    name: string;
    description: string;
  }[];
  cargo: ICargo;
  cooldown: {
    shipSymbol: string;
    totalSeconds: number;
    remainingSeconds: number;
    expiration?: string;
  };
}

export interface ITradeGood {
  symbol: string;
  tradeVolume: number;
  type: string;
  activity: string;
  purchasePrice: number;
  sellPrice: number;
  supply: string;
}

export interface IExchange {
  symbol: string;
  name: string;
  description: string;
}

export interface IMarket {
  symbol: string;
  imports: {
      symbol: string;
      name: string;
      description: string;
  }[];
  exports: any[]; // Assuming exports is an empty array
  exchange: Exchange[];
  transactions: any[]; // Assuming transactions is an array of objects
  tradeGoods: TradeGood[];
}