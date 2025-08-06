import React from 'react';

export const MockIndicator: React.FC = () => {
  const isDevelopment = import.meta.env.DEV;
  const useMock = import.meta.env.VITE_USE_MOCK === 'true' || isDevelopment;

  if (!useMock) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-50 bg-yellow-500 py-1 text-center text-sm font-medium text-black">
      🎭 MODO DEMONSTRAÇÃO - Dados simulados sendo utilizados
    </div>
  );
};
