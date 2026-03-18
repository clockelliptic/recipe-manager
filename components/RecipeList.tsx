'use client';

import { 
  IonGrid, 
  IonRow, 
  IonCol,
  IonIcon,
  IonText
} from '@ionic/react';
import { bookOutline, timeOutline, restaurantOutline } from 'ionicons/icons';
import { useRouter } from 'next/navigation';
import { Recipe } from '@/lib/contract';
import { css } from '@emotion/css';

const containerStyles = css`
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px;
`;

const gridStyles = css`
  --ion-grid-padding: 0;
`;

const colStyles = css`
  padding: 12px;
`;

const cardStyles = css`
  background: white;
  border: 1px solid var(--app-border);
  border-radius: 20px;
  padding: 32px;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: #d1d1d6;
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.04);
  }

  .title {
    font-size: 24px;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--app-muted-foreground);
    font-size: 18px;
    margin-bottom: 12px;
  }

  .stats {
    display: flex;
    align-items: center;
    gap: 16px;
    color: #8e8e93;
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 24px;
  }

  .footer {
    margin-top: auto;
    padding-top: 24px;
    border-top: 1px solid var(--app-secondary);
    display: flex;
    gap: 12px;
  }
`;

const secondaryButtonStyles = css`
  flex: 1;
  height: 48px;
  background: var(--app-secondary);
  color: var(--app-foreground);
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const outlineButtonStyles = css`
  flex: 1;
  height: 48px;
  background: white;
  color: var(--app-foreground);
  border: 1px solid var(--app-border);
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;

  &:hover {
    background: var(--app-secondary);
  }
`;

export default function RecipeList({ recipes, searchQuery }: RecipeListProps) {
  const router = useRouter();

  if (recipes.length === 0) {
    return (
      <div className={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 80px 24px;
        text-align: center;
      `}>
        <IonIcon icon={restaurantOutline} style={{ fontSize: '80px', color: 'var(--app-muted)', marginBottom: '24px' }} />
        <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
          {searchQuery ? 'No recipes found' : 'No recipes yet'}
        </h2>
        <p style={{ color: 'var(--app-muted-foreground)', fontSize: '18px' }}>
          {searchQuery 
            ? `No recipes match "${searchQuery}"`
            : 'Start by creating your first recipe using the "New Recipe" button.'}
        </p>
      </div>
    );
  }

  return (
    <div className={containerStyles}>
      {searchQuery && (
        <p style={{ fontSize: '18px', color: 'var(--app-muted-foreground)', marginBottom: '32px' }}>
          {recipes.length} {recipes.length === 1 ? 'result' : 'results'} for "{searchQuery}"
        </p>
      )}
      
      <IonGrid className={gridStyles}>
        <IonRow>
          {recipes.map((recipe) => (
            <IonCol size="12" sizeMd="6" sizeLg="4" key={recipe.id} className={colStyles}>
              <div 
                className={`${cardStyles} recipe-card`}
                onClick={() => router.push(`/recipes/${recipe.id}`)}
              >
                <h3 className="title">{recipe.title}</h3>
                
                <div className="meta">
                  <IonIcon icon={restaurantOutline} style={{ fontSize: '20px' }} />
                  <span>Yields {recipe.yieldAmount} {recipe.yieldUnit}</span>
                </div>

                <div className="stats">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <IonIcon icon={bookOutline} />
                    {recipe.instructions.length} steps
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <IonIcon icon={timeOutline} />
                    {recipe.ingredients.length} ingredients
                  </span>
                </div>

                <div className="footer">
                  <button 
                    onClick={(e) => { e.stopPropagation(); router.push(`/recipes/${recipe.id}`); }}
                    className={secondaryButtonStyles}
                  >
                    View
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); router.push(`/recipes/${recipe.id}/edit`); }}
                    className={outlineButtonStyles}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    </div>
  );
}

interface RecipeListProps {
  recipes: Recipe[];
  searchQuery?: string;
}
