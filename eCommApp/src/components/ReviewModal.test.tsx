import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReviewModal from './ReviewModal';
import { Product } from '../types';

const baseProduct: Product = {
    id: 'apple-1',
    name: 'Apple',
    price: 1.99,
    description: 'Fresh and crisp',
    image: 'apple.jpg',
    reviews: [],
    inStock: true,
};

describe('ReviewModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns null when product is not provided', () => {
        const { container } = render(
            <ReviewModal product={null} onClose={vi.fn()} onSubmit={vi.fn()} />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('renders product title and no reviews message when review list is empty', () => {
        render(
            <ReviewModal product={baseProduct} onClose={vi.fn()} onSubmit={vi.fn()} />
        );

        expect(screen.getByRole('heading', { name: 'Reviews for Apple' })).toBeInTheDocument();
        expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
    });

    it('renders existing reviews', () => {
        const productWithReviews: Product = {
            ...baseProduct,
            reviews: [
                {
                    author: 'Jane',
                    comment: 'Loved it!',
                    date: '2026-01-01T00:00:00.000Z',
                },
            ],
        };

        render(
            <ReviewModal product={productWithReviews} onClose={vi.fn()} onSubmit={vi.fn()} />
        );

        expect(screen.getByText('Jane')).toBeInTheDocument();
        expect(screen.getByText('Loved it!')).toBeInTheDocument();
    });

    it('submits a new review with author, comment, and generated date', () => {
        const onSubmit = vi.fn();

        render(
            <ReviewModal product={baseProduct} onClose={vi.fn()} onSubmit={onSubmit} />
        );

        fireEvent.change(screen.getByPlaceholderText('Your name'), {
            target: { value: 'Alex' },
        });
        fireEvent.change(screen.getByPlaceholderText('Your review'), {
            target: { value: 'Amazing quality' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                author: 'Alex',
                comment: 'Amazing quality',
                date: expect.any(String),
            })
        );
    });

    it('closes modal on backdrop click and close button click', () => {
        const onClose = vi.fn();

        const { container } = render(
            <ReviewModal product={baseProduct} onClose={onClose} onSubmit={vi.fn()} />
        );

        const backdrop = container.querySelector('.modal-backdrop') as HTMLElement;
        fireEvent.click(backdrop);
        fireEvent.click(screen.getByRole('button', { name: 'Close' }));

        expect(onClose).toHaveBeenCalledTimes(2);
    });

    it('does not close modal when modal content is clicked', () => {
        const onClose = vi.fn();

        const { container } = render(
            <ReviewModal product={baseProduct} onClose={onClose} onSubmit={vi.fn()} />
        );

        const modalContent = container.querySelector('.modal-content') as HTMLElement;
        fireEvent.click(modalContent);

        expect(onClose).not.toHaveBeenCalled();
    });
});
