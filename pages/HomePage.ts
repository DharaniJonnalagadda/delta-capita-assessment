import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly heroBookNow: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heroBookNow = page.locator('a.btn.btn-primary.btn-lg[href="#booking"]');
    }

    async goto() {
        await this.page.goto('/');
    }

    async clickHeroBookNow() {
        await expect(this.heroBookNow).toBeVisible();
        await this.heroBookNow.click();
    }
}
