export enum Basis {
  RECTILINEAR = 'Rectilinear', // | or -- (Horizontal/Vertical)
  DIAGONAL = 'Diagonal',     // / or \ (Diagonal)
}

export enum Polarization {
  H = '0° (H)', // Horizontal
  V = '90° (V)', // Vertical
  D_45 = '45° (+D)', // Diagonal 45
  D_135 = '135° (-D)', // Diagonal 135
}

export enum Bit {
  ZERO = 0,
  ONE = 1,
}

export interface Qubit {
  id: number;
  aliceBit: Bit;
  aliceBasis: Basis;
  alicePolarization: Polarization;
  eveBasis?: Basis;
  evePolarization?: Polarization;
  eveBit?: Bit;
  bobBasis: Basis;
  bobMeasurement: Bit;
  matchBasis: boolean;
  sifted?: boolean;
  errorCorrected?: boolean;
}

export interface SimulationResult {
  initialQubits: Qubit[];
  aliceKey: Bit[];
  bobKey: Bit[];
  eveKey?: Bit[];
  siftedAliceKey: Bit[];
  siftedBobKey: Bit[];
  qber: number | null;
  qberExceeded: boolean;
  finalAliceKey: string | null;
  finalBobKey: string | null;
  keysMatch: boolean;
  errorCorrectedBobKey?: Bit[];
  privacyAmplifiedKey?: string;
}

export interface SimulationParameters {
  n: number;
  sampleSize: number;
  blockSize: number;
  finalKeyLength: number;
  eveEnabled: boolean;
  secureMode: boolean;
}

export interface QiskitCircuitStep {
  description: string;
  code: string;
  output?: string;
}
