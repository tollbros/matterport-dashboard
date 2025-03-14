## Matterports vs Web Database

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


https://tollbros.github.io/matterport-dashboard/ 


-----

## SQL Query

```
SELECT SUM(active) numactive, `Matterport Name` FROM (
SELECT c.comm_name as "Community/Model/Plan", c.on_the_web as "active", mm.name as "Matterport Name" from community c join lk_multimedia_community lmc on lmc.community_id=c.community_id join multimedia mm on mm.multimedia_id=lmc.multimedia_id where mm.type_id=10006
UNION 
SELECT CONCAT(c.comm_name,"::",mp.plan_name), cp.on_the_web, mmcp.name from commPlans cp join lk_multimedia_commPlans lmcp on cp.commPlan_id=lmcp.plan_id join multimedia mmcp on mmcp.multimedia_id=lmcp.multimedia_id 
join masterPlans mp on mp.masterPlan_id=cp.masterPlan_id
join community c on c.community_id=cp.community_id
where mmcp.type_id=10006
UNION 
SELECT CONCAT("MasterPlan::",mp.plan_name), IF(ods.ModelStatusCode='DEA',0,1), mm.name FROM masterPlans mp
join lk_multimedia_masterPlan lmp on mp.masterPlan_id=lmp.master_plan_id 
LEFT join ODS_ARCHO_MODEL_MASTER_INFO ods on ods.PlanNum=mp.jde_num 
join multimedia mm on mm.multimedia_id=lmp.multimedia_id and mm.type_id=10006  
) t group by `Matterport Name` having numactive=0;
```


`/v1/search/matterports/getmatterports`
