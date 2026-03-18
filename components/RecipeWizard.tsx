'use client';

import { 
  IonContent, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonButton, 
  IonTitle, 
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonTextarea,
  IonProgressBar,
  IonFooter
} from '@ionic/react';
import { 
  arrowBackOutline, 
  arrowForwardOutline, 
  addOutline, 
  trashOutline, 
  saveOutline,
  closeOutline
} from 'ionicons/icons';
import { useRouter } from 'next/navigation';
import { useOrg } from '@/contexts/OrgContext';
import { saveRecipe } from '@/app/recipes/actions';
import { useState } from 'react';
import { Recipe } from '@/lib/contract';
import { toast } from 'sonner';
import { css } from '@emotion/css';

const wizardContainerStyles = css`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 24px;
`;

const stepHeaderStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;

  .step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    flex: 1;
    position: relative;

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      top: 20px;
      left: calc(50% + 20px);
      width: calc(100% - 40px);
      height: 2px;
      background: var(--app-border);
    }

    &.active:not(:last-child)::after {
      background: var(--app-primary);
    }
  }

  .circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--app-border);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    z-index: 1;
    transition: all 0.3s ease;
  }

  .circle.active {
    background: var(--app-primary);
  }

  .label {
    font-size: 14px;
    font-weight: 600;
    color: var(--app-muted-foreground);
  }

  .label.active {
    color: var(--app-primary);
  }
`;

const cardStyles = css`
  background: white;
  border: 1px solid var(--app-border);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.02);
`;

const inputGroupStyles = css`
  margin-bottom: 32px;

  label {
    display: block;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 12px;
    color: var(--app-foreground);
  }

  .input-wrapper {
    background: var(--app-input-background);
    border-radius: 12px;
    padding: 4px 16px;
    border: 1px solid transparent;
    transition: all 0.2s ease;

    &:focus-within {
      background: white;
      border-color: var(--app-primary);
      box-shadow: 0 0 0 4px rgba(0,0,0,0.05);
    }
  }

  ion-input, ion-textarea {
    --padding-start: 0;
    --padding-end: 0;
    font-size: 18px;
    font-weight: 500;
  }
