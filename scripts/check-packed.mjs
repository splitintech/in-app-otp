import {mkdtempSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
const root=process.cwd();
const temp=mkdtempSync(join(tmpdir(),'standalone-package-'));
function run(command,args,cwd=root){const r=spawnSync(command,args,{cwd,encoding:'utf8',env:process.env});if(r.status!==0)throw new Error(r.stdout+'\n'+r.stderr);return r.stdout;}
try {
 const pkg=JSON.parse(readFileSync(join(root,'package.json'),'utf8'));
 const packed=JSON.parse(run('npm',['pack','--json','--pack-destination',temp]));
 run('npm',['install','--prefix',temp,'--ignore-scripts','--no-audit','--no-fund',...(process.env.PACK_OFFLINE?['--offline']:[]),join(temp,packed[0].filename)],temp);
 const entries=Object.keys(pkg.exports).filter(x=>!x.endsWith('.css')).map(x=>pkg.name+(x==='.'?'':x.slice(1)));
 run(process.execPath,['--input-type=module','-e',`for(const name of ${JSON.stringify(entries)}) { await import(name); console.log('ESM '+name); }`],temp);
 run(process.execPath,['-e',`for(const name of ${JSON.stringify(entries)}) { require(name); console.log('CJS '+name); }`],temp);
 console.log('Packed consumer verified: '+entries.length+' exports in ESM and CJS');
} finally {rmSync(temp,{recursive:true,force:true});}
