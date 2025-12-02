
import React, { useState } from 'react';
import Card from './Card';
import { SimulationResult, Qubit, Basis, Bit, Polarization } from '../types';
import { QBER_THRESHOLD } from '../constants';
import Button from './Button'; // Import the Button component
import Modal from './Modal';   // Import the new Modal component

interface SimulationOutputProps {
  result: SimulationResult | null;
  params: {
    n: number;
    sampleSize: number;
    blockSize: number;
    finalKeyLength: number;
    eveEnabled: boolean;
    secureMode: boolean;
  };
}

const formatKey = (key: Bit[] | string | null | undefined, limit = 50) => {
  if (key === null || key === undefined) return 'N/A';
  if (typeof key === 'string') {
    return key.length > limit ? key.substring(0, limit) + '...' : key;
  }
  const strKey = key.map(b => b === Bit.ZERO ? '0' : '1').join('');
  return strKey.length > limit ? strKey.substring(0, limit) + '...' : strKey;
};

const getPolarizationSymbol = (pol: Polarization) => {
  switch (pol) {
    case Polarization.H: return '↔'; // Horizontal
    case Polarization.V: return '↕'; // Vertical
    case Polarization.D_45: return '↗'; // Diagonal 45°
    case Polarization.D_135: return '↘'; // Diagonal 135°
    default: return '?';
  }
};

const getBasisSymbol = (basis: Basis) => {
  return basis === Basis.RECTILINEAR ? '➕' : '✖';
};

const QubitRow: React.FC<{ qubit: Qubit, eveEnabled: boolean, showEveDetails: boolean }> = ({ qubit, eveEnabled, showEveDetails }) => (
  <tr className="border-b border-gray-100 last:border-b-0">
    <td className="py-2 px-2 text-center text-gray-700">{qubit.id}</td>
    <td className="py-2 px-2 text-center">{qubit.aliceBit} {getBasisSymbol(qubit.aliceBasis)} {getPolarizationSymbol(qubit.alicePolarization)}</td>
    {eveEnabled && showEveDetails && (
      <td className="py-2 px-2 text-center">
        {qubit.eveBasis ? `${getBasisSymbol(qubit.eveBasis)}` : '-'}
        {qubit.evePolarization ? ` ${getPolarizationSymbol(qubit.evePolarization)}` : ''}
        {qubit.eveBit !== undefined ? ` (${qubit.eveBit})` : ''}
        {qubit.eveBasis && qubit.eveBasis !== qubit.aliceBasis && (
            <span className="text-red-500 text-xs ml-1" title="Eve measured in different basis, potentially causing error">!</span>
        )}
      </td>
    )}
    <td className="py-2 px-2 text-center">
      {qubit.bobMeasurement} {getBasisSymbol(qubit.bobBasis)}
      {qubit.bobBasis !== qubit.aliceBasis && <span className="text-orange-500 text-xs ml-1" title="Bob measured in different basis, bit will be discarded">~</span>}
    </td>
    <td className="py-2 px-2 text-center">{qubit.matchBasis ? '✔️' : '❌'}</td>
  </tr>
);

const MAIN_TABLE_DISPLAY_LIMIT = 10; // Limit for initial qubits table in main view

