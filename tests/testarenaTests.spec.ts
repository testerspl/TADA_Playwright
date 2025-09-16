import { expect, test } from "playwright/test";
import {LoginPage} from '../pages/loginPage/loginPage'
import { MainPage } from "../pages/mainPage/mainPage";
let loginPage: LoginPage, mainPage: MainPage

test.describe('Example test arena tests',  () => {

   test.beforeEach(({page}) => {
      loginPage = new LoginPage(page)
      mainPage = new MainPage(page)
      //await loginPage.gotoPage()
      // await loginPage.login()
   })

    test('Example login to test arena', async ({page}) => {

      await loginPage.gotoPage()
      await loginPage.login()
      

      expect(page.locator('.header_admin')).toBeVisible()
      expect(page.locator('#content > article > article.column_dashboard > div > article>h4')).toHaveText('Zadania przypisane do mnie')
    })

    test('Example logout to test arena', async () => {

      await loginPage.gotoPage()
      await loginPage.login()
      mainPage.logout()

      await loginPage.checkLoginPageElems()
     })
})