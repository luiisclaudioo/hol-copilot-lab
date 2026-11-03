import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import ProductsPage from './ProductsPage';
import { CartContext } from '../context/CartContext';
import { Product } from '../types';

const products: Product[] = [
    {
        id: 'apple',
        name: 'Apple',
        price: 1.5,
        description: 'Fresh apple',
        image: 'apple.jpg',
        reviews: [],
        inStock: true
    },
    {
        id: 'pear',
        name: 'Pear',
        price: 2,
        reviews: [{ author: 'Ana', comment: 'Great', date: '2025-01-01T00:00:00.000Z' }],
        inStock: false
    }
];

const addToCart = vi.fn();

const renderProductsPage = () =>
    render(
        <MemoryRouter>
            <CartContext.Provider value={{ cartItems: [], addToCart, clearCart: vi.fn() }}>
                <ProductsPage />
            </CartContext.Provider>
        </MemoryRouter>
    );

describe('ProductsPage', () => {
    beforeEach(() => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockImplementation((file: string) =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(file.includes('apple') ? products[0] : products[1])
                })
            )
        );
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.clearAllMocks();
    });

    it('shows loading and then renders loaded products', async () => {
        renderProductsPage();

        expect(screen.getByText('Loading products...')).toBeInTheDocument();
        expect(await screen.findByText('Our Products')).toBeInTheDocument();
        expect(screen.getAllByText('Apple')).toHaveLength(1);
        expect(screen.getAllByText('Pear')).toHaveLength(3);
        expect(screen.getAllByText('Fresh apple')).toHaveLength(1);
        expect(screen.getAllByRole('button', { name: 'Add to Cart' })).toHaveLength(1);
        expect(screen.getAllByRole('button', { name: 'Out of Stock' })).toHaveLength(3);
        expect(fetch).toHaveBeenCalledTimes(4);
    });

    it('adds an in-stock product and does not add an out-of-stock product', async () => {
        const user = userEvent.setup();
        renderProductsPage();
        await screen.findByText('Our Products');

        await user.click(screen.getAllByRole('button', { name: 'Add to Cart' })[0]);
        expect(addToCart).toHaveBeenCalledWith(products[0]);

        expect(screen.getAllByRole('button', { name: 'Out of Stock' })[0]).toBeDisabled();
    });

    it('opens a review modal, submits a review, and closes it', async () => {
        renderProductsPage();
        await screen.findByText('Our Products');

        fireEvent.click(screen.getAllByRole('img', { name: 'Apple' })[0]);
        expect(screen.getByText('Reviews for Apple')).toBeInTheDocument();
        expect(screen.getByText('No reviews yet.')).toBeInTheDocument();

        fireEvent.change(screen.getByPlaceholderText('Your name'), {
            target: { value: 'Luis' }
        });
        fireEvent.change(screen.getByPlaceholderText('Your review'), {
            target: { value: 'Excellent' }
        });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
        expect(screen.getByText('Excellent')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Close' }));
        expect(screen.queryByText('Reviews for Apple')).not.toBeInTheDocument();
    });

    it('closes the review modal from the backdrop', async () => {
        renderProductsPage();
        await screen.findByText('Our Products');

        fireEvent.click(screen.getAllByRole('img', { name: 'Apple' })[0]);
        fireEvent.click(screen.getByRole('heading', { name: 'Reviews for Apple' }).parentElement?.parentElement as HTMLElement);

        await waitFor(() => {
            expect(screen.queryByText('Reviews for Apple')).not.toBeInTheDocument();
        });
    });

    it('logs a fetch error and finishes loading when products cannot be loaded', async () => {
        const error = new Error('network failure');
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(error));
        renderProductsPage();

        await waitFor(() => expect(screen.getByText('Our Products')).toBeInTheDocument());
        expect(consoleError).toHaveBeenCalledWith('Error loading products:', error);
        consoleError.mockRestore();
    });

    it('throws when rendered without a cart context', () => {
        expect(() =>
            render(
                <MemoryRouter>
                    <ProductsPage />
                </MemoryRouter>
            )
        ).toThrowError('CartContext must be used within a CartProvider');
    });
});
