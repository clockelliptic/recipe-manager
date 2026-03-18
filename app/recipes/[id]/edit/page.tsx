'use client';

import RecipeWizard from '@/components/RecipeWizard';
import { useParams, useRouter } from 'next/navigation';
import { useOrg } from '@/contexts/OrgContext';
import { useEffect, useState } from 'react';
import { Recipe } from '@/lib/contract';
import { IonPage, IonSpinner } from '@ionic/react';
import { toast } from 'sonner';
import { getRecipeById } from '../../actions';
import { css } from '@emotion/css';

const loadingContainerStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export default function EditRecipePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { currentOrgId } = useOrg();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const data = await getRecipeById(id, currentOrgId);
        if (data) {
          setRecipe(data);
        } else {
          toast.error('Recipe not found or access denied');
          router.push('/recipes');
        }
      } catch (error) {
        console.error('Failed to fetch recipe:', error);
        toast.error('Error loading recipe');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, currentOrgId, router]);

  if (loading) {
    return (
      <IonPage>
        <div className={loadingContainerStyles}>
          <IonSpinner name="crescent" />
        </div>
      </IonPage>
    );
  }

  if (!recipe) return null;

  return <RecipeWizard initialData={recipe} />;
}