const SimulationOutput: React.FC<SimulationOutputProps> = ({ result, params }) => {
  const [showAllQubitsModalOpen, setShowAllQubitsModalOpen] = useState(false);

  if (!result) {
    return (
      <Card className="mb-8">
        <p className="text-gray-600 text-center py-8">Run the simulation to see the results here.</p>
      </Card>
    );
  }

  const {
    initialQubits,
    aliceKey,
    bobKey,
    eveKey,
    siftedAliceKey,
    siftedBobKey,
    qber,
    qberExceeded,
    finalAliceKey,
    finalBobKey,
    keysMatch,
    errorCorrectedBobKey,
  } = result;

  const shouldTruncateMainTable = initialQubits.length > MAIN_TABLE_DISPLAY_LIMIT;
  const displayQubitsForMainTable = shouldTruncateMainTable ? initialQubits.slice(0, MAIN_TABLE_DISPLAY_LIMIT) : initialQubits;

  return (
    <Card title="BB84 Simulation Output" className="mb-8">
      {qberExceeded && params.secureMode && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Simulation Aborted!</strong>
          <span className="block sm:inline ml-2">QBER ({qber && (qber * 100).toFixed(2)}%) exceeded the security threshold ({(QBER_THRESHOLD * 100).toFixed(0)}%). Eavesdropping detected or too much noise.</span>
        </div>
      )}

      {/* Initial Qubits Table */}
      <h3 className="text-xl font-semibold mb-4 text-indigo-700">1. Qubit Preparation & Transmission</h3>
      <p className="text-gray-700 mb-4">
        Alice prepares {params.n} qubits based on random bits and bases. These are then sent to Bob (potentially intercepted by Eve).
      </p>
      <div className="overflow-x-auto mb-8 bg-gray-50 rounded-lg shadow-inner">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
              <th className="py-3 px-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Alice (Bit & Basis)</th>
              {params.eveEnabled && <th className="py-3 px-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Eve (Basis & Measurement)</th>}
              <th className="py-3 px-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bob (Basis & Measurement)</th>
              <th className="py-3 px-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Basis Match</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {displayQubitsForMainTable.map(qubit => (
              <QubitRow key={qubit.id} qubit={qubit} eveEnabled={params.eveEnabled} showEveDetails={true} />
            ))}
            {shouldTruncateMainTable && (
              <tr>
                <td colSpan={params.eveEnabled ? 5 : 4} className="py-4 text-center text-gray-500 italic">
                  ... Displaying first {MAIN_TABLE_DISPLAY_LIMIT} qubits for brevity (total {initialQubits.length} qubits) ...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {shouldTruncateMainTable && (
        <div className="mt-4 text-center">
          <Button onClick={() => setShowAllQubitsModalOpen(true)} variant="secondary">
            Show All {initialQubits.length} Qubits
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">2. Initial Keys</h3>
          <p className="text-gray-700 mb-2">
            The raw bits generated by Alice and measured by Bob before sifting.
          </p>
          <p className="text-lg font-mono bg-gray-100 p-3 rounded-md mb-2">
            Alice's Raw Key: <span className="font-bold text-indigo-800">{formatKey(aliceKey)}</span>
          </p>
          <p className="text-lg font-mono bg-gray-100 p-3 rounded-md">
            Bob's Raw Key: <span className="font-bold text-purple-800">{formatKey(bobKey)}</span>
          </p>
          {params.eveEnabled && eveKey && (
            <p className="text-lg font-mono bg-gray-100 p-3 rounded-md mt-2">
              Eve's Raw Key: <span className="font-bold text-red-800">{formatKey(eveKey)}</span>
            </p>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">3. Sifting</h3>
          <p className="text-gray-700 mb-2">
            Alice and Bob publicly compare bases and discard bits where bases don't match.
          </p>
          <p className="text-lg font-mono bg-gray-100 p-3 rounded-md mb-2">
            Alice's Sifted Key ({siftedAliceKey.length} bits): <span className="font-bold text-indigo-800">{formatKey(siftedAliceKey)}</span>
          </p>
          <p className="text-lg font-mono bg-gray-100 p-3 rounded-md">
            Bob's Sifted Key ({siftedBobKey.length} bits): <span className="font-bold text-purple-800">{formatKey(siftedBobKey)}</span>
          </p>
        </div>
      </div>

      {!qberExceeded || !params.secureMode ? (
        <>
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">4. Error Correction</h3>
          <p className="text-gray-700 mb-4">
            Alice and Bob use classical communication to identify and correct errors in their sifted keys.
          </p>
          <p className="text-lg font-mono bg-gray-100 p-3 rounded-md mb-2">
            Alice's Error Corrected Key: <span className="font-bold text-indigo-800">{formatKey(siftedAliceKey)}</span>
          </p>
          <p className="text-lg font-mono bg-gray-100 p-3 rounded-md mb-8">
            Bob's Error Corrected Key: <span className="font-bold text-purple-800">{formatKey(errorCorrectedBobKey || siftedBobKey)}</span>
          </p>

          <h3 className="text-xl font-semibold mb-4 text-indigo-700">5. Privacy Amplification & Final Key</h3>
          <p className="text-gray-700 mb-4">
            A random hash function is applied to shorten the key, reducing any potential information Eve might have.
          </p>
          <p className="text-lg font-mono bg-gray-100 p-3 rounded-md mb-2">
            Alice's Final Key ({params.finalKeyLength} bits): <span className="font-bold text-indigo-800">{formatKey(finalAliceKey)}</span>
          </p>
          <p className="text-lg font-mono bg-gray-100 p-3 rounded-md mb-2">
            Bob's Final Key ({params.finalKeyLength} bits): <span className="font-bold text-purple-800">{formatKey(finalBobKey)}</span>
          </p>
          <p className={`text-xl font-bold mt-4 ${keysMatch ? 'text-green-600' : 'text-red-600'}`}>
            Final Keys{' '}
            {keysMatch ? (
              <span className="inline-block animate-key-match-pulse">Match! ✅</span>
            ) : (
              'DO NOT Match! ❌'
            )}
          </p>
          {!keysMatch && (
            <p className="text-red-500 mt-2">
              This indicates a critical error in the protocol or a very noisy channel.
            </p>
          )}
        </>
      ) : null}

      {showAllQubitsModalOpen && (
        <Modal isOpen={showAllQubitsModalOpen} onClose={() => setShowAllQubitsModalOpen(false)} title={`All ${initialQubits.length} Qubits`}>
          <div className="overflow-x-auto h-96 custom-scroll">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-200 sticky top-0">
                <tr>
                  <th className="py-3 px-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="py-3 px-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Alice (Bit & Basis)</th>
                  {params.eveEnabled && <th className="py-3 px-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Eve (Basis & Measurement)</th>}
                  <th className="py-3 px-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bob (Basis & Measurement)</th>
                  <th className="py-3 px-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Basis Match</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {initialQubits.map(qubit => (
                  <QubitRow key={qubit.id} qubit={qubit} eveEnabled={params.eveEnabled} showEveDetails={true} />
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </Card>
  );
};

export default SimulationOutput;
