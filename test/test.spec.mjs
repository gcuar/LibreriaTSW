import puppeteer from 'puppeteer';
import { expect } from 'chai';
import { assert } from 'chai';
import mocha from 'mocha';

describe('My HTML and JavaScript App', function() {
    let browser;
    let page;

    // Set a timeout for the tests
    this.timeout(10000);

    before(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
    });

    after(async () => {
        await browser.close();
    });

    it('should have the correct page title', async () => {
        await page.goto('http://localhost:3000'); // Replace with your app's URL
        const title = await page.title();
        expect(title).to.equal('Expected Page Title'); // Replace with your expected title
    });

    it('should display the correct heading', async () => {
        await page.goto('http://localhost:3000'); // Replace with your app's URL
        const heading = await page.$eval('h1', el => el.textContent);
        expect(heading).to.equal('Expected Heading'); // Replace with your expected heading
    });

    // Add more tests as needed
});