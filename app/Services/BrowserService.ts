import playwright from 'playwright'

export default class BrowserService {
  /**
   * Launches the Chromium browser.
   *
   * @return {Promise<Browser>} A promise that resolves to the Chromium browser instance.
   */
  public async launchChromium() {
    return playwright.chromium.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
  }

  /**
   * Retrieves a new page from a launched Chromium browser.
   *
   * @return {Promise<Page>} A promise that resolves to a new page object.
   */
  public async getPage() {
    const browser = await this.launchChromium()
    const page = await browser.newPage()

    return page
  }
}
