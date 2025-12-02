import { Basis, Polarization, Bit } from './types';

export const QBER_THRESHOLD = 0.11; // 11% QBER threshold for aborting session

// Mappings for BB84 protocol
export const ALICE_POLARIZATIONS: { [key in Basis]: { [key in Bit]: Polarization } } = {
  [Basis.RECTILINEAR]: {
    [Bit.ZERO]: Polarization.H,
    [Bit.ONE]: Polarization.V,
  },
  [Basis.DIAGONAL]: {
    [Bit.ZERO]: Polarization.D_45,
    [Bit.ONE]: Polarization.D_135,
  },
};

export const BOB_MEASUREMENTS: { [key in Basis]: { [key in Polarization]: Bit } } = {
  [Basis.RECTILINEAR]: {
    [Polarization.H]: Bit.ZERO,
    [Polarization.V]: Bit.ONE,
    // When measuring diagonal in rectilinear, results are random
    [Polarization.D_45]: Math.random() < 0.5 ? Bit.ZERO : Bit.ONE,
    [Polarization.D_135]: Math.random() < 0.5 ? Bit.ZERO : Bit.ONE,
  },
  [Basis.DIAGONAL]: {
    [Polarization.D_45]: Bit.ZERO,
    [Polarization.D_135]: Bit.ONE,
    // When measuring rectilinear in diagonal, results are random
    [Polarization.H]: Math.random() < 0.5 ? Bit.ZERO : Bit.ONE,
    [Polarization.V]: Math.random() < 0.5 ? Bit.ZERO : Bit.ONE,
  },
};

// HMAC Secret (for demonstration only, usually a shared secret)
export const HMAC_SECRET = 'super-secret-shared-key-for-hmac-authentication';

// Sample Qiskit circuit for conceptual demonstration
export const QISKIT_DEMO_CIRCUIT_STEPS = [
  {
    description: "Initialize a quantum circuit with 1 qubit and 1 classical bit.",
    code: `
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

qc = QuantumCircuit(1, 1)
print(qc.draw())
    `,
    output: `
     ┌───┐
q_0: ┤ I ├
     └───┘
c: 1/═════
    `
  },
  {
    description: "Alice prepares a qubit in the H (0) state.",
    code: `
qc.h(0) # Apply Hadamard gate to prepare superposition (or just leave for 0)
# For BB84, Alice prepares 0 or 1 in a chosen basis.
# Example for 0 in Rectilinear basis:
# qc = QuantumCircuit(1, 1) # Start fresh
# No gate needed for |0>
print(qc.draw())
    `,
    output: `
     ┌───┐
q_0: ┤ H ├
     └───┘
c: 1/═════
    `
  },
  {
    description: "Bob measures the qubit in the Rectilinear basis.",
    code: `
qc.measure(0, 0)
print(qc.draw())
    `,
    output: `
     ┌───┐┌─┐
q_0: ┤ H ├┤M├
     └───┘└╥┘
c: 1/══════╩═
           0
    `
  },
  {
    description: "Simulate the circuit.",
    code: `
simulator = AerSimulator()
compiled_circuit = transpile(qc, simulator)
job = simulator.run(compiled_circuit, shots=1)
result = job.result()
counts = result.get_counts(qc)
print(f"Measurement result: {counts}")
    `,
    output: `Measurement result: {'0': 1}`
  }
];
