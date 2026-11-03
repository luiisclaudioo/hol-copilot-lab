import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
    it('renders the footer landmark', () => {
        render(<Footer />);

        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('displays the copyright notice', () => {
        render(<Footer />);

        expect(
            screen.getByText('© 2025 The Daily Harvest. All rights reserved.')
        ).toBeInTheDocument();
    });
});
