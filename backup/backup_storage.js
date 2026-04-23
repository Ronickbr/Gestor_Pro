import fs from 'fs';
import path from 'path';

const SUPABASE_URL = 'https://tbzkuzfturedpltawxss.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiemt1emZ0dXJlZHBsdGF3eHNzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDUxMzIzOSwiZXhwIjoyMDg2MDg5MjM5fQ.C7Nph8OYcgQbKshv-eVc3zfnDqPp9uxrQs0rvrqJYes';

const headers = {
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    'apikey': SERVICE_ROLE_KEY
};

async function downloadFile(bucket, filePath) {
    const url = `${SUPABASE_URL}/storage/v1/object/${bucket}/${filePath}`;
    const resp = await fetch(url, { headers });
    if (!resp.ok) {
        console.error(`Erro ao baixar ${bucket}/${filePath}: ${resp.statusText}`);
        return;
    }
    const arrayBuffer = await resp.arrayBuffer();
    const localPath = path.join('backup', 'storage', bucket, filePath);
    fs.mkdirSync(path.dirname(localPath), { recursive: true });
    fs.writeFileSync(localPath, Buffer.from(arrayBuffer));
    console.log(`Baixado: ${bucket}/${filePath}`);
}

async function listAllFiles(bucket, prefix = '') {
    const url = `${SUPABASE_URL}/storage/v1/object/list/${bucket}`;
    const resp = await fetch(url, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prefix: prefix,
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' }
        })
    });

    if (!resp.ok) {
        console.error(`Erro ao listar ${bucket}/${prefix}: ${resp.statusText}`);
        return;
    }

    const items = await resp.json();
    console.log(`Bucket ${bucket}${prefix ? '/' + prefix : ''}: encontrados ${items.length} itens`);
    for (const item of items) {
        const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
        if (!item.id) { // Folder
            await listAllFiles(bucket, fullPath);
        } else {
            await downloadFile(bucket, fullPath);
        }
    }
}

async function runBackup() {
    console.log('Iniciando backup do Storage...');
    const resp = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, { headers });
    if (!resp.ok) {
        console.error(`Erro ao listar buckets: ${resp.statusText}`);
        return;
    }
    const buckets = await resp.json();

    if (!fs.existsSync('backup/storage')) {
        fs.mkdirSync('backup/storage', { recursive: true });
    }

    for (const bucket of buckets) {
        console.log(`Processando bucket: ${bucket.name}`);
        await listAllFiles(bucket.name);
    }
    console.log('Backup do Storage concluído!');
}

runBackup().catch(console.error);
