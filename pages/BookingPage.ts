import { Page, Locator } from '@playwright/test';

export class BookingPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async selectRoom(roomType: string) {
        const roomCard = this.page.locator('.card').filter({ hasText: roomType });
        await roomCard.getByRole('link', { name: 'Book now' }).click();
    }
}
