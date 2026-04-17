import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from './LoginPage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>,
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>,
}));

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders login form', () => {
        render(<LoginPage />);

        expect(screen.getByRole('heading', { name: 'Admin Login' })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });

    it('shows error for invalid credentials', () => {
        render(<LoginPage />);

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'user' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrong' } });
        fireEvent.click(screen.getByRole('button', { name: 'Login' }));

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('navigates to admin and clears form for valid credentials', () => {
        render(<LoginPage />);

        const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement;
        const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;

        fireEvent.change(usernameInput, { target: { value: 'admin' } });
        fireEvent.change(passwordInput, { target: { value: 'admin' } });
        fireEvent.click(screen.getByRole('button', { name: 'Login' }));

        expect(mockNavigate).toHaveBeenCalledWith('/admin');
        expect(usernameInput.value).toBe('');
        expect(passwordInput.value).toBe('');
        expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });
});
