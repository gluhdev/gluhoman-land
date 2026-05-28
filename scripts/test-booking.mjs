import { chromium } from 'playwright';

const BASE = 'https://gluhoman.maxautomate.ai';
const b = await chromium.launch({ headless: true });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });
const p = await ctx.newPage();
const errs = [];
p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 120)); });

console.log('1. Open homepage');
await p.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});

console.log('2. Open booking dialog (header Забронювати)');
// Header CTA
const cta = p.locator('button:has-text("Забронювати"), button:has-text("Book")').first();
await cta.click({ timeout: 10000 }).catch(async () => {
  // fallback: dispatch the open event
  await p.evaluate(() => window.dispatchEvent(new CustomEvent('gluhoman:booking:open', { detail: { service: 'hotel' } })));
});
await p.waitForTimeout(1200);

console.log('3. Dialog visible?');
const dialogText = await p.locator('body').innerText();
const hasHotelPicker = /Оберіть готель|Оберіть номер/i.test(dialogText);
console.log('   hotel/room picker present:', hasHotelPicker);

console.log('4. Hotel pills present?');
for (const name of ['Готель-Аквапарк', 'Центральний', 'Корпус Броварні', 'Будиночки']) {
  const seen = await p.locator(`text=${name}`).count();
  console.log(`   "${name}": ${seen > 0 ? 'yes' : 'NO'}`);
}

console.log('5. Click Центральний tab');
await p.locator('button:has-text("Центральний")').first().click({ timeout: 5000 }).catch((e) => console.log('   click failed', e.message.slice(0,60)));
await p.waitForTimeout(600);

console.log('6. Pick first room card');
// Room cards are buttons containing an img + room name
const roomCard = p.locator('button:has(img)').filter({ hasText: /Люкс|Стандарт|Однокімнатний/ }).first();
const roomCount = await roomCard.count();
console.log('   room cards found:', roomCount);
if (roomCount > 0) {
  await roomCard.click();
  await p.waitForTimeout(1500);
  const afterText = await p.locator('body').innerText();
  console.log('   after pick — has "Змінити номер":', /Змінити номер/i.test(afterText));
  console.log('   after pick — has availability "Вільно" or "немає":', /Вільно:|немає вільних|Перевіряємо/i.test(afterText));
  console.log('   after pick — has Далі button:', await p.locator('button:has-text("Далі")').count() > 0);
}

console.log('7. console errors:', errs.length ? errs.slice(0,5) : 'none');
await b.close();
console.log('DONE');
