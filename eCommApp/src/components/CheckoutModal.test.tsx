import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CheckoutModal from './CheckoutModal';

describe('CheckoutModal', () => {
    it('renders modal content and actions', () => {
        render(<CheckoutModal onConfirm={vi.fn()} onCancel={vi.fn()} />);

        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
        expect(screen.getByText('Do you want to proceed with the checkout?')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Continue Checkout' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Return to cart' })).toBeInTheDocument();
    });

    it('calls onConfirm when continue checkout is clicked', () => {
        const onConfirm = vi.fn();
        const onCancel = vi.fn();

        render(<CheckoutModal onConfirm={onConfirm} onCancel={onCancel} />);

        fireEvent.click(screen.getByRole('button', { name: 'Continue Checkout' }));

        expect(onConfirm).toHaveBeenCalledTimes(1);
        expect(onCancel).not.toHaveBeenCalled();
    });

    it('calls onCancel when return to cart is clicked', () => {
        const onConfirm = vi.fn();
        const onCancel = vi.fn();

        render(<CheckoutModal onConfirm={onConfirm} onCancel={onCancel} />);

        fireEvent.click(screen.getByRole('button', { name: 'Return to cart' }));

        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(onConfirm).not.toHaveBeenCalled();
    });
});
