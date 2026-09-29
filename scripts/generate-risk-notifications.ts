import { generateRiskNotifications } from "../src/lib/risk-notification-generator";
generateRiskNotifications().then(result => console.log(JSON.stringify(result))).catch(error => { console.error(error); process.exitCode = 1; });
