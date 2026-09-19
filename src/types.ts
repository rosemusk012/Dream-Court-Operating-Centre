export interface RegistryNode {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: 'Anchor' | 'Decree' | 'Monument' | 'Cosmic Law' | 'Manifesto' | 'AI Protocol';
  meta: string;
  summary: string;
  quote?: {
    text: string;
    author: string;
  };
  sections: {
    heading?: string;
    content: string;
    callout?: {
      type: 'amber' | 'purple' | 'emerald';
      text: string;
    };
  }[];
  hardwareAnchors?: string[];
  principles?: string[];
}

export interface ReflectionNote {
  id: string;
  nodeId: string;
  timestamp: string;
  author: string;
  text: string;
}

export interface ResonanceTelemetry {
  frequency: number;
  purity: number;
  snr: number;
  signalState: 'Pure' | 'Attenuated' | 'Synchronized';
  harmonicNode: string;
}
