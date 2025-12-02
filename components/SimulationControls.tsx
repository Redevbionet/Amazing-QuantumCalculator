import React from 'react';
import Button from './Button';
import Card from './Card';
import { SimulationParameters } from '../types';

interface SimulationControlsProps {
  params: SimulationParameters;
  onParamsChange: (newParams: SimulationParameters) => void;
  onRunSimulation: () => void;
  loading: boolean;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  params,
  onParamsChange,
  onRunSimulation,
  loading,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onParamsChange({
      ...params,
      [name]: type === 'checkbox' ? checked : parseInt(value, 10),
    });
  };

  const handleToggleEve = () => {
    onParamsChange({
      ...params,
      eveEnabled: !params.eveEnabled,
    });
  };

  const handleToggleSecureMode = () => {
    onParamsChange({
      ...params,
      secureMode: !params.secureMode,
    });
  };

  return (
    <Card title="Simulation Parameters" className="mb-8 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div>
          <label htmlFor="n" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Qubits (n)
          </label>
          <input
            type="number"
            id="n"
            name="n"
            value={params.n}
            onChange={handleChange}
            min="100"
            max="5000"
            step="100"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          />
          <p className="text-xs text-gray-500 mt-1">Total qubits sent by Alice.</p>
        </div>
        <div>
          <label htmlFor="sampleSize" className="block text-sm font-medium text-gray-700 mb-1">
            QBER Sample Size (%)
          </label>
          <input
            type="number"
            id="sampleSize"
            name="sampleSize"
            value={params.sampleSize}
            onChange={handleChange}
            min="5"
            max="50"
            step="5"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          />
          <p className="text-xs text-gray-500 mt-1">Percentage of sifted bits for QBER check.</p>
        </div>
        <div>
          <label htmlFor="blockSize" className="block text-sm font-medium text-gray-700 mb-1">
            Error Correction Block Size
          </label>
          <input
            type="number"
            id="blockSize"
            name="blockSize"
            value={params.blockSize}
            onChange={handleChange}
            min="8"
            max="128"
            step="8"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          />
          <p className="text-xs text-gray-500 mt-1">Bits per block for error correction.</p>
        </div>
        <div>
          <label htmlFor="finalKeyLength" className="block text-sm font-medium text-gray-700 mb-1">
            Privacy Amplification Length
          </label>
          <input
            type="number"
            id="finalKeyLength"
            name="finalKeyLength"
            value={params.finalKeyLength}
            onChange={handleChange}
            min="32"
            max="256"
            step="32"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          />
          <p className="text-xs text-gray-500 mt-1">Final key length after privacy amplification.</p>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="eveEnabled"
            name="eveEnabled"
            checked={params.eveEnabled}
            onChange={handleToggleEve}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="eveEnabled" className="ml-2 block text-sm font-medium text-gray-700">
            Enable Eve (Intercept-Resend Attack)
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="secureMode"
            name="secureMode"
            checked={params.secureMode}
            onChange={handleToggleSecureMode}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="secureMode" className="ml-2 block text-sm font-medium text-gray-700">
            Enable Secure Mode (HMAC, strict QBER)
          </label>
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <Button onClick={onRunSimulation} disabled={loading} className="w-full sm:w-auto">
          {loading ? 'Running Simulation...' : 'Run BB84 Simulation'}
        </Button>
      </div>
    </Card>
  );
};

export default SimulationControls;