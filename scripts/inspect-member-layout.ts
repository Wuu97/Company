import { chromium } from '@playwright/test';
import { prisma } from '../src/lib/prisma';
import { createSession, SESSION_COOKIE, parseSessionCookie } from '../src/lib/auth';
import { createHash } from 'node:crypto';
async function main() {
 const admin = await prisma.appUser.findFirstOrThrow({where:{role:'ADMIN',active:true},select:{id:true}});
 const session = await createSession(admin.id);
 const browser = await chromium.launch({headless:true,channel:'chrome'});
 try {
  const context = await browser.newContext({viewport:{width:1440,height:900}});
  await context.addCookies([{name:SESSION_COOKIE,value:session.value,url:'http://localhost:3000'}]);
  const page = await context.newPage(); await page.goto('http://localhost:3000/settings');
  await page.getByRole("button", {name:"重置密码",exact:true}).first().waitFor();
  await page.screenshot({path:'/tmp/member-layout.png'});
 } finally {await browser.close();const parsed=parseSessionCookie(session.value);if(parsed) await prisma.appSession.deleteMany({where:{tokenHash:createHash('sha256').update(parsed.token).digest('hex')}});await prisma.$disconnect();}
}
main().catch(e=>{console.error(e);process.exitCode=1});
