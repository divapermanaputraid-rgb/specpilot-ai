(()=>{var e={};e.id=858,e.ids=[858],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3014:(e,r,t)=>{"use strict";t.r(r),t.d(r,{patchFetch:()=>R,routeModule:()=>l,serverHooks:()=>P,workAsyncStorage:()=>m,workUnitAsyncStorage:()=>g});var s={};t.r(s),t.d(s,{POST:()=>u});var o=t(4777),a=t(1350),i=t(8221),n=t(760),d=t(2193),c=t(2486);let p=d.Ik({session_id:d.Yj().uuid()});async function u(e){try{let r=await e.json(),t=p.safeParse(r);if(!t.success)return n.NextResponse.json({success:!1,error:"Invalid input",details:t.error.errors},{status:400});let{session_id:s}=t.data;if("mock"===process.env.AI_MODE||!process.env.GROQ_API_KEY&&!process.env.OPENROUTER_API_KEY){let e=`# Mock PRD for Session ${s}

## 1. Product Overview
This is a mock PRD generated because the system is in mock mode or AI keys are missing.

## 2. Mermaid Flowchart
\`\`\`mermaid
graph TD
    A[User Idea] --> B{Mock Mode?};
    B -- Yes --> C[Generate Mock PRD];
    B -- No --> D[Call AI];
\`\`\`

## 3. Mermaid ERD
\`\`\`mermaid
erDiagram
    PROJECT ||--o{ INTERVIEW_ANSWER : contains
    PROJECT ||--o| GENERATED_PRD : has
\`\`\`

## 4. Mermaid Gantt
\`\`\`mermaid
gantt
    title Mock Project Schedule
    dateFormat  YYYY-MM-DD
    section Implementation
    Setup           :a1, 2024-01-01, 7d
    Features        :after a1, 14d
\`\`\`

## 5. Feature Priority Matrix
| Feature | Impact | Effort | Priority |
|---|---|---|---|
| Core App | High | Medium | P1 |
| Mock Mode | Medium | Low | P2 |

## 6. Risk Matrix
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| API Key Missing | High | High | Use mock mode fallback |

## 7. AI Coding Agent Prompt
Copy and paste this section to an AI coding agent to start implementation.
`;if(process.env.DATABASE_URL)try{let r=await c.z.project.findUnique({where:{sessionId:s}});r&&(await c.z.generatedPrd.upsert({where:{projectId:r.id},create:{projectId:r.id,sessionId:s,content:e},update:{content:e}}),await c.z.project.update({where:{id:r.id},data:{status:"COMPLETED"}}))}catch(e){console.error("Failed to save mock PRD to DB:",e)}return n.NextResponse.json({success:!0,prd:e})}return n.NextResponse.json({success:!0,prd:"# Live Mode PRD Placeholder\n\nAI PRD generation is not fully implemented yet."})}catch(e){return console.error("Error generating PRD:",e),n.NextResponse.json({success:!1,error:"Internal server error"},{status:500})}}let l=new o.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/prd/generate/route",pathname:"/api/prd/generate",filename:"route",bundlePath:"app/api/prd/generate/route"},resolvedPagePath:"/Users/macbook/workspace/portofolio/specpilot-ai/src/app/api/prd/generate/route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:m,workUnitAsyncStorage:g,serverHooks:P}=l;function R(){return(0,i.patchFetch)({workAsyncStorage:m,workUnitAsyncStorage:g})}},4626:()=>{},2778:()=>{},2486:(e,r,t)=>{"use strict";t.d(r,{z:()=>o});let s=require("@prisma/client"),o=globalThis.prisma??new s.PrismaClient({log:["error"]})}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[977,246,193],()=>t(3014));module.exports=s})();