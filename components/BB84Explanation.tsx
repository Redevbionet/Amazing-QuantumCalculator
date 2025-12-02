import React from 'react';
import Card from './Card';

const BB84Explanation: React.FC = () => {
  return (
    <Card title="BB84 Quantum Key Distribution (QKD) Simulator" className="mb-8">
      <p className="text-gray-700 mb-4">
        The BB84 protocol, proposed by Charles Bennett and Gilles Brassard in 1984, is the first quantum cryptography protocol.
        It describes a method for two parties, traditionally called Alice and Bob, to establish a secret key that is provably secure
        against any eavesdropper, Eve, who might try to intercept their communication.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-gray-600">
        <div>
          <h4 className="font-semibold text-lg text-indigo-700 mb-2">1. Alice Prepares Qubits</h4>
          <p>
            Alice chooses a random bit (0 or 1) and a random basis (Rectilinear or Diagonal) for each qubit.
            She then encodes the bit into the polarization of a photon according to her chosen basis.
            For example:
            <ul className="list-disc list-inside mt-2 ml-4">
              <li>Rectilinear Basis: 0 → Horizontal (H), 1 → Vertical (V)</li>
              <li>Diagonal Basis: 0 → +45°, 1 → -45° (+135°)</li>
            </ul>
            She sends these photons to Bob.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-lg text-indigo-700 mb-2">2. Bob Measures Qubits</h4>
          <p>
            For each incoming photon, Bob randomly chooses one of the two bases (Rectilinear or Diagonal) to measure its polarization.
            He records the measured bit value and the basis he used.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-lg text-indigo-700 mb-2">3. Basis Sifting</h4>
          <p>
            Alice and Bob then publicly communicate over a classical channel, announcing which basis they used for each photon.
            They keep only the bits where their chosen bases matched. These bits form the "sifted key."
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-lg text-indigo-700 mb-2">4. Parameter Estimation (QBER)</h4>
          <p>
            To detect eavesdropping, Alice and Bob randomly select a subset of their sifted key bits and publicly compare them.
            The Quantum Bit Error Rate (QBER) is calculated based on the discrepancies.
            If the QBER exceeds a certain threshold (e.g., 11%), it indicates a high probability of eavesdropping, and the key is discarded.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-lg text-indigo-700 mb-2">5. Error Correction</h4>
          <p>
            Even without an eavesdropper, errors can occur due to noise. Alice and Bob use public discussion (e.g., parity checks, binary search)
            to find and correct these errors in their remaining shared key.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-lg text-indigo-700 mb-2">6. Privacy Amplification</h4>
          <p>
            After error correction, Eve might still have partial information about the key. Alice and Bob apply a randomly chosen hash function
            to their key, reducing its length but also significantly reducing Eve's potential knowledge. This generates the final shared secret key.
          </p>
        </div>
      </div>
      <p className="text-gray-700 mt-4 text-sm">
        <span className="font-semibold">Security Note:</span> The fundamental security of BB84 relies on the principles of quantum mechanics,
        specifically the no-cloning theorem and the fact that measurement disturbs a quantum state. Any attempt by an eavesdropper (Eve) to measure
        the photons will inevitably introduce detectable errors.
      </p>
    </Card>
  );
};

export default BB84Explanation;