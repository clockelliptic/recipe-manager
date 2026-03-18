'use client';

import { 
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonMenuButton
} from '@ionic/react';
import { add, businessOutline, chevronDownOutline } from 'ionicons/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOrg, organizations } from '@/contexts/OrgContext';
import { useState, useEffect } from 'react';
import { css } from '@emotion/css';

const headerStyles = css`
  --background: white;
  border-bottom: 1px solid var(--app-border);
`;

const toolbarStyles = css`
  --padding-top: 12px;
  --padding-bottom: 12px;
  --padding-start: 16px;
  --padding-end: 16px;
  
  @media (min-width: 768px) {
    --padding-start: 24px;
    --padding-end: 24px;
  }
`;

const orgSelectorStyles = css`
  display: none;
  
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 16px;
    height: 48px;
    background: white;
    border: 1px solid var(--app-border);
    border-radius: 12px;
    cursor: pointer;
    position: relative;
    transition: background 0.2s ease;

    &:hover {
      background: var(--app-secondary);
    }

    .org-name {
      font-size: 18px;
      font-weight: 500;
      color: var(--app-foreground);
    }
  }
`;

const searchContainerStyles = css`
  flex-grow: 1;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 12px;
  
  @media (min-width: 768px) {
    padding: 0 24px;
  }
`;

const searchBarStyles = css`
  --border-radius: 12px;
  --box-shadow: none;
  --background: var(--app-input-background);
  padding: 0;
`;

const newButtonStyles = css`
  --border-radius: 12px;
  --box-shadow: none;
  height: 48px;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  
  span {
    display: none;
  }
  
  @media (min-width: 768px) {
    span {
      display: inline;
    }
  }
`;

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentOrgId, setCurrentOrgId } = useOrg();
  const [searchText, setSearchText] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setSearchText(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e: any) => {
    const value = e.detail.value!;
    setSearchText(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('q', value);
    else params.delete('q');
    router.push(`/recipes?${params.toString()}`);
  };

  const currentOrg = organizations.find(o => o.id === currentOrgId);

  return (
    <IonHeader className={headerStyles} mode="ios">
      <IonToolbar className={toolbarStyles}>
        <IonButtons slot="start">
          <IonMenuButton color="dark" />
        </IonButtons>

        <div className={searchContainerStyles}>
          <IonSearchbar
            value={searchText}
            onIonInput={handleSearch}
            placeholder="Search recipes..."
            className={searchBarStyles}
            debounce={300}
          />
        </div>

        <IonButtons slot="end">
          <IonButton 
            onClick={() => router.push('/recipes/new')} 
            fill="solid" 
            color="primary"
            className={newButtonStyles}
            data-testid="new-recipe-button"
          >
            <IonIcon slot="icon-only" icon={add} className={css`@media(min-width: 768px) { display: none; }`} />
            <IonIcon slot="start" icon={add} className={css`display: none; @media(min-width: 768px) { display: block; }`} />
            <span>New Recipe</span>
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
}
