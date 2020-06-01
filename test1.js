const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const reactURL = 'http://172.16.168.96:3000/#/test'
  await page.goto(reactURL);
  const dimensions = await page.$eval('#container', el => {
    const containerBc = el.getBoundingClientRect()
    return {
      top: containerBc.top,
      left: containerBc.left,
      width: containerBc.width,
      height: containerBc.height
    }
  })

  page.on('console', msg => {
    for (let i = 0; i < msg.args().length; ++i)
    console.log(`${i}: ${msg.args()[i]}`); // 译者注：这句话的效果是打印到你的代码的控制台
  });
  screenShotStart(page, dimensions, browser)
})();

async function screenShotStart(page, dimensions, browser) {
  const start = await page.evaluate(() => {
    // 使用 window.snapStart 开始
    return window.snapStart
  })
  if (start) { 
    await screenShot(page, dimensions)
    await browser.close()
  } else {
    setTimeout(() => {
      screenShotStart(page, dimensions, browser)
    }, 500)
  }
}

async function screenShot(page, dimensions) {
  await new Promise((resolve, reject) => {
    var i = 0;
    var timer = setInterval(async() => {
      i++
      await page.screenshot({ 
        path: `./outImages-react/example-${i}.png`,
        clip: {
          x: dimensions.left,
          y: dimensions.top,
          width: dimensions.width,
          height: dimensions.height || 500
        }
      })

      const end = await page.evaluate(() => {
        // 使用 window.snapEnd 结束
        return window.snapEnd
      })
      if (end) {
          clearInterval(timer)
          resolve()
      }
    }, 1000)
  })
}
