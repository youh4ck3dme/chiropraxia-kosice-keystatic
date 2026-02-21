import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ServiceCard } from '../../components/react/ServiceCard';

describe('ServiceCard', () => {
  const mockProps = {
    id: '1',
    name: 'Vstupné vyšetrenie',
    description: 'Komplexné vyšetrenie nového pacienta',
    duration: 30,
    price: 35,
    isSelected: false,
    onSelect: vi.fn(),
  };

  it('renders service details correctly', () => {
    render(<ServiceCard {...mockProps} />);
    
    expect(screen.getByText('Vstupné vyšetrenie')).toBeDefined();
    expect(screen.getByText('Komplexné vyšetrenie nového pacienta')).toBeDefined();
    expect(screen.getByText('30 min')).toBeDefined();
    expect(screen.getByText('35€')).toBeDefined();
  });

  it('calls onSelect when clicked', () => {
    render(<ServiceCard {...mockProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockProps.onSelect).toHaveBeenCalled();
  });

  it('shows selected state styling', () => {
    const { container } = render(<ServiceCard {...mockProps} isSelected={true} />);
    // The button itself should have the ring class
    const button = container.querySelector('button');
    expect(button?.className).toContain('ring-2');
  });
});


