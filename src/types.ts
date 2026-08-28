export type Frame = {
  name: string;
  dataUrl: string;
  width: number;
  height: number;
};

export type LayerSettings = {
  visible: boolean;
  opacity: number;
  tint: string;
  tinted: boolean;
};

export type ViewerSettings = {
  previous: LayerSettings;
  current: LayerSettings;
  next: LayerSettings;
};

export type SavedProject = {
  id: 'latest';
  name: string;
  savedAt: number;
  current: number;
  frames: Frame[];
  settings: ViewerSettings;
};
