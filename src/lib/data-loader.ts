import { getPortfolioItems, getPageContent, getTestimonials } from './db';
import { unstable_cache } from 'next/cache';

export const loadPortfolioItems = unstable_cache(
    async () => getPortfolioItems(),
    ['portfolio_items'],
    { tags: ['portfolio_items'] }
);

export const loadPageContent = unstable_cache(
    async (section: string) => getPageContent(section),
    ['page_content'],
    { tags: ['page_content'] }
);

export const loadTestimonials = unstable_cache(
    async () => getTestimonials(),
    ['testimonials'],
    { tags: ['testimonials'] }
);
