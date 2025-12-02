import React, { useState, useEffect, useCallback } from 'react';
import BB84Explanation from './components/BB84Explanation';
import SimulationControls from './components/SimulationControls';
import SimulationOutput from './components/SimulationOutput';
import QBERDisplay from './components/QBERDisplay';
import SecurityStatus from './components/SecurityStatus';
import Card from './components/Card';
import { SimulationResult, SimulationParameters, QiskitCircuitStep } from './types';
import { runBB84Simulation, getHmacVerificationStatus } from './services/bb84Service';
import { QISKIT_DEMO_CIRCUIT_STEPS } from './constants';
import Button from './components/Button';

const App: React.FC = () => {
  const [simulationParams, setSimulationParams] = useState<SimulationParameters>({
    n: 800,
    sampleSize: 20,
    blockSize: 32,
    finalKeyLength: 128,
    eveEnabled: false,
    secureMode: false,
  });
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showQiskitDemo, setShowQiskitDemo] = useState<boolean>(false);

  const runSimulation = useCallback(() => {
    setLoading(true);
    setSimulationResult(null); // Clear previous results
    setTimeout(() => { // Simulate async operation
      const result = runBB84Simulation(
        simulationParams.n,
        simulationParams.sampleSize,
        simulationParams.blockSize,
        simulationParams.finalKeyLength,
        simulationParams.eveEnabled,
        simulationParams.secureMode
      );
      setSimulationResult(result);
      setLoading(false);
    }, 500); // Small delay for visual feedback
  }, [simulationParams]);

  useEffect(() => {
    // Initial run or run when params change (but debounce this for actual app)
    // For this simulation, we'll explicitly run it only when requested.
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  const hmacVerified = simulationResult ? getHmacVerificationStatus(simulationParams.secureMode, simulationResult.qberExceeded) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <header className="w-full max-w-7xl text-center py-8 mb-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-5xl font-extrabold text-indigo-800 tracking-tight sm:text-6xl">
          Amazing Quantum Calculator
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          BB84 Quantum Key Distribution Simulator for Learning & Exploration
        </p>
      </header>

      <main className="w-full max-w-7xl">
        <BB84Explanation />
        <SimulationControls
          params={simulationParams}
          onParamsChange={setSimulationParams}
          onRunSimulation={runSimulation}
          loading={loading}
        />

        {loading && (
          <Card className="text-center py-8 mb-8 text-indigo-700 font-semibold text-lg">
            Simulating Quantum Key Distribution... Please wait.
          </Card>
        )}

        {simulationResult && (
          <>
            <QBERDisplay
              qber={simulationResult.qber}
              qberExceeded={simulationResult.qberExceeded}
              secureMode={simulationParams.secureMode}
            />
            {simulationResult.qberExceeded && simulationParams.secureMode ? (
              <Card className="mb-8 bg-red-50 text-red-800 border-red-200">
                <h3 className="text-xl font-bold mb-2">Security Alert!</h3>
                <p>The QBER threshold was exceeded. The key generation process was aborted for security reasons. Consider reducing 'Eve's Interception' or increasing 'Number of Qubits' for a better chance of success without Eve.</p>
              </Card>
            ) : (
              <>
                <SecurityStatus
                  secureMode={simulationParams.secureMode}
                  hmacVerified={hmacVerified}
                  keysVerified={simulationResult.keysMatch}
                  privacyAmplificationLength={simulationParams.finalKeyLength}
                />
                <SimulationOutput result={simulationResult} params={simulationParams} />
              </>
            )}
          </>
        )}

        <Card title="Qiskit Integration (Conceptual)" className="mb-8">
          <p className="text-gray-700 mb-4">
            While this simulation runs purely in your browser, Quantum Key Distribution protocols like BB84
            are implemented using actual quantum hardware or simulators like{' '}
            <a href="https://qiskit.org/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Qiskit</a>.
          </p>
          <p className="text-gray-700 mb-4">
            To run a real (or simulated) quantum circuit, you would typically use a Python-based quantum SDK.
            Below is a conceptual demonstration of how Qiskit code would define and simulate a basic quantum circuit,
            illustrating the foundational steps for qubit preparation and measurement.
          </p>
          <Button onClick={() => setShowQiskitDemo(!showQiskitDemo)} variant="secondary" className="mb-4">
            {showQiskitDemo ? 'Hide Qiskit Demo' : 'Show Qiskit Demo'}
          </Button>

          {showQiskitDemo && (
            <div className="mt-6 space-y-6">
              {QISKIT_DEMO_CIRCUIT_STEPS.map((step: QiskitCircuitStep, index: number) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-lg text-gray-800 mb-2">{index + 1}. {step.description}</h4>
                  <pre className="bg-gray-800 text-green-300 p-3 rounded-md overflow-x-auto text-sm">
                    <code>{step.code.trim()}</code>
                  </pre>
                  {step.output && (
                    <div className="mt-2">
                      <p className="font-medium text-gray-700">Output:</p>
                      <pre className="bg-gray-700 text-yellow-200 p-3 rounded-md overflow-x-auto text-sm">
                        <code>{step.output.trim()}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
              <p className="text-sm text-gray-600 mt-4">
                To try this yourself, install Qiskit: <code>pip install qiskit qiskit-aer</code> and run these snippets in a Python environment.
              </p>
            </div>
          )}
        </Card>
      </main>

      <footer className="w-full max-w-7xl text-center py-6 mt-8 border-t border-gray-200 text-gray-500">
        &copy; {new Date().getFullYear()} BB84 QKD Simulator. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
