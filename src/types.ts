export interface AppConfig {
  pesoInicial: number;
  metaPerda: number;
  dataInicio: string;
}

export interface Registro {
  id: string;
  data: string; // YYYY-MM-DD
  peso: number;
  fome: number; // 0-10
  obs: string;
  foto?: string; // Base64 encoded string of user uploaded photo
  fotos?: string[]; // Array of Base64 encoded strings
}

export interface AppData {
  config: AppConfig;
  registros: Registro[];
}
