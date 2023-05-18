// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')
const { forEachChild } = require('typescript')

describe('base', function() {
  this.timeout(30000)
  let driver
  let vars
  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build()
    vars = {}
    await driver.get("http://localhost:3000/en")
  })
  afterEach(async function() {
    await driver.quit();
  })
  it('base coffee', async function() {

    await addItemToCart('Hot', {Size: 'S', 'Whipped Cream': 'No', 'Chocolate Sauce': 'No'});
    await verifyTaxPrice(0.15);
    await verifyTotalPrice(2.15);
  })

  it('base coffee + whipped cream', async function() {

    await addItemToCart('Hot', {Size: 'S', 'Whipped Cream': 'Yes', 'Chocolate Sauce': 'No'});
    await verifyTaxPrice(0.18);
    await verifyTotalPrice(2.68);
  })

  it('base coffee + 4 pumps choco', async function() {

    await addItemToCart('Hot', {Size: 'S', 'Whipped Cream': 'No', 'Chocolate Sauce': '4 Pumps'});
    await verifyTaxPrice(0.22);
    await verifyTotalPrice(3.22);
  })

  async function verifyTotalPrice(price){
    await verifyPrice('Total', price)
  }

  async function verifyTaxPrice(price){
    await verifyPrice('Tax', price)
  }

  async function verifyPrice(indicatorText, price){
    await driver.get("http://localhost:3000/en/cart")
    let elements = await driver.findElements(By.xpath(`//*[contains(.,'${indicatorText}')]`))
    let found = false;
    for (const e of elements){
      let foo = await e.getText();
      let str = foo.replace(/[\s\$:]+/g, '');
      if(str == `${indicatorText}${price}`) {
        found = true;
        break;
      }
    }
    assert(found);
  }

  async function addItemToCart(itemName, optionList){
    await driver.get("http://localhost:3000/en")
    await driver.findElement(By.xpath(`//*[text()='${itemName}']`)).click()
    await driver.wait(until.urlContains('pick-item-options'))

    for(option in optionList){
      await driver.findElement(By.xpath(`//*[@id='${optionList[option]}' and @name='${option}']`)).click()
    }
    
    await driver.findElement(By.xpath("//*[text()='Add to cart']")).click()
  }
})