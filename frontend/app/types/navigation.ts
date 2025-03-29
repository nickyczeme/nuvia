export type RootStackParamList = {
  Home: undefined;
  Request: undefined;
  RequestDetails: {
    request: {
      id: string;
      name: string;
      lastName: string;
      dni: string;
      social: string;
      method: string;
      brand: string;
    };
  };
}; 