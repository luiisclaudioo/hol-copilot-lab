import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ReviewModal from './ReviewModal';
import { Product } from '../types';

const product: Product = {
    id: '1',
    name: 'Apple',
    price: 1.99,
    image: 'apple.jpg',
    reviews: [{ author: 'Ana', comment: 'Great fruit', date: '2025-01-01T00:00:00.000Z' }],
    inStock: true
};

describe('ReviewModal', () => {
    it('renders nothing when no product is selected', () => {
        const { container } = render(
            <ReviewModal product={null} onClose={vi.fn()} onSubmit={vi.fn()} />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('renders existing reviews and submits a new review', () => {
        const onSubmit = vi.fn();
        render(<ReviewModal product={product} onClose={vi.fn()} onSubmit={onSubmit} />);

        expect(screen.getByText('Reviews for Apple')).toBeInTheDocument();
        expect(screen.getByText('Great fruit')).toBeInTheDocument();
        fireEvent.change(screen.getByPlaceholderText('Your name'), {
            target: { value: 'Luis' }
        });
        fireEvent.change(screen.getByPlaceholderText('Your review'), {
            target: { value: 'Fresh and tasty' }
        });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({ author: 'Luis', comment: 'Fresh and tasty' })
        );
        expect(screen.getByPlaceholderText('Your name')).toHaveValue('');
        expect(screen.getByPlaceholderText('Your review')).toHaveValue('');
    });

    it('shows the empty review state and supports close handlers', () => {
        const onClose = vi.fn();
        const emptyProduct = { ...product, reviews: [] };
        render(<ReviewModal product={emptyProduct} onClose={onClose} onSubmit={vi.fn()} />);

        expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Close' }));
        expect(onClose).toHaveBeenCalledOnce();

        fireEvent.click(screen.getByText('Reviews for Apple').parentElement?.parentElement as HTMLElement);
        expect(onClose).toHaveBeenCalledTimes(2);
    });

    it('does not close when clicking inside the modal content', () => {
        const onClose = vi.fn();
        render(<ReviewModal product={product} onClose={onClose} onSubmit={vi.fn()} />);

        fireEvent.click(screen.getByText('Leave a Review'));
        expect(onClose).not.toHaveBeenCalled();
    });
});
