describe('Basic user flow for Website', () => {
  // First, visit the lab 7 website
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/');
  });

  // Each it() call is a separate test
  // Here, we check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');

    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });

    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  // We use .skip() here because this test has a TODO that has not been completed yet.
  // Make sure to remove the .skip after you finish the TODO. 
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');

    // Start as true, if any don't have data, swap to false
    let allArePopulated = true;

    // Query select all of the <product-item> elements
    const prodItemsData = await page.$$eval('product-item', prodItems => {
      return prodItems.map(item => {
        // Grab all of the json data stored inside
        return data = item.data;
      });
    });

    console.log(`Checking product item 1/${prodItemsData.length}`);

    for (let i = 0; i < prodItemsData.length; i++) {
      const item = prodItemsData[i];
      if (!item.title || !item.price || !item.image) {
        allArePopulated = false;
      }
    } 

    // Expect allArePopulated to still be true
    expect(allArePopulated).toBe(true);

  }, 10000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');

    const prodItem = await page.$('product-item');
    const shadowRoot = await prodItem.getProperty('shadowRoot');
    const button = await shadowRoot.$('button');

    await button.click();

    const innerText = await (await button.getProperty('innerText')).jsonValue();
    expect(innerText).toBe('Remove from Cart');

  }, 2500);

  // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // number in the top right has been correctly updated
  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');

    const prodItems = await page.$$('product-item');

    for (let i = 0; i < prodItems.length; i++) {
      const item = prodItems[i];
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');

      const text = await (await button.getProperty('innerText')).jsonValue();
      if (text !== 'Remove from Cart') {
        await button.click();
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const confirmText = await (await button.getProperty('innerText')).jsonValue();
      if (confirmText !== 'Remove from Cart') {
        console.log(` Button ${i + 1} did not update`);
      }
    }

    const cartCount = await page.$eval('#cart-count', el => el.textContent);
    expect(cartCount).toBe('20');

  }, 20000);

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    await page.reload();
    await new Promise(resolve => setTimeout(resolve, 500));


    const prodItems = await page.$$('product-item');

    for (let i = 0; i < prodItems.length; i++) {
      const item = prodItems[i];
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const innerText = await (await button.getProperty('innerText')).jsonValue();
      if (innerText !== 'Remove from Cart') {
        console.log(` Button ${i + 1} expected 'Remove from Cart' but got '${innerText}'`);
      }
      expect(innerText).toBe('Remove from Cart');
    }

    const cartCount = await page.$eval('#cart-count', el => el.textContent);
    expect(cartCount).toBe('20');

  }, 20000);

  // Check to make sure that the cart in localStorage is what you expect
  it('Checking the localStorage to make sure cart is correct', async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const cart = await page.evaluate(() => localStorage.getItem('cart'));
    console.log('Cart storage:', cart);
    expect(cart).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');

  });

  // Checking to make sure that if you remove all of the items from the cart that the cart
  // number in the top right of the screen is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');

    const prodItems = await page.$$('product-item');

    await new Promise(resolve => setTimeout(resolve, 500));

    for (let i = 0; i < prodItems.length; i++) {
      const item = prodItems[i];
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');

      const text = await (await button.getProperty('innerText')).jsonValue();
      if (text !== 'Add to Cart') {
        await button.click();
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const confirmText = await (await button.getProperty('innerText')).jsonValue();
      if (confirmText !== 'Add to Cart') {
        console.log(` Button ${i + 1} did not change to 'Add to Cart'`);
      }
    }

    const cartCount = await page.$eval('#cart-count', el => el.textContent);
    expect(cartCount).toBe('0');

  }, 20000);

  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    await page.reload();
    await new Promise(resolve => setTimeout(resolve, 500));


    const prodItems = await page.$$('product-item');
    
    for (let i = 0; i < prodItems.length; i++) {
      const item = prodItems[i];
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const innerText = await (await button.getProperty('innerText')).jsonValue();
      if (innerText !== 'Add to Cart') {
        console.log(` Button ${i + 1} expected 'Add to Cart' but got '${innerText}'`);
      }
      expect(innerText).toBe('Add to Cart');
    }

  
    const cartCount = await page.$eval('#cart-count', el => el.textContent);
    expect(cartCount).toBe('0');

  }, 20000);

  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');

    await new Promise(resolve => setTimeout(resolve, 500));


    const cart = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cart).toBe('[]');

  });
});
