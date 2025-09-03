import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { BookingPage } from '../pages/BookingPage';
import { ReservationPage } from '../pages/ReservationPage';
import { ConfirmationPage } from '../pages/ConfirmationPage';
import { toISO, getFutureDay } from '../utils/helpers';

import { validUser } from '../test-data/userData.json';

const { firstname, lastname, email, phone } = validUser;

test('user can book a room and see correct reservation details', async ({ page }) => {
  const homePage = new HomePage(page);
  const bookingPage = new BookingPage(page);
  const reservationPage = new ReservationPage(page);
  const confirmationPage = new ConfirmationPage(page);

  // Navigate to home page and click "Book Now" in hero section
  await homePage.goto();
  await homePage.clickHeroBookNow();

  // Choose a room type and click its "Book Now"
  await bookingPage.selectRoom('Single');

  // reservation page checks
  await reservationPage.verifyPage('Single Room');

  // Select days on calendar (today+3 → today+4)
  const checkIn = getFutureDay(3);
  const checkOut = getFutureDay(4);
  const expectedCheckIn = new Date(); expectedCheckIn.setDate(expectedCheckIn.getDate() + 3);
  const expectedCheckOut = new Date(); expectedCheckOut.setDate(expectedCheckOut.getDate() + 4);
  const expectedRange = `${toISO(expectedCheckIn)} - ${toISO(expectedCheckOut)}`;
  await reservationPage.selectDates(checkIn, checkOut);

  await reservationPage.clickReserveNow();

  // booking form validations
  await reservationPage.assertFormValidation(
    [
      'must not be empty',
      'Lastname should not be blank',
      'size must be between 11 and 21',
      'size must be between 3 and 30',
    ],
    5
  );

  // Fill booking form and submit
  await reservationPage.submitForm(firstname, lastname, email, phone);

  await reservationPage.clickReserveNow();
  
  // Booking confirmed section and validate Dates cover same period previously chosen by the user
  await confirmationPage.verifyBooking(expectedRange);
});
