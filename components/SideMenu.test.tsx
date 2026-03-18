import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SideMenu from './SideMenu';
import { OrgProvider } from '@/contexts/OrgContext';
import React from 'react';

// Mock Ionic components to avoid ESM/CJS issues with internal Ionic dependencies
vi.mock('@ionic/react', () => ({
  IonMenu: ({ children }: any) => <div data-testid="ion-menu">{children}</div>,
  IonHeader: ({ children }: any) => <header>{children}</header>,
  IonToolbar: ({ children }: any) => <div>{children}</div>,
  IonTitle: ({ children }: any) => <h1>{children}</h1>,
  IonContent: ({ children }: any) => <main>{children}</main>,
  IonList: ({ children }: any) => <ul>{children}</ul>,
  IonItem: ({ children, onClick }: any) => <li onClick={onClick}>{children}</li>,
  IonIcon: () => <span />,
  IonLabel: ({ children }: any) => <span>{children}</span>,
  IonMenuToggle: ({ children }: any) => <div>{children}</div>,
  IonNote: ({ children }: any) => <small>{children}</small>,
}));

// Mock icons
vi.mock('ionicons/icons', () => ({
  businessOutline: '',
  checkmarkCircleOutline: '',
  restaurantOutline: '',
  addOutline: '',
}));

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('SideMenu', () => {
  it('renders the application title and organization note', () => {
    render(
      <OrgProvider>
        <SideMenu />
      </OrgProvider>
    );
    
    expect(screen.getByText('Recipe Manager')).toBeInTheDocument();
    expect(screen.getByText('Switch Organization')).toBeInTheDocument();
  });

  it('renders the navigation links', () => {
    render(
      <OrgProvider>
        <SideMenu />
      </OrgProvider>
    );
    
    expect(screen.getByText('Create New')).toBeInTheDocument();
  });
});
