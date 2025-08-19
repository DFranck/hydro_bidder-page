// path: scripts/get-context.mjs
// (collect recursively, filter by extensions, output concatenated string or JSON)

import { promises as fs } from "node:fs";
import * as path from "node:path";

const DEFAULT_EXTS = [".ts",".tsx",".js",".jsx",".json",".css",".scss",".md",".mdx"];
const DEFAULT_IGNORES = ["node_modules",".git",".next","dist","build","out","coverage"];
const DEFAULT_MAX_BYTES = 400_000;

function toPosix(p){ return p.split(path.sep).join("/"); }
function langFromExt(ext){
  switch(ext){
    case ".ts": return "ts"; case ".tsx": return "tsx";
    case ".js": return "js"; case ".jsx": return "jsx";
    case ".json": return "json"; case ".css": return "css";
    case ".scss": return "scss"; case ".md": return "md";
    case ".mdx": return "mdx"; default: return ext.replace(/^\./,"")||"text";
  }
}

async function collectFiles(rootDir, exts, ignores, baseDir=rootDir){
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  const out = [];
  for(const e of entries){
    if(e.isDirectory()){
      if(ignores.includes(e.name)) continue;
      out.push(...await collectFiles(path.join(rootDir, e.name), exts, ignores, baseDir));
    } else if(e.isFile()){
      const ext = path.extname(e.name).toLowerCase();
      if(!exts.includes(ext)) continue;
      const abs = path.join(rootDir, e.name);
      const rel = toPosix(path.relative(baseDir, abs));
      const content = await fs.readFile(abs, "utf8");
      out.push({ path: rel, lang: langFromExt(ext), content, bytes: Buffer.byteLength(content,"utf8") });
    }
  }
  return out;
}

function serializeFiles(files, { maxBytes=DEFAULT_MAX_BYTES, squeezeBlankLines=true }={}){
  const SEP_START="/* >>> "; const SEP_END=" <<< */"; const END_FILE="/* --- end file --- */";
  let total=0, truncated=false; const parts=[];
  for(const f of files.sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0)){
    const piece = `${SEP_START}${f.path} (${f.lang})${SEP_END}\n${f.content}\n${END_FILE}\n\n`;
    const pieceBytes = Buffer.byteLength(piece,"utf8");
    if(total + pieceBytes > maxBytes){ truncated=true; break; }
    parts.push(piece); total += pieceBytes;
  }
  let asString = parts.join("");
  if(squeezeBlankLines) asString = asString.replace(/\n{3,}/g,"\n\n");
  if(truncated) asString = `/* NOTE: truncated to ${maxBytes} bytes */\n\n` + asString;
  return { asString, totalBytes: total, truncated };
}

function parseArgs(argv){
  const args = argv.slice(2);
  let dir = ".";
  const flags = {};
  for(const a of args){
    if(a.startsWith("--ext=")) flags.exts = a.slice(6);
    else if(a.startsWith("--ignore=")) flags.ignore = a.slice(9);
    else if(a.startsWith("--max-bytes=")) flags.maxBytes = Number(a.slice(12));
    else if(a === "--no-squeeze") flags.squeeze = false;
    else if(a === "--squeeze") flags.squeeze = true;
    else if(a.startsWith("--out=")) flags.out = a.slice(6);
    else if(a === "--json") flags.json = true;
    else if(!a.startsWith("--")) dir = a;
  }
  return { dir, flags };
}

function splitCsv(v){ return v ? v.split(",").map(s=>s.trim()).filter(Boolean) : undefined; }

async function main(){
  const { dir, flags } = parseArgs(process.argv);
  const exts = splitCsv(flags.exts) ?? DEFAULT_EXTS;
  const ignoreDirs = splitCsv(flags.ignore) ?? DEFAULT_IGNORES;
  const maxBytes = flags.maxBytes ?? DEFAULT_MAX_BYTES;
  const squeezeBlankLines = flags.squeeze ?? true;

  const root = path.resolve(dir);
  const files = await collectFiles(root, exts, ignoreDirs);
  const { asString, totalBytes, truncated } = serializeFiles(files, { maxBytes, squeezeBlankLines });

  if(flags.json){
    const json = JSON.stringify({ totalBytes, truncated, files: files.map(f=>({ path:f.path, lang:f.lang, bytes:f.bytes })), asString }, null, 2);
    if(flags.out){ await fs.writeFile(flags.out, json, "utf8"); console.error(`Wrote JSON: ${flags.out}`); }
    else { process.stdout.write(json); }
    return;
  }

  if(flags.out){ await fs.writeFile(flags.out, asString, "utf8"); console.error(`Wrote context (${totalBytes} bytes${truncated?", truncated":""}): ${flags.out}`); }
  else { process.stdout.write(asString); }
}

main().catch(err=>{ console.error(err?.stack||String(err)); process.exit(1); });
