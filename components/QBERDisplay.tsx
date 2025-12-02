import React from 'react';
import Card from './Card';
import { QBER_THRESHOLD } from '../constants';

interface QBERDisplayProps {
  qber: number | null;
  qberExceeded: boolean;
  secureMode: boolean;
}

const QBERDisplay: React.FC<QBERDisplayProps> = ({ qber, qberExceeded, secureMode }) => {
  if (qber === null) return null;

  const qberPercentage = (qber * 100).toFixed(2);
  let statusText = '';
  let statusColor = 'text-green-600';

  if (secureMode) {
    if (qberExceeded) {
      statusText = `QBER (${qberPercentage}%) EXCEEDS THRESHOLD (${(QBER_THRESHOLD * 100).toFixed(0)}%)! ABORTING.`;
      statusColor = 'text-red-600';
    } else {
      statusText = `QBER (${qberPercentage}%) is within acceptable limits. Proceeding.`;
      statusColor = 'text-green-600';
    }
  } else {
    statusText = `QBER: ${qberPercentage}%`;
    statusColor = qberExceeded ? 'text-yellow-600' : 'text-green-600';
  }

  return (
    <Card title="Quantum Bit Error Rate (QBER)" className="mb-8">
      <p className="text-gray-700 mb-2">
        After sifting, a random sample of bits is publicly compared to estimate the error rate.
      </p>
      <div className={`text-xl font-bold ${statusColor}`}>
        {statusText}
      </div>
      {secureMode && qberExceeded && (
        <p className="text-red-500 mt-2">
          In secure mode, a high QBER indicates potential eavesdropping, so the key generation is aborted for safety.
        </p>
      )}
    </Card>
  );
};

export default QBERDisplay;