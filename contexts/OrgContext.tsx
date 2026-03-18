'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// For this version, we use a skeleton/placeholder for auth
// and mock organizations.
export const organizations = [
  { id: 'org-bistro-italiano', name: 'Bistro Italiano' },
  { id: 'org-zen-kitchen', name: 'Zen Kitchen' },
];

export const DEFAULT_ORG_ID = organizations[0].id;

interface OrgContextType {
  currentOrgId: string;
  setCurrentOrgId: (orgId: string) => void;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export function OrgProvider({ children }: { children: ReactNode }) {
  const [currentOrgId, setCurrentOrgId] = useState<string>(DEFAULT_ORG_ID);

  // In a real app, this might be fetched from a cookie or session
  useEffect(() => {
    const savedOrgId = localStorage.getItem('currentOrgId');
    if (savedOrgId && organizations.some(o => o.id === savedOrgId)) {
      setCurrentOrgId(savedOrgId);
    }
  }, []);

  const handleSetOrgId = (id: string) => {
    setCurrentOrgId(id);
    localStorage.setItem('currentOrgId', id);
  };

  return (
    <OrgContext.Provider value={{ currentOrgId, setCurrentOrgId: handleSetOrgId }}>
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg() {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error('useOrg must be used within OrgProvider');
  }
  return context;
}
