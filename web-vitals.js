import { onCLS, onINP, onLCP } from "https://unpkg.com/web-vitals@4?module";

const reportVital = metric => {
    console.info(`[web-vitals] ${metric.name}: ${metric.value}`);
};

onCLS(reportVital);
onINP(reportVital);
onLCP(reportVital);
