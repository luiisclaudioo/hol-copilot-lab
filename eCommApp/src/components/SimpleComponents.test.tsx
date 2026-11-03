import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from '../App';
import Footer from './Footer';
import Header from './Header';
import HomePage from './HomePage';

describe('simple components', () => {
    it('renders the header navigation and footer copyright', () => {
        render(
            <MemoryRouter>
                <Header />
                <Footer />
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { name: 'The Daily Harvest' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
        expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products');
        expect(screen.getByRole('link', { name: 'Cart' })).toHaveAttribute('href', '/cart');
        expect(screen.getByRole('button', { name: 'Admin Login' })).toBeInTheDocument();
        expect(screen.getByText(/2025 The Daily Harvest/)).toBeInTheDocument();
    });

    it('renders the home page content', () => {
        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );

        expect(screen.getByText('Welcome to the The Daily Harvest!')).toBeInTheDocument();
        expect(screen.getByText(/Check out our products page/)).toBeInTheDocument();
    });

    it('routes the application to the home page', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByText('Welcome to the The Daily Harvest!')).toBeInTheDocument();
    });
});
