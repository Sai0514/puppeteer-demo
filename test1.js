const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = 'http://hanabi.data-viz.cn/visualisation/line_chart'
  await page.goto('http://192.168.1.4:8008');
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

  setTimeout(async() => {
    await screenShot(page, dimensions)
    await browser.close()
  }, 5000)
})();


async function screenShot(page, dimensions) {
  await new Promise((resolve, reject) => {
    var i = 0;
    var timer = setInterval(async() => {
      i++
      await page.screenshot({ 
        path: `example-${i}.png`,
        clip: {
          x: dimensions.left,
          y: dimensions.top,
          width: dimensions.width,
          height: dimensions.height || 500
        }
      })

      const snaped = await page.evaluate(() => {
        // 使用 window.snapEnd 结束
        return window.snapEnd
      })
      if (snaped) {
          clearInterval(timer)
          resolve()
      }
    }, 1200)
  })
}

