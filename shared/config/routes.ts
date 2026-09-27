export interface RouteItem {
  name: string;
  path: string;
  iconName: 'Compass' | 'CloudRain' | 'BarChart3' | 'AlertTriangle' | 'ShieldAlert' | 'Cpu' | 'Database';
  description: string;
}

export const NAVIGATION_ROUTES: RouteItem[] = [
  {
    name: 'Overview',
    path: '/overview',
    iconName: 'Compass',
    description: 'Main operational deck & India rainfall map',
  },
  {
    name: 'Forecast',
    path: '/forecast',
    iconName: 'CloudRain',
    description: 'Multi-hour rainfall progression & quantiles',
  },
  {
    name: 'Regimes',
    path: '/regimes',
    iconName: 'BarChart3',
    description: 'Monsoon regime classification & synoptics',
  },
  {
    name: 'Extremes',
    path: '/extremes',
    iconName: 'AlertTriangle',
    description: 'Heavy rainfall operational risk & alerts',
  },
  {
    name: 'Verification',
    path: '/verification',
    iconName: 'ShieldAlert',
    description: 'Skill scores: RMSE, ETS, CSI, POD, FAR, FSS',
  },
  {
    name: 'Models',
    path: '/models',
    iconName: 'Cpu',
    description: 'AI/ML post-processing architecture & pipeline',
  },
  {
    name: 'Data',
    path: '/data',
    iconName: 'Database',
    description: 'NWP inputs, atmospheric features & observations',
  },
];
