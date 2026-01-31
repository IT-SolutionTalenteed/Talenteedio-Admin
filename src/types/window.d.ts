declare global {
  interface Window {
    TomSelect: any;
    initializeTomSelect: (selector?: string) => void;
  }
}

export {};
