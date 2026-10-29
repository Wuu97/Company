import { generateEtbHandoffEscalations } from "../src/lib/etb-handoff-notification-generator";
generateEtbHandoffEscalations().then(result => console.log(JSON.stringify(result))).catch(error => { console.error(error); process.exitCode = 1; });
