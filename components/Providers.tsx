'use client';

import { setupIonicReact, IonApp, IonSplitPane } from '@ionic/react';
import { OrgProvider } from '@/contexts/OrgContext';
import { Toaster } from 'sonner';
import SideMenu from './SideMenu';

setupIonicReact({
  mode: 'ios',
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OrgProvider>
      <IonApp>
        <SideMenu />
        <div id="main-content" className="ion-page">
          {children}
        </div>
      </IonApp>
      <Toaster position="top-center" richColors />
    </OrgProvider>
  );
}
