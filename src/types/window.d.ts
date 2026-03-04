declare global {
  interface Window {
    TomSelect: any;
    initializeTomSelect: (selector?: string) => void;
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
        };
      };
    };
  }
}

export {};
