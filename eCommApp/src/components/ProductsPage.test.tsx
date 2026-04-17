import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CartContext } from '../context/CartContext';
import ProductsPage from './ProductsPage';
import { Product, Review } from '../types';

vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>,
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock('./ReviewModal', () => ({
    default: ({ product, onClose, onSubmit }: { product: Product | null; onClose: () => void; onSubmit: (review: Review) => void }) => (
        <div data-testid="review-modal">
            <span>{product ? `selected:${product.name}` : 'selected:none'}</span>
            <button onClick={onClose}>Close Review</button>
            <button
                onClick={() =>
                    onSubmit({ author: 'Test User', comment: 'Great product', date: '2026-01-01T00:00:00.000Z' })
                }
            >
                Submit Review
            </button>
        </div>
    ),
}));

const apple: Product = {
    id: 'apple-1',
    name: 'Apple',
    price: 1.99,
    description: 'Fresh apple',
    image: 'apple.jpg',
    reviews: [],
    inStock: true,
};

const grapes: Product = {
    id: 'grapes-1',
    name: 'Grapes',
    price: 2.99,
    description: 'Seedless grapes',
    image: 'grapes.jpg',
    reviews: [],
    inStock: false,
};

const orange: Product = {
    id: 'orange-1',
    name: 'Orange',
    price: 1.49,
    description: 'Juicy orange',
    image: 'orange.jpg',
    reviews: [],
    inStock: true,
};

const pear: Product = {
    id: 'pear-1',
    name: 'Pear',
    price: 2.49,
    description: 'Sweet pear',
    image: 'pear.jpg',
    reviews: [],
    inStock: true,
};

const productMap: Record<string, Product> = {
    'products/apple.json': apple,
    'products/grapes.json': grapes,
    'products/orange.json': orange,
    'products/pear.json': pear,
};

const addToCart = vi.fn();

const renderProductsPage = () => {
    return render(
        <CartContext.Provider value={{ cartItems: [], addToCart, clearCart: vi.fn() }}>
            <ProductsPage />
        </CartContext.Provider>
    );
};

describe('ProductsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.stubGlobal(
            'fetch',
            vi.fn(async (url: string) => {
                const data = productMap[url];
                if (!data) {
                    return {
                        ok: false,
                        json: async () => ({}),
                    } as Response;
                }
                return {
                    ok: true,
                    json: async () => data,
                } as Response;
            })
        );
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('shows loading state before products load', () => {
        renderProductsPage();

        expect(screen.getByText('Loading products...')).toBeInTheDocument();
    });

    it('loads and renders products from json files', async () => {
        renderProductsPage();

        expect(await screen.findByRole('heading', { name: 'Our Products' })).toBeInTheDocument();
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Grapes')).toBeInTheDocument();
        expect(screen.getByText('Orange')).toBeInTheDocument();
        expect(screen.getByText('Pear')).toBeInTheDocument();
        expect(global.fetch).toHaveBeenCalledTimes(4);
    });

    it('adds in-stock product to cart and disables out-of-stock product button', async () => {
        renderProductsPage();

        await screen.findByRole('heading', { name: 'Our Products' });

        const addToCartButtons = screen.getAllByRole('button', { name: 'Add to Cart' });
        fireEvent.click(addToCartButtons[0]);
        expect(addToCart).toHaveBeenCalledWith(apple);

        const outOfStockButton = screen.getByRole('button', { name: 'Out of Stock' });
        expect(outOfStockButton).toBeDisabled();
    });

    it('opens review modal when product image is clicked and handles review submit', async () => {
        renderProductsPage();

        await screen.findByRole('heading', { name: 'Our Products' });

        fireEvent.click(screen.getByAltText('Apple'));
        expect(screen.getByText('selected:Apple')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Submit Review' }));

        await waitFor(() => {
            expect(screen.getByText('selected:Apple')).toBeInTheDocument();
        });
    });

    it('handles fetch failures and exits loading state', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.stubGlobal(
            'fetch',
            vi.fn(async () => ({
                ok: false,
                json: async () => ({}),
            }))
        );

        renderProductsPage();

        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });

        expect(screen.getByRole('heading', { name: 'Our Products' })).toBeInTheDocument();
        expect(consoleErrorSpy).toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
    });
});
