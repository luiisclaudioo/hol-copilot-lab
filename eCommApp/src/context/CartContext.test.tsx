import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useContext } from 'react';
import { describe, expect, it } from 'vitest';
import { CartProvider, CartContext } from './CartContext';
import { Product } from '../types';

const product: Product = {
    id: 'product-1',
    name: 'Apple',
    price: 2.5,
    image: 'apple.jpg',
    reviews: [],
    inStock: true
};

const TestCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('CartContext must be used within a CartProvider');
    }
    return (
        <>
            <p data-testid="count">{context.cartItems.length}</p>
            <p data-testid="quantity">{context.cartItems[0]?.quantity ?? 0}</p>
            <button onClick={() => context.addToCart(product)}>Add</button>
            <button onClick={context.clearCart}>Clear</button>
        </>
    );
};

describe('CartProvider', () => {
    it('starts empty, adds a product, increments duplicates, and clears', async () => {
        const user = userEvent.setup();
        render(
            <CartProvider>
                <TestCart />
            </CartProvider>
        );

        expect(screen.getByTestId('count')).toHaveTextContent('0');
        await user.click(screen.getByRole('button', { name: 'Add' }));
        expect(screen.getByTestId('count')).toHaveTextContent('1');
        expect(screen.getByTestId('quantity')).toHaveTextContent('1');

        await user.click(screen.getByRole('button', { name: 'Add' }));
        expect(screen.getByTestId('quantity')).toHaveTextContent('2');

        await user.click(screen.getByRole('button', { name: 'Clear' }));
        expect(screen.getByTestId('count')).toHaveTextContent('0');
    });
});
