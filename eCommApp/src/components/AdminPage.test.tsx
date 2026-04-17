import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminPage from './AdminPage';

vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>,
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>,
}));

const renderAdminPage = () => {
    return render(
        <MemoryRouter>
            <AdminPage />
        </MemoryRouter>
    );
};

describe('AdminPage', () => {
    it('renders with default no sale state', () => {
        renderAdminPage();

        expect(screen.getByText('Welcome to the admin portal.')).toBeInTheDocument();
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
        expect(screen.getByLabelText('Set Sale Percent (% off for all items):')).toHaveValue('0');
    });

    it('applies a valid sale percentage', () => {
        renderAdminPage();

        fireEvent.change(screen.getByLabelText('Set Sale Percent (% off for all items):'), {
            target: { value: '25' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText('All products are 25% off!')).toBeInTheDocument();
    });

    it('shows error for invalid sale input', () => {
        renderAdminPage();

        fireEvent.change(screen.getByLabelText('Set Sale Percent (% off for all items):'), {
            target: { value: 'not-a-number' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText(/Invalid input/)).toBeInTheDocument();
        expect(screen.getByText(/Please enter a valid number\./)).toBeInTheDocument();
    });

    it('ends sale and resets form state', () => {
        renderAdminPage();

        const saleInput = screen.getByLabelText('Set Sale Percent (% off for all items):');

        fireEvent.change(saleInput, { target: { value: '15' } });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
        expect(screen.getByText('All products are 15% off!')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'End Sale' }));

        expect(screen.getByText('No sale active.')).toBeInTheDocument();
        expect(saleInput).toHaveValue('0');
    });
});
