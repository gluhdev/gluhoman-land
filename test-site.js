const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Переходим на localhost:3000...');
    
    // Устанавливаем таймаут на загрузку страницы
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    
    console.log('Страница загружена успешно!');
    
    // Проверяем заголовок
    const title = await page.title();
    console.log('Заголовок страницы:', title);
    
    // Проверяем основные элементы
    const headerExists = await page.locator('header').count();
    console.log('Header найден:', headerExists > 0);
    
    const heroExists = await page.locator('h1').count();
    console.log('Hero заголовок найден:', heroExists > 0);
    
    if (heroExists > 0) {
      const heroText = await page.locator('h1').first().textContent();
      console.log('Текст Hero:', heroText);
    }
    
    // Делаем скриншот
    await page.screenshot({ path: 'site-screenshot.png', fullPage: true });
    console.log('Скриншот сохранен как site-screenshot.png');
    
    // Проверяем консольные ошибки
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    if (errors.length > 0) {
      console.log('Ошибки в консоли:', errors);
    } else {
      console.log('Ошибок в консоли не найдено');
    }
    
  } catch (error) {
    console.error('Ошибка при загрузке сайта:', error.message);
  } finally {
    await browser.close();
  }
})();