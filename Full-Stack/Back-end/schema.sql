CREATE TABLE users (
    nik VARCHAR PRIMARY KEY,
    password_hash TEXT NOT NULL,
    role VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE data_balita (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama VARCHAR NOT NULL,
    jenis_kelamin CHAR(1) CHECK (jenis_kelamin IN ('L', 'P')),
    tanggal_lahir DATE NOT NULL,
    berat_badan DECIMAL(5,2) NOT NULL,
    tinggi_badan DECIMAL(5,2) NOT NULL,
    umur_bulan INT NOT NULL,
    foto_url TEXT,
    created_by VARCHAR REFERENCES users(nik) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analisis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_id UUID NOT NULL REFERENCES data_balita(id) ON DELETE CASCADE,
    status_stunting VARCHAR NOT NULL,
    status_detail VARCHAR,
    tingkat_risiko VARCHAR,
    tingkat_risiko_detail VARCHAR,
    indikator VARCHAR,
    indikator_detail VARCHAR,
    z_score DECIMAL(4,2),
    rekomendasi TEXT,
    rekomendasi_detail VARCHAR,
    model_version VARCHAR,
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
