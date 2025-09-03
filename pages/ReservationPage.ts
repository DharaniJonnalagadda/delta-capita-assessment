import { expect, Locator, Page } from '@playwright/test';

export class ReservationPage {
    readonly page: Page;

    // Form + validation locators
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly email: Locator;
    readonly phone: Locator;
    readonly reserveNowBtn: Locator;
    readonly alert: Locator;
    readonly alertItems: Locator;

    constructor(page: Page) {
        this.page = page;

        // Form fields (label-first with fallbacks)
        this.firstName = page.getByLabel('Firstname', { exact: true }).or(page.getByPlaceholder('Firstname'));
        this.lastName = page.getByLabel('Lastname', { exact: true }).or(page.getByPlaceholder('Lastname'));
        this.email = page.getByLabel('Email', { exact: true }).or(page.locator('input[type="email"], [name="email"]'));
        this.phone = page.getByLabel('Phone', { exact: true }).or(page.locator('input[type="tel"], [name="phone"]'));

        this.reserveNowBtn = page.getByRole('button', { name: /reserve now/i });
        this.alert = page.locator('.alert[role="alert"]');
        this.alertItems = this.alert.getByRole('listitem');
    }

    async verifyPage(roomType: string) {
        await expect(this.page).toHaveURL(/\/reservation/);
        await expect(this.page.getByRole('heading', { name: new RegExp(roomType, 'i') })).toBeVisible();
        await expect(this.page.locator('.rbc-calendar')).toBeVisible();
    }

    async selectDates(checkIn: number, checkOut: number) {
        const clickDay = async (day: number) => {
            const dayBtn = this.page
                .locator('.rbc-month-view .rbc-date-cell:not(.rbc-off-range) .rbc-button-link')
                .filter({ hasText: String(day) })
                .first();

            await expect(dayBtn).toBeVisible();
            await dayBtn.click();
        };

        await clickDay(checkIn);
        await clickDay(checkOut);
    }

    async clickReserveNow() {
        await this.reserveNowBtn.click();
    }

    async triggerValidationOnce() {
        await this.reserveNowBtn.click();
        await this.firstName.fill('test');
        await this.reserveNowBtn.click();
    }

    async expectValidationErrors(expectedMessages: string[], expectedCount?: number) {
        await expect(this.alert).toBeVisible();

        if (expectedCount) {
            await expect(this.alertItems).toHaveCount(expectedCount);
        }

        for (const msg of expectedMessages) {
            await expect(this.alert).toContainText(msg, { ignoreCase: true });
        }
    }

    async assertFormValidation(errors: string[], expectedCount?: number) {
        await this.triggerValidationOnce();
        await this.expectValidationErrors(errors, expectedCount);
    }

    async submitForm(firstname: string, lastname: string, email: string, phone: string) {
        await this.firstName.clear()
        await this.firstName.fill(firstname);
        await this.lastName.fill(lastname);
        await this.email.fill(email);
        await this.phone.fill(phone);
    }
}
