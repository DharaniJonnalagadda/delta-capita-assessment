import { Page, Locator, expect } from '@playwright/test';

export class ConfirmationPage {
    readonly page: Page;
    readonly confirmCard: Locator;

    constructor(page: Page) {
        this.page = page;
        this.confirmCard = page.locator(
            'div.booking-card:has(h2:has-text("Booking Confirmed")), div.card:has(h2:has-text("Booking Confirmed"))'
        );
    }

    async verifyBooking(expectedRange: string) {
        await expect(this.confirmCard).toBeVisible();
        await expect(this.confirmCard.locator('p >> strong')).toHaveText(expectedRange);
    }
}
