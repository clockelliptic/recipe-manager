import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock problematic CSS packages that cause ESM/CJS issues in Node 20
vi.mock('@csstools/css-calc', () => ({
  calc: () => '',
  default: () => ''
}));

vi.mock('@asamuzakjp/css-color', () => ({
  default: () => ''
}));