`;

const itemRowStyles = css`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  background: var(--app-secondary);
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 16px;
`;

type Step = 'basic' | 'ingredients' | 'instructions' | 'review';

export default function RecipeWizard({ initialData }: RecipeWizardProps) {
  const router = useRouter();
  const { currentOrgId } = useOrg();
  const [step, setStep] = useState<Step>('basic');
  const [title, setTitle] = useState(initialData?.title || '');
  const [yieldAmount, setYieldAmount] = useState(initialData?.yieldAmount?.toString() || '');
  const [yieldUnit, setYieldUnit] = useState(initialData?.yieldUnit || '');
  const [ingredients, setIngredients] = useState<any[]>(
    initialData?.ingredients?.sort((a,b) => a.sortOrder - b.sortOrder).map(i => ({ 
      name: i.name, 
      amount: i.amount.toString(), 
      unit: i.unit 
    })) || [{ name: '', amount: '', unit: '' }]
  );
  const [instructions, setInstructions] = useState<any[]>(
    initialData?.instructions?.sort((a,b) => a.stepNumber - b.stepNumber).map(i => ({ 
      description: i.description 
    })) || [{ description: '' }]
  );

  const steps: { key: Step; label: string }[] = [
    { key: 'basic', label: 'Basic Info' },
    { key: 'ingredients', label: 'Ingredients' },
    { key: 'instructions', label: 'Instructions' },
    { key: 'review', label: 'Review' }
  ];
  
  const currentStepIndex = steps.findIndex(s => s.key === step);

  const handleNext = () => currentStepIndex < steps.length - 1 && setStep(steps[currentStepIndex + 1].key);
  const handleBack = () => currentStepIndex > 0 ? setStep(steps[currentStepIndex - 1].key) : router.push('/recipes');

  const updateIngredient = (index: number, field: string, value: string) => {
    const newIngs = [...ingredients];
    newIngs[index][field] = value;
    setIngredients(newIngs);
  };

  const updateInstruction = (index: number, value: string) => {
    const newInsts = [...instructions];
    newInsts[index].description = value;
    setInstructions(newInsts);
  };

  const handleSave = async () => {
    const recipeData = {
      title,
      yieldAmount: parseFloat(yieldAmount),
      yieldUnit,
      ingredients: ingredients.filter(i => i.name && i.amount).map((i, idx) => ({ ...i, amount: parseFloat(i.amount), sortOrder: idx })),
      instructions: instructions.filter(i => i.description).map((i, idx) => ({ ...i, stepNumber: idx + 1 })),
    };

    try {
      const saved = await saveRecipe(recipeData, currentOrgId, initialData?.id);
      toast.success(initialData ? 'Recipe updated' : 'Recipe created');
      router.push(`/recipes/${saved.id}`);
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border" style={{ borderBottom: '1px solid var(--app-border)' }}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => router.push('/recipes')} fill="clear" color="dark">
              <IonIcon slot="icon-only" icon={closeOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle style={{ fontWeight: 700 }}>{initialData ? 'Edit Recipe' : 'New Recipe'}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light">
        <div className={wizardContainerStyles}>
          <div className={stepHeaderStyles}>
            {steps.map((s, idx) => (
              <div key={s.key} className={`step-item ${idx < currentStepIndex ? 'active' : ''}`}>
                <div className={`circle ${idx <= currentStepIndex ? 'active' : ''}`}>{idx + 1}</div>
                <span className={`label ${idx <= currentStepIndex ? 'active' : ''}`}>{s.label}</span>
              </div>
            ))}
          </div>

          <div className={cardStyles}>
            {step === 'basic' && (
              <div>
                <div className={inputGroupStyles}>
                  <label>Recipe Title</label>
                  <div className="input-wrapper">
                    <IonInput value={title} onIonInput={(e) => setTitle(e.detail.value!)} placeholder="e.g. Grandma's Marinara" />
                  </div>
                </div>
                <IonGrid style={{ padding: 0 }}>
                  <IonRow>
                    <IonCol size="6" style={{ padding: '0 8px 0 0' }}>
                      <div className={inputGroupStyles}>
                        <label>Yield Amount</label>
                        <div className="input-wrapper">
                          <IonInput type="number" value={yieldAmount} onIonInput={(e) => setYieldAmount(e.detail.value!)} placeholder="4" />
                        </div>
                      </div>
                    </IonCol>
                    <IonCol size="6" style={{ padding: '0 0 0 8px' }}>
                      <div className={inputGroupStyles}>
                        <label>Yield Unit</label>
                        <div className="input-wrapper">
                          <IonInput value={yieldUnit} onIonInput={(e) => setYieldUnit(e.detail.value!)} placeholder="Servings" />
                        </div>
                      </div>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </div>
            )}

            {step === 'ingredients' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '24px' }}>Ingredients</h3>
                  <IonButton size="small" fill="outline" onClick={() => setIngredients([...ingredients, { name: '', amount: '', unit: '' }])}>
                    <IonIcon slot="start" icon={addOutline} /> Add
                  </IonButton>
                </div>
                {ingredients.map((ing, idx) => (
                  <div key={idx} className={itemRowStyles}>
                    <div style={{ flex: 1 }}>
                      <IonInput value={ing.name} onIonInput={(e) => updateIngredient(idx, 'name', e.detail.value!)} placeholder="Salt" />
                    </div>
                    <div style={{ width: '80px' }}>
                      <IonInput type="number" value={ing.amount} onIonInput={(e) => updateIngredient(idx, 'amount', e.detail.value!)} placeholder="1" />
                    </div>
                    <div style={{ width: '80px' }}>
                      <IonInput value={ing.unit} onIonInput={(e) => updateIngredient(idx, 'unit', e.detail.value!)} placeholder="tsp" />
                    </div>
                    <IonButton color="danger" fill="clear" onClick={() => setIngredients(ingredients.filter((_, i) => i !== idx))}>
                      <IonIcon slot="icon-only" icon={trashOutline} />
                    </IonButton>
                  </div>
                ))}
              </div>
            )}

            {step === 'instructions' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '24px' }}>Instructions</h3>
                  <IonButton size="small" fill="outline" onClick={() => setInstructions([...instructions, { description: '' }])}>
                    <IonIcon slot="start" icon={addOutline} /> Add Step
                  </IonButton>
                </div>
                {instructions.map((inst, idx) => (
                  <div key={idx} className={itemRowStyles} style={{ alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--app-primary)', color: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                      <div style={{ width: '100%', textAlign: 'center' }}>{idx + 1}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <IonTextarea value={inst.description} onIonInput={(e) => updateInstruction(idx, e.detail.value!)} placeholder="Describe step..." autoGrow />
                    </div>
                    <IonButton color="danger" fill="clear" onClick={() => setInstructions(instructions.filter((_, i) => i !== idx))}>
                      <IonIcon slot="icon-only" icon={trashOutline} />
                    </IonButton>
                  </div>
                ))}
              </div>
            )}

            {step === 'review' && (
              <div style={{ border: '2px solid var(--app-secondary)', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ fontSize: '28px', marginBottom: '8px' }}>{title}</h3>
                <p style={{ color: 'var(--app-muted-foreground)', marginBottom: '24px' }}>Yields {yieldAmount} {yieldUnit}</p>
                <div style={{ height: '1px', background: 'var(--app-border)', marginBottom: '24px' }} />
                <p style={{ fontWeight: 700, marginBottom: '8px' }}>{ingredients.filter(i => i.name).length} Ingredients • {instructions.filter(i => i.description).length} Steps</p>
              </div>
            )}
          </div>
        </div>
      </IonContent>

      <IonFooter className="ion-no-border" style={{ background: 'white', padding: '24px', borderTop: '1px solid var(--app-border)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '16px' }}>
          <IonButton fill="clear" color="dark" onClick={handleBack} style={{ flex: 1, height: '56px', fontSize: '18px', fontWeight: 700 }}>
            <IonIcon slot="start" icon={arrowBackOutline} /> {currentStepIndex === 0 ? 'Cancel' : 'Back'}
          </IonButton>
          <IonButton onClick={step === 'review' ? handleSave : handleNext} style={{ flex: 1, height: '56px', fontSize: '18px', fontWeight: 700 }}>
            {step === 'review' ? 'Save Recipe' : 'Next Step'} <IonIcon slot="end" icon={step === 'review' ? saveOutline : arrowForwardOutline} />
          </IonButton>
        </div>
      </IonFooter>
    </IonPage>
  );
}

interface RecipeWizardProps {
  initialData?: Recipe;
}
