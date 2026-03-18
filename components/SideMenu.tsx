'use client';

import { 
  IonMenu, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonIcon, 
  IonLabel,
  IonMenuToggle,
  IonNote
} from '@ionic/react';
import { businessOutline, checkmarkCircleOutline, restaurantOutline, addOutline } from 'ionicons/icons';
import { useOrg, organizations } from '@/contexts/OrgContext';
import { useRouter } from 'next/navigation';
import { css } from '@emotion/css';

const menuHeaderStyles = css`
  --background: var(--app-primary);
  --color: white;
  padding: 20px 16px;
`;

const titleStyles = css`
  padding-inline: 1rem;
`;

const orgListStyles = css`
  margin-top: 20px;
`;

const activeOrgStyles = css`
  --color: var(--app-primary);
  font-weight: 700;
`;

export default function SideMenu() {
  const { currentOrgId, setCurrentOrgId } = useOrg();
  const router = useRouter();

  return (
    <IonMenu contentId="main-content" type="overlay">
      <IonHeader className="ion-no-border">
        <IonToolbar className={menuHeaderStyles}>
          <IonTitle className={titleStyles}>Recipe Manager</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{ padding: '24px 16px 8px' }}>
          <IonNote style={{ textTransform: 'uppercase', fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em' }}>
            Switch Organization
          </IonNote>
        </div>
        
        <IonList className={orgListStyles} lines="none">
          {organizations.map((org) => (
            <IonMenuToggle key={org.id} autoHide={false}>
              <IonItem 
                button 
                onClick={() => setCurrentOrgId(org.id)}
                className={currentOrgId === org.id ? activeOrgStyles : ''}
                style={{ '--border-radius': '12px', margin: '4px 8px' }}
              >
                <IonIcon slot="start" icon={businessOutline} />
                <IonLabel>{org.name}</IonLabel>
                {currentOrgId === org.id && (
                  <IonIcon slot="end" icon={checkmarkCircleOutline} color="primary" />
                )}
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonList>

        <div style={{ height: '1px', background: 'var(--app-border)', margin: '20px 16px' }} />

        <IonList lines="none">
          <IonMenuToggle autoHide={false}>
            <IonItem 
              button 
              onClick={() => router.push('/recipes/new')}
              style={{ '--border-radius': '12px', margin: '4px 8px' }}
            >
              <IonIcon slot="start" icon={addOutline} />
              <IonLabel>Create New</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
}
