'use client';

import { 
  IonContent, 
  IonPage, 
  IonRefresher, 
  IonRefresherContent,
  IonSpinner
} from '@ionic/react';
import Header from '@/components/Header';
import RecipeList from '@/components/RecipeList';
import { useOrg } from '@/contexts/OrgContext';
import { getRecipes } from './actions';
import { useEffect, useState } from 'react';
import { Recipe } from '@/lib/contract';
import { useSearchParams } from 'next/navigation';
import { css } from '@emotion/css';

const spinnerContainerStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
`;

export default function Dashboard() {
  const { currentOrgId } = useOrg();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const data = await getRecipes(currentOrgId, query);
      setRecipes(data);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [currentOrgId, query]);

  const handleRefresh = async (event: CustomEvent) => {
    await fetchRecipes();
    event.detail.complete();
  };

  return (
    <IonPage>
      <Header />
      <IonContent color="light">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {loading ? (
          <div className={spinnerContainerStyles}>
            <IonSpinner name="crescent" color="primary" />
          </div>
        ) : (
          <RecipeList recipes={recipes} searchQuery={query} />
        )}
      </IonContent>
    </IonPage>
  );
}
