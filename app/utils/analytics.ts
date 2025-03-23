interface GA {
  (command: string, ...args: any[]): void; // Define the type for the ga function
  q: any[]; // Define the queue for the ga function
  l: number; // Define the timestamp for the ga function
}

interface Window {
  ga: GA; // Use the GA type for the ga property
  [key: string]: any; // Allow other properties on the window object
}

// Extend the global Window interface
declare global {
  interface Window {
    ga: GA;
  }
}

export const initGA = () => {
  if (typeof window !== 'undefined') {
    // Create a GA function with required properties
    const ga: GA = function(command: string, ...args: any[]) {
      (ga.q = ga.q || []).push(arguments);
    };

    ga.q = [];
    ga.l = +new Date;

    window['ga'] = window['ga'] || ga; // Assign to window.ga
    window.ga('create', 'YOUR_GA_TRACKING_ID', 'auto'); // Use window.ga directly
    window.ga('send', 'pageview'); // Use window.ga directly
  }
};

export const logPageView = () => {
  if (typeof window !== 'undefined') {
    window.ga('send', 'pageview'); // Use window.ga directly
  }
}; 