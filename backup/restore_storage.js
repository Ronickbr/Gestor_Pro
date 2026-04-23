import fs from 'fs';
import path from 'path';

const TARGET_SUPABASE_URL = 'https://servidor-supabase.rcuvjj.easypanel.host';
const TARGET_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q';

const headers = {
    'Authorization': `Bearer ${TARGET_SERVICE_ROLE_KEY}`,
    'apikey': TARGET_SERVICE_ROLE_KEY
};

async function createBucket(bucketName) {
    console.log(`Verificando/Criando bucket: ${bucketName}`);
    const resp = await fetch(`${TARGET_SUPABASE_URL}/storage/v1/bucket`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: bucketName,
            name: bucketName,
            public: true // Ajuste conforme necessário
        })
    });
    // Se já existir, vai retornar erro mas podemos ignorar se for 409
    if (resp.status !== 201 && resp.status !== 200 && resp.status !== 409) {
        const err = await resp.text();
        console.warn(`Aviso ao criar bucket ${bucketName}: ${resp.status} - ${err}`);
    }
}

async function uploadFile(bucket, localPath, remotePath) {
    const fileContent = fs.readFileSync(localPath);
    const url = `${TARGET_SUPABASE_URL}/storage/v1/object/${bucket}/${remotePath}`;
    
    const resp = await fetch(url, {
        method: 'POST',
        headers: { 
            ...headers,
            'x-upsert': 'true'
        },
        body: fileContent
    });

    if (!resp.ok) {
        const err = await resp.text();
        console.error(`Erro ao subir ${remotePath}: ${resp.status} - ${err}`);
    } else {
        console.log(`Sucesso: ${remotePath}`);
    }
}

async function walkDir(dir, bucket, prefix = '') {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const localPath = path.join(dir, file);
        const remotePath = prefix ? `${prefix}/${file}` : file;
        
        if (fs.statSync(localPath).isDirectory()) {
            await walkDir(localPath, bucket, remotePath);
        } else {
            await uploadFile(bucket, localPath, remotePath);
        }
    }
}

async function runRestore() {
    const backupStorageDir = path.join('backup', 'storage');
    if (!fs.existsSync(backupStorageDir)) {
        console.log('Nenhum arquivo de storage para restaurar.');
        return;
    }

    const buckets = fs.readdirSync(backupStorageDir);
    for (const bucket of buckets) {
        const bucketPath = path.join(backupStorageDir, bucket);
        if (fs.statSync(bucketPath).isDirectory()) {
            await createBucket(bucket);
            await walkDir(bucketPath, bucket);
        }
    }
    console.log('Restauração do Storage concluída!');
}

runRestore().catch(console.error);
