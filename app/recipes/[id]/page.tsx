'use client';

import { 
  IonContent, 
  IonPage, 
  IonIcon,
  IonAlert,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { arrowBackOutline, createOutline, trashOutline, restaurantOutline } from 'ionicons/icons';
import { useRouter, useParams } from 'next/navigation';
import { useOrg } from '@/contexts/OrgContext';
import { getRecipeById, deleteRecipe } from '../actions';
import { useEffect, useState } from 'react';
import { Recipe } from '@/lib/contract';
import { toast } from 'sonner';
import { css } from '@emotion/css';

const topNavStyles = css`
  background: white;
  border-bottom: 1px solid var(--app-border);
  position: sticky;
  top: 0;
  z-index: 50;
  height: 80px;
  display: flex;
  align-items: center;
`;

const navContainerStyles = css`
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const backButtonStyles = css`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: var(--app-muted-foreground);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: var(--app-foreground);
  }
`;

const actionButtonStyles = css`
  height: 48px;
  padding: 0 24px;
  border-radius: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const contentContainerStyles = css`
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 24px;
`;

const titleStyles = css`
  font-size: 64px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 24px;
`;

const metaStyles = css`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  color: var(--app-muted-foreground);
  font-weight: 500;
  margin-bottom: 48px;
`;

const sectionCardStyles = css`
  background: white;
  border: 1px solid var(--app-border);
  border-radius: 32px;
  padding: 40px;
  height: 100%;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);

  h2 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 32px;
    padding-bottom: 16px;
    border-bottom: 2px solid var(--app-secondary);
  }
`;

const ingredientRowStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 16px 0;
  border-bottom: 1px solid var(--app-secondary);
  font-size: 22px;

  &:last-child {
    border-bottom: none;
  }

  .name {
    color: var(--app-foreground);
    font-weight: 500;
  }

  .amount {
    font-weight: 700;
    color: var(--app-primary);
    white-space: nowrap;
  }
`;

const instructionRowStyles = css`
  display: flex;
  gap: 24px;
  margin-bottom: 40px;

  &:last-child {
    margin-bottom: 0;
  }

  .step-number {
    flex-shrink: 0;
    width: 56px;
    height: 56px;
    background: var(--app-primary);
    color: white;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 800;
  }

  .text {
    font-size: 22px;
    line-height: 1.5;
    color: #3a3a3c;
    font-weight: 500;
    padding-top: 8px;
  }
`;

export default function KitchenView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { currentOrgId } = useOrg();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const data = await getRecipeById(id, currentOrgId);
        if (data) setRecipe(data);
        else router.push('/recipes');
      } catch (error) {
        toast.error('Error loading recipe');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id, currentOrgId, router]);

  const handleDelete = async () => {
    try {
      await deleteRecipe(id, currentOrgId);
      toast.success('Recipe deleted');
      router.push('/recipes');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return <IonPage><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><IonSpinner /></div></IonPage>;
  }

  if (!recipe) return null;

  return (
    <IonPage>
      <div className={topNavStyles}>
        <div className={navContainerStyles}>
          <button onClick={() => router.push('/recipes')} className={backButtonStyles}>
            <IonIcon icon={arrowBackOutline} />
            Back to Recipes
          </button>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => router.push(`/recipes/${id}/edit`)}
              className={css`
                ${actionButtonStyles};
                background: white;
                border: 1px solid var(--app-border);
                color: var(--app-foreground);
                &:hover { background: var(--app-secondary); }
              `}
            >
              <IonIcon icon={createOutline} />
              Edit
            </button>
            <button 
              onClick={() => setShowAlert(true)}
              className={css`
                ${actionButtonStyles};
                background: #fff5f5;
                border: 1px solid #ffebeb;
                color: #e53e3e;
                &:hover { background: #fff0f0; }
              `}
            >
              <IonIcon icon={trashOutline} />
              Delete
            </button>
          </div>
        </div>
      </div>

      <IonContent color="light">
        <div className={contentContainerStyles}>
          <div style={{ marginBottom: '48px' }}>
            <h1 className={titleStyles}>{recipe.title}</h1>
            <div className={metaStyles}>
              <IonIcon icon={restaurantOutline} style={{ fontSize: '32px' }} />
              <span>Yields: {recipe.yieldAmount} {recipe.yieldUnit}</span>
            </div>
          </div>

          <IonGrid style={{ padding: 0 }}>
            <IonRow style={{ gap: '32px', flexWrap: 'nowrap' }}>
              <IonCol size="12" sizeLg="5" style={{ padding: 0 }}>
                <div className={sectionCardStyles}>
                  <h2>Ingredients</h2>
                  <div>
                    {recipe.ingredients.sort((a,b) => a.sortOrder - b.sortOrder).map((ing, idx) => (
                      <div key={idx} className={ingredientRowStyles}>
                        <span className="name">{ing.name}</span>
                        <span className="amount">{ing.amount} {ing.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </IonCol>

              <IonCol size="12" sizeLg="7" style={{ padding: 0 }}>
                <div className={sectionCardStyles}>
                  <h2>Instructions</h2>
                  <div>
                    {recipe.instructions.sort((a,b) => a.stepNumber - b.stepNumber).map((inst, idx) => (
                      <div key={idx} className={instructionRowStyles}>
                        <div className="step-number">{inst.stepNumber}</div>
                        <p className="text">{inst.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Delete Recipe?"
          message={`Are you sure you want to delete "${recipe.title}"? This action cannot be undone.`}
          buttons={[
            { text: 'Cancel', role: 'cancel' },
            { text: 'Delete', role: 'destructive', handler: handleDelete }
          ]}
        />
      </IonContent>
    </IonPage>
  );
}
