import React from 'react';
import Card from './Card';

interface SecurityStatusProps {
  secureMode: boolean;
  hmacVerified: boolean | null;
  keysVerified: boolean | null;
  privacyAmplificationLength: number;
}

const SecurityStatus: React.FC<SecurityStatusProps> = ({
  secureMode,
  hmacVerified,
  keysVerified,
  privacyAmplificationLength,
}) => {
  if (!secureMode) return null;

  return (
    <Card title="Security Features (Secure Mode)" className="mb-8">
      <h4 className="font-semibold text-lg text-indigo-700 mb-2">Authentication of Classical Messages (HMAC)</h4>
      <p className="text-gray-700 mb-2">
        In a real-world scenario, classical messages (like basis announcements) would be authenticated
        using a Message Authentication Code (HMAC) to prevent tampering.
      </p>
      {hmacVerified !== null && (
        <div className={`font-bold ${hmacVerified ? 'text-green-600' : 'text-red-600'} mb-4`}>
          HMAC Verification: {hmacVerified ? 'Successful (Messages Authenticated)' : 'Failed (Messages Tampered!)'}
        </div>
      )}

      <h4 className="font-semibold text-lg text-indigo-700 mb-2">Final Key Verification</h4>
      <p className="text-gray-700 mb-2">
        After privacy amplification, Alice and Bob verify a hash of their final keys to ensure they are identical.
      </p>
      {keysVerified !== null && (
        <div className={`font-bold ${keysVerified ? 'text-green-600' : 'text-red-600'} mb-4`}>
          Key Verification: {keysVerified ? 'Successful (Keys Match)' : 'Failed (Keys Do Not Match!)'}
        </div>
      )}

      <h4 className="font-semibold text-lg text-indigo-700 mb-2">Privacy Amplification Calculation</h4>
      <p className="text-gray-700 mb-2">
        The final key length ({privacyAmplificationLength} bits) is determined considering Eve's potential information,
        QBER, and other public parameters, ensuring maximum privacy.
      </p>
      <p className="text-gray-700 mb-4">
        <span className="font-semibold">Key Rotation:</span> In practice, authenticated keys would be regularly rotated,
        meaning new keys are generated and old ones discarded after a certain period or number of uses, further
        enhancing long-term security.
      </p>
    </Card>
  );
};

export default SecurityStatus;