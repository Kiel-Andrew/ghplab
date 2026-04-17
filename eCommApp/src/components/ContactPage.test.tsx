import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ContactPage from './ContactPage';

vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>,
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>,
}));

describe('ContactPage', () => {
    it('renders contact form fields and submit button', () => {
        render(<ContactPage />);

        expect(screen.getByRole('heading', { name: 'Contact Us' })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Your Email Address')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Your Issue')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('accepts input and clears on submit without saving', () => {
        render(<ContactPage />);

        const nameInput = screen.getByPlaceholderText('Your Name') as HTMLInputElement;
        const emailInput = screen.getByPlaceholderText('Your Email Address') as HTMLInputElement;
        const issueInput = screen.getByPlaceholderText('Your Issue') as HTMLTextAreaElement;

        fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
        fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
        fireEvent.change(issueInput, { target: { value: 'Need help with an order.' } });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

        expect(nameInput.value).toBe('');
        expect(emailInput.value).toBe('');
        expect(issueInput.value).toBe('');
    });
});
