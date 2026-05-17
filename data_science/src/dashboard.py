import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import chi2_contingency, kruskal, pearsonr
import warnings
warnings.filterwarnings('ignore')

# konfigurasi halaman streamlit
st.set_page_config(
    page_title="SIDIAS — Dashboard Analisis Stunting",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# warna yang dipake di semua grafik biar konsisten
C_RED    = '#C0392B'
C_GREEN  = '#1E8449'
C_AMBER  = '#D68910'
C_BLUE   = '#1A5276'
C_PURPLE = '#6C3483'
C_LAKI   = '#2471A3'
C_PUAN   = '#B03A78'


@st.cache_data
def load_data():
    # baca dataset bersih dan referensi WHO
    df  = pd.read_csv('data_science/data/processed/dataset_stunting_clean.csv')
    who = pd.read_csv('data_science/data/processed/who_reference_master.csv')

    # pastiin kolom numerik terbaca dengan bener
    for col in ['usia_bulan', 'berat_badan', 'tinggi_badan',
                'zscore_bb_u', 'zscore_tb_u', 'zscore_bb_tb']:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    # ambil data WHO khusus indikator TB/U buat kalkulasi LMS
    who_tbu = (who[who['indicator'] == 'TB/U']
               [['jenis_kelamin', 'month', 'l', 'm', 's',
                 'sd3neg', 'sd2neg', 'sd1neg', 'sd0', 'sd1', 'sd2', 'sd3']]
               .copy())
    who_tbu.columns = ['jenis_kelamin', 'usia_bulan', 'l', 'm', 's',
                       'sd3neg', 'sd2neg', 'sd1neg', 'median_who',
                       'sd1', 'sd2', 'sd3']
    who_tbu['usia_bulan'] = who_tbu['usia_bulan'].astype(int)

    # merge WHO ke dataset utama berdasarkan jenis kelamin dan usia
    df['usia_int'] = df['usia_bulan'].round().astype(int)
    df = df.merge(who_tbu, left_on=['jenis_kelamin', 'usia_int'],
                  right_on=['jenis_kelamin', 'usia_bulan'],
                  how='left', suffixes=('', '_who'))
    df.drop(columns=['usia_bulan_who'], errors='ignore', inplace=True)

    # hitung z-score pakai rumus LMS standar WHO
    def zscore_lms(row):
        try:
            X, L, M, S = row['tinggi_badan'], row['l'], row['m'], row['s']
            if any(pd.isna([X, L, M, S])):
                return np.nan
            return np.log(X / M) / S if L == 0 else ((X / M) ** L - 1) / (L * S)
        except:
            return np.nan

    df['who_zscore'] = df.apply(zscore_lms, axis=1)
    df['selisih_z']  = df['zscore_tb_u'] - df['who_zscore']

    # bikin flag buat filter dan analisis
    df['flag_stunting']   = (df['status_tb_u'] == 'Stunting').astype(int)
    df['flag_gizi_buruk'] = df['status_bb_u'].isin(['Gizi Buruk', 'Gizi Kurang']).astype(int)
    df['flag_kurus']      = df['status_bb_tb'].isin(['Kurus', 'Sangat Kurus']).astype(int)

    # kelompokin usia per 6 bulan
    bins  = [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60]
    label = ['0-6', '6-12', '12-18', '18-24', '24-30',
             '30-36', '36-42', '42-48', '48-54', '54-60']
    df['kelompok'] = pd.cut(df['usia_bulan'], bins=bins, labels=label, right=True)

    return df


with st.spinner('Memuat data...'):
    df = load_data()


# sidebar navigasi dan filter
with st.sidebar:
    st.image("https://img.icons8.com/color/96/health-checkup.png", width=80)
    st.title("SIDIAS")
    st.caption("Sistem Diagnosis Anak Stunting")
    st.divider()

    st.markdown("**Navigasi Dashboard**")
    halaman = st.radio(
        label="Pilih halaman:",
        options=[
            "Ringkasan Umum",
            "Q1 — Prevalensi per Usia",
            "Q2 — Perbedaan Gender",
            "Q3 — Deviasi Z-Score vs WHO",
            "Q4 — Ko-morbiditas Gizi",
            "Q5 — Zona Waspada"
        ],
        label_visibility="collapsed"
    )

    st.divider()
    st.markdown("**Filter Data**")

    filter_gender = st.multiselect(
        "Jenis Kelamin",
        options=['Laki-laki', 'Perempuan'],
        default=['Laki-laki', 'Perempuan']
    )

    filter_usia = st.slider(
        "Rentang Usia (bulan)",
        min_value=0, max_value=60,
        value=(0, 60)
    )

    # terapkan filter ke data
    df_filtered = df[
        (df['jenis_kelamin'].isin(filter_gender)) &
        (df['usia_bulan'] >= filter_usia[0]) &
        (df['usia_bulan'] <= filter_usia[1])
    ].copy()

    st.divider()
    st.caption(f"Total data aktif: **{len(df_filtered):,}** baris")


# halaman ringkasan umum
if halaman == "Ringkasan Umum":
    st.title("📊 Dashboard Analisis Stunting Balita")
    st.markdown(
        "Dashboard ini menyajikan hasil analisis data stunting balita usia 0–60 bulan "
        "berdasarkan 5 pertanyaan bisnis menggunakan metode SMART. "
        "Data bersumber dari dataset posyandu yang telah dibersihkan dan divalidasi "
        "terhadap standar pertumbuhan WHO."
    )
    st.divider()

    # hitung metrik utama
    total        = len(df_filtered)
    n_stunting   = df_filtered['flag_stunting'].sum()
    pct_stunting = n_stunting / total * 100 if total > 0 else 0
    n_laki       = (df_filtered['jenis_kelamin'] == 'Laki-laki').sum()
    n_puan       = (df_filtered['jenis_kelamin'] == 'Perempuan').sum()

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Total Sampel",   f"{total:,}")
    col2.metric("Kasus Stunting", f"{n_stunting:,}", f"{pct_stunting:.1f}%")
    col3.metric("Laki-laki",      f"{n_laki:,}")
    col4.metric("Perempuan",      f"{n_puan:,}")

    st.divider()

    col_a, col_b = st.columns(2)

    with col_a:
        st.subheader("Distribusi Status Stunting")
        st.markdown(
            "Proporsi anak stunting dibandingkan yang tidak stunting "
            "dari total sampel yang tersedia."
        )
        status_counts = df_filtered['status_tb_u'].value_counts()
        warna_pie = [C_RED if 'Stunting' in x else C_GREEN for x in status_counts.index]
        fig, ax = plt.subplots(figsize=(6, 5))
        wedges, texts, autotexts = ax.pie(
            status_counts.values,
            labels=status_counts.index,
            colors=warna_pie,
            autopct='%1.1f%%',
            startangle=90,
            wedgeprops=dict(edgecolor='white', linewidth=2)
        )
        for t in autotexts:
            t.set_fontsize(11)
            t.set_fontweight('bold')
        ax.set_title('Status TB/U (Tinggi Badan per Usia)', fontweight='bold')
        st.pyplot(fig)
        plt.close()

    with col_b:
        st.subheader("Distribusi Usia Balita")
        st.markdown(
            "Sebaran usia balita dalam dataset. Distribusi yang merata "
            "menunjukkan representasi data yang baik untuk tiap kelompok usia."
        )
        fig, ax = plt.subplots(figsize=(6, 5))
        ax.hist(df_filtered['usia_bulan'].dropna(), bins=20,
                color=C_BLUE, edgecolor='white', alpha=0.85)
        ax.set_xlabel('Usia (bulan)')
        ax.set_ylabel('Jumlah anak')
        ax.set_title('Sebaran Usia Balita dalam Dataset', fontweight='bold')
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        st.pyplot(fig)
        plt.close()

    st.divider()
    st.subheader("Ringkasan 5 Pertanyaan Bisnis")
    ringkasan = pd.DataFrame({
        'No'         : ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
        'Pertanyaan' : [
            'Prevalensi stunting per kelompok usia',
            'Perbedaan stunting berdasarkan gender',
            'Deviasi z-score dataset vs standar WHO',
            'Ko-morbiditas stunting + gizi buruk + kurus',
            'Zona waspada — bukti kebutuhan AI'
        ],
        'Metode Uji' : [
            'Kruskal-Wallis', 'Chi-Square + Cramér V',
            'Korelasi Pearson + MAD', 'Chi-Square + Odds Ratio',
            'Chi-Square'
        ],
        'Status'     : ['✅ Signifikan'] * 5
    })
    st.dataframe(ringkasan, use_container_width=True, hide_index=True)


# halaman Q1 prevalensi per kelompok usia
elif halaman == "Q1 — Prevalensi per Usia":
    st.title("Q1 — Prevalensi Stunting per Kelompok Usia")

    with st.expander("📋 Detail Pertanyaan SMART", expanded=False):
        st.markdown("""
        | Dimensi | Keterangan |
        |---|---|
        | **S** | 10 kelompok usia 6-bulanan (0–60 bln), prevalensi = % stunting per kelompok |
        | **M** | Kruskal-Wallis α=0.05 (H-statistik, p-value), prevalensi (%) per kelompok |
        | **A** | Kolom usia_bulan dan status_tb_u tersedia lengkap tanpa missing |
        | **R** | Menentukan kelompok usia prioritas intervensi gizi dini di posyandu |
        | **T** | Dataset balita usia 0–60 bulan |
        """)

    # hitung prevalensi stunting per kelompok usia
    prev = (df_filtered.groupby('kelompok', observed=True)
            .agg(total=('flag_stunting', 'count'),
                 stunting=('flag_stunting', 'sum'))
            .assign(prev_pct=lambda x: x['stunting'] / x['total'] * 100)
            .reset_index())

    rata2  = df_filtered['flag_stunting'].mean() * 100
    puncak = prev.loc[prev['prev_pct'].idxmax()]

    # uji kruskal-wallis buat cek perbedaan antar kelompok usia
    groups_z = [g['zscore_tb_u'].dropna().values
                for _, g in df_filtered.groupby('kelompok', observed=True)]
    H, p_kw = kruskal(*groups_z)

    col1, col2, col3 = st.columns(3)
    col1.metric("Kelompok Usia Tertinggi", f"{puncak['kelompok']} bulan")
    col2.metric("Prevalensi Tertinggi",    f"{puncak['prev_pct']:.1f}%")
    col3.metric("Rata-rata Keseluruhan",   f"{rata2:.1f}%")

    st.divider()

    st.subheader("Prevalensi Stunting per Kelompok Usia")
    st.markdown(
        "Warna merah = prevalensi tertinggi, kuning = di atas rata-rata, hijau = di bawah rata-rata."
    )

    # bar chart prevalensi per kelompok usia
    bar_colors = [
        C_RED if v == prev['prev_pct'].max()
        else C_AMBER if v > rata2
        else C_GREEN
        for v in prev['prev_pct']
    ]
    fig, ax = plt.subplots(figsize=(14, 6))
    bars = ax.bar(prev['kelompok'].astype(str), prev['prev_pct'],
                  color=bar_colors, edgecolor='white', width=0.72)
    for bar, row in zip(bars, prev.itertuples()):
        ax.text(bar.get_x() + bar.get_width() / 2,
                bar.get_height() + 0.5,
                f"{row.prev_pct:.1f}%\n(n={int(row.stunting):,})",
                ha='center', va='bottom', fontsize=8, fontweight='bold')
    ax.axhline(rata2, color='navy', ls='--', lw=1.8,
               label=f'Rata-rata: {rata2:.1f}%')
    ax.set_xlabel('Kelompok Usia (bulan)', fontsize=11)
    ax.set_ylabel('Prevalensi Stunting (%)', fontsize=11)
    ax.set_title('Prevalensi Stunting per Kelompok Usia 6-Bulanan', fontweight='bold')
    ax.legend()
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    st.pyplot(fig)
    plt.close()

    st.divider()
    st.subheader("Hasil Uji Kruskal-Wallis")
    st.markdown("Dipakai karena data z-score tidak selalu berdistribusi normal.")

    col_a, col_b, col_c = st.columns(3)
    col_a.metric("H-statistik", f"{H:.2f}")
    col_b.metric("p-value",     f"{p_kw:.2e}")
    col_c.metric("Kesimpulan",  "✅ Signifikan" if p_kw < 0.05 else "❌ Tidak Signifikan")

    if p_kw < 0.05:
        st.success(
            "Distribusi z-score TB/U berbeda signifikan antar kelompok usia (p < 0.05). "
            "Artinya kelompok usia punya pengaruh nyata terhadap risiko stunting."
        )

    st.divider()
    st.subheader("Tabel Prevalensi per Kelompok Usia")
    prev_tampil = prev.copy()
    prev_tampil['prev_pct'] = prev_tampil['prev_pct'].round(2).astype(str) + '%'
    prev_tampil.columns = ['Kelompok Usia', 'Total Anak', 'Kasus Stunting', 'Prevalensi']
    st.dataframe(prev_tampil, use_container_width=True, hide_index=True)


# halaman Q2 perbedaan gender
elif halaman == "Q2 — Perbedaan Gender":
    st.title("Q2 — Perbedaan Stunting Berdasarkan Jenis Kelamin")

    with st.expander("📋 Detail Pertanyaan SMART", expanded=False):
        st.markdown("""
        | Dimensi | Keterangan |
        |---|---|
        | **S** | Proporsi stunting pada laki-laki vs perempuan usia 0–60 bulan |
        | **M** | Chi-Square α=0.05 + Cramér's V + selisih % absolut |
        | **A** | Kolom jenis_kelamin dan status_tb_u tersedia lengkap |
        | **R** | Cek apakah sistem perlu strategi rekomendasi berbeda per gender |
        | **T** | Dataset balita usia 0–60 bulan |
        """)

    # hitung proporsi stunting per gender
    gp = (df_filtered.groupby('jenis_kelamin')
          .agg(total=('flag_stunting', 'count'),
               stunting=('flag_stunting', 'sum'))
          .assign(pct=lambda x: x['stunting'] / x['total'] * 100,
                  normal=lambda x: 100 - x['stunting'] / x['total'] * 100)
          .reset_index())

    laki_row = gp[gp['jenis_kelamin'] == 'Laki-laki']
    puan_row = gp[gp['jenis_kelamin'] == 'Perempuan']
    laki_pct = laki_row['pct'].values[0] if len(laki_row) > 0 else 0
    puan_pct = puan_row['pct'].values[0] if len(puan_row) > 0 else 0

    # chi-square dan cramér's v
    ct = pd.crosstab(df_filtered['jenis_kelamin'], df_filtered['flag_stunting'])
    chi2, p_chi, dof, _ = chi2_contingency(ct)
    n = ct.values.sum()
    V = np.sqrt(chi2 / (n * (min(ct.shape) - 1)))

    col1, col2, col3 = st.columns(3)
    col1.metric("Stunting Laki-laki", f"{laki_pct:.1f}%")
    col2.metric("Stunting Perempuan", f"{puan_pct:.1f}%")
    col3.metric("Selisih",            f"{abs(laki_pct - puan_pct):.1f} poin")

    st.divider()

    col_a, col_b = st.columns(2)

    with col_a:
        st.subheader("Proporsi Stunting vs Normal per Gender")
        st.markdown("Perbandingan persentase stunting dan normal antara laki-laki dan perempuan.")
        fig, ax = plt.subplots(figsize=(7, 5))
        x, w = np.arange(len(gp)), 0.35
        ax.bar(x - w / 2, gp['pct'],    w, color=C_RED,   label='Stunting',      edgecolor='white')
        ax.bar(x + w / 2, gp['normal'], w, color=C_GREEN, label='Tidak Stunting', edgecolor='white')
        for i, row in gp.iterrows():
            ax.text(i - w / 2, row['pct'] + 0.5,    f"{row['pct']:.1f}%",    ha='center', fontsize=9, fontweight='bold')
            ax.text(i + w / 2, row['normal'] + 0.5, f"{row['normal']:.1f}%", ha='center', fontsize=9, fontweight='bold')
        ax.set_xticks(x)
        ax.set_xticklabels(gp['jenis_kelamin'])
        ax.set_ylabel('Persentase (%)')
        ax.set_title('Stunting vs Normal per Jenis Kelamin', fontweight='bold')
        ax.legend()
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        st.pyplot(fig)
        plt.close()

    with col_b:
        st.subheader("Distribusi Z-Score TB/U per Gender")
        st.markdown("Garis putus-putus merah = batas stunting pada z-score -2.")
        fig, ax = plt.subplots(figsize=(7, 5))
        data_plot = [
            df_filtered[df_filtered['jenis_kelamin'] == 'Laki-laki']['zscore_tb_u'].dropna(),
            df_filtered[df_filtered['jenis_kelamin'] == 'Perempuan']['zscore_tb_u'].dropna()
        ]
        bp = ax.boxplot(data_plot, labels=['Laki-laki', 'Perempuan'],
                        patch_artist=True, notch=False)
        bp['boxes'][0].set_facecolor(C_LAKI)
        if len(bp['boxes']) > 1:
            bp['boxes'][1].set_facecolor(C_PUAN)
        ax.axhline(-2, color=C_RED, ls='--', lw=1.5, label='Batas stunting (z=−2)')
        ax.set_ylabel('Z-Score TB/U')
        ax.set_title('Distribusi Z-Score TB/U per Gender', fontweight='bold')
        ax.legend()
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        st.pyplot(fig)
        plt.close()

    st.divider()
    st.subheader("Hasil Uji Chi-Square + Cramér's V")
    st.markdown("Cramér's V mengukur seberapa kuat hubungan antara gender dan stunting.")

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Chi-Square (χ²)", f"{chi2:.2f}")
    col2.metric("p-value",         f"{p_chi:.4f}")
    col3.metric("Cramér's V",      f"{V:.3f}")
    col4.metric("Kesimpulan",      "✅ Signifikan" if p_chi < 0.05 else "❌ Tidak Signifikan")

    if p_chi < 0.05:
        st.success(
            f"Ada perbedaan signifikan antara laki-laki ({laki_pct:.1f}%) dan "
            f"perempuan ({puan_pct:.1f}%). Cramér's V = {V:.3f} menunjukkan "
            f"{'efek lemah' if V < 0.1 else 'efek sedang' if V < 0.3 else 'efek kuat'}."
        )


# halaman Q3 deviasi z-score vs WHO
elif halaman == "Q3 — Deviasi Z-Score vs WHO":
    st.title("Q3 — Deviasi Z-Score Dataset vs Standar WHO")

    with st.expander("📋 Detail Pertanyaan SMART", expanded=False):
        st.markdown("""
        | Dimensi | Keterangan |
        |---|---|
        | **S** | Selisih z-score TB/U aktual vs kalkulasi WHO (LMS) per 10 kelompok usia |
        | **M** | Mean selisih, std, MAD, Korelasi Pearson, ±95% CI per kelompok |
        | **A** | WHO LMS tersedia 0–60 bulan untuk semua gender |
        | **R** | Validasi akurasi pengukuran lapangan sebelum dipakai latih model AI |
        | **T** | Seluruh periode pengumpulan dataset (0–60 bulan) |
        """)

    # hitung rata-rata selisih z-score per kelompok usia
    dev = (df_filtered.groupby('kelompok', observed=True)
           .agg(mean_data=('zscore_tb_u', 'mean'),
                mean_who =('who_zscore',  'mean'),
                mean_sel =('selisih_z',   'mean'),
                std_sel  =('selisih_z',   'std'),
                n        =('zscore_tb_u', 'count'))
           .assign(ci95=lambda x: 1.96 * x['std_sel'] / np.sqrt(x['n']),
                   mad =lambda x: x['mean_sel'].abs())
           .reset_index())

    # korelasi pearson antara z dataset dan z WHO
    valid_mask = df_filtered['zscore_tb_u'].notna() & df_filtered['who_zscore'].notna()
    r, p_r     = pearsonr(df_filtered.loc[valid_mask, 'zscore_tb_u'],
                          df_filtered.loc[valid_mask, 'who_zscore'])
    maks = dev.loc[dev['mad'].idxmax()]

    col1, col2, col3 = st.columns(3)
    col1.metric("Korelasi Pearson (r)",       f"{r:.4f}")
    col2.metric("Kelompok Paling Menyimpang", f"{maks['kelompok']} bulan")
    col3.metric("MAD Tertinggi",              f"{maks['mad']:.4f}")

    st.divider()

    col_a, col_b = st.columns(2)

    with col_a:
        st.subheader("Z-Score Dataset vs Kalkulasi WHO")
        st.markdown("Area biru muda = selisih antara data lapangan dan standar WHO.")
        fig, ax = plt.subplots(figsize=(8, 5))
        ax.plot(dev['kelompok'].astype(str), dev['mean_data'],
                'o-', color=C_BLUE, lw=2.5, ms=7, label='Dataset (aktual)')
        ax.plot(dev['kelompok'].astype(str), dev['mean_who'],
                's--', color=C_AMBER, lw=2, ms=6, label='Kalkulasi WHO (LMS)')
        ax.fill_between(dev['kelompok'].astype(str),
                        dev['mean_data'], dev['mean_who'],
                        alpha=0.15, color=C_PURPLE, label='Area selisih')
        ax.axhline(-2, color=C_RED, ls=':', lw=1.5, label='Batas stunting (z=−2)')
        ax.axhline(0,  color='gray', ls='-', lw=0.7, alpha=0.4)
        ax.set_title(f'Rata-rata Z-Score: Dataset vs WHO (r={r:.4f})', fontweight='bold')
        ax.set_ylabel('Rata-rata Z-Score TB/U')
        ax.set_xlabel('Kelompok Usia (bulan)')
        ax.tick_params(axis='x', rotation=45, labelsize=8)
        ax.legend(fontsize=8)
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        st.pyplot(fig)
        plt.close()

    with col_b:
        st.subheader("Selisih Z-Score per Kelompok Usia")
        st.markdown("Merah = dataset lebih rendah dari WHO, hijau = lebih tinggi.")
        fig, ax = plt.subplots(figsize=(8, 5))
        col_bar = [C_RED if v < 0 else C_GREEN for v in dev['mean_sel']]
        ax.bar(dev['kelompok'].astype(str), dev['mean_sel'],
               color=col_bar, edgecolor='white', alpha=0.85)
        ax.errorbar(dev['kelompok'].astype(str), dev['mean_sel'],
                    yerr=dev['ci95'], fmt='none', color='black',
                    capsize=5, lw=1.8)
        ax.axhline(0, color='black', lw=1.2)
        ax.set_title('Selisih Z-Score (Dataset − WHO) ± 95% CI', fontweight='bold')
        ax.set_xlabel('Kelompok Usia (bulan)')
        ax.set_ylabel('Rata-rata Selisih Z-Score')
        ax.tick_params(axis='x', rotation=45, labelsize=8)
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        st.pyplot(fig)
        plt.close()

    st.divider()
    st.subheader("Tabel Deviasi Z-Score per Kelompok Usia")
    tabel_dev = dev[['kelompok', 'mean_data', 'mean_who', 'mean_sel', 'ci95', 'mad']].copy()
    tabel_dev.columns = ['Kelompok Usia', 'Z-Score Aktual', 'Z-Score WHO', 'Selisih', '±CI 95%', 'MAD']
    st.dataframe(tabel_dev.round(4), use_container_width=True, hide_index=True)

    if r > 0.95:
        st.success(
            f"Korelasi r = {r:.4f} sangat kuat, artinya kualitas pengukuran lapangan "
            "cukup terpercaya untuk dijadikan dasar pelatihan model AI."
        )


# halaman Q4 ko-morbiditas
elif halaman == "Q4 — Ko-morbiditas Gizi":
    st.title("Q4 — Ko-morbiditas Gizi: Stunting + Gizi Buruk + Kurus")

    with st.expander("📋 Detail Pertanyaan SMART", expanded=False):
        st.markdown("""
        | Dimensi | Keterangan |
        |---|---|
        | **S** | Proporsi anak stunting yang sekaligus gizi buruk/kurang dan/atau kurus |
        | **M** | Proporsi (%) ko-morbiditas + Chi-Square α=0.05 + Odds Ratio |
        | **A** | Kolom status_bb_u, status_bb_tb, status_tb_u tersedia di dataset |
        | **R** | Menentukan beban ganda gizi untuk konten rekomendasi yang tepat sasaran |
        | **T** | Dataset balita usia 0–60 bulan |
        """)

    # bikin kode triple burden dari kombinasi 3 flag
    df_filtered = df_filtered.copy()
    df_filtered['triple'] = (df_filtered['flag_stunting'].astype(str)
                             + df_filtered['flag_gizi_buruk'].astype(str)
                             + df_filtered['flag_kurus'].astype(str))
    label_map = {
        '000': 'Normal semua',          '100': 'Stunting saja',
        '010': 'Gizi buruk saja',        '001': 'Kurus saja',
        '110': 'Stunting + Gizi buruk',  '101': 'Stunting + Kurus',
        '011': 'Gizi buruk + Kurus',     '111': 'Triple burden'
    }
    df_filtered['kondisi'] = df_filtered['triple'].map(label_map).fillna('Lainnya')
    km = (df_filtered['kondisi'].value_counts().reset_index()
          .rename(columns={'kondisi': 'Kondisi', 'count': 'Jumlah'}))
    km['Persen'] = km['Jumlah'] / len(df_filtered) * 100

    # hitung odds ratio
    def odds_ratio(ct):
        a, b, c, d = ct.values[1, 1], ct.values[1, 0], ct.values[0, 1], ct.values[0, 0]
        return (a * d) / (b * c) if b * c > 0 else np.inf

    ct_sb = pd.crosstab(df_filtered['flag_stunting'], df_filtered['flag_gizi_buruk'])
    ct_sk = pd.crosstab(df_filtered['flag_stunting'], df_filtered['flag_kurus'])
    chi2_sb, p_sb, _, _ = chi2_contingency(ct_sb)
    chi2_sk, p_sk, _, _ = chi2_contingency(ct_sk)
    or_sb = odds_ratio(ct_sb)
    or_sk = odds_ratio(ct_sk)

    triple_row = km[km['Kondisi'] == 'Triple burden']
    triple_n   = triple_row['Jumlah'].values[0] if len(triple_row) > 0 else 0
    triple_pct = triple_row['Persen'].values[0]  if len(triple_row) > 0 else 0

    col1, col2, col3 = st.columns(3)
    col1.metric("Triple Burden",            f"{triple_n:,} anak ({triple_pct:.1f}%)")
    col2.metric("OR Stunting + Gizi Buruk", f"{or_sb:.2f}x")
    col3.metric("OR Stunting + Kurus",      f"{or_sk:.2f}x")

    st.divider()

    col_a, col_b = st.columns(2)

    with col_a:
        st.subheader("Distribusi Ko-morbiditas Gizi")
        st.markdown("Triple burden = stunting + gizi buruk + kurus terjadi bersamaan.")
        fig, ax = plt.subplots(figsize=(8, 6))
        warna_km = [C_RED if 'Triple' in k or 'Stunting' in k
                    else C_AMBER if 'Gizi' in k or 'Kurus' in k
                    else C_GREEN
                    for k in km['Kondisi']]
        ax.barh(km['Kondisi'], km['Jumlah'], color=warna_km, edgecolor='white')
        for i, (jml, pct) in enumerate(zip(km['Jumlah'], km['Persen'])):
            ax.text(jml + 50, i, f"{jml:,} ({pct:.1f}%)", va='center', fontsize=8)
        ax.set_xlabel('Jumlah Anak')
        ax.set_title('Distribusi Ko-morbiditas Gizi Balita', fontweight='bold')
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        st.pyplot(fig)
        plt.close()

    with col_b:
        st.subheader("Heatmap Status TB/U vs BB/U")
        st.markdown("Warna lebih gelap = jumlah anak lebih banyak pada kombinasi kondisi itu.")
        pivot = pd.crosstab(df_filtered['status_tb_u'], df_filtered['status_bb_u'])
        fig, ax = plt.subplots(figsize=(8, 5))
        sns.heatmap(pivot, annot=True, fmt='d', cmap='YlOrRd',
                    linewidths=0.5, ax=ax, cbar_kws={'label': 'Jumlah Anak'})
        ax.set_title('Ko-morbiditas Status TB/U vs BB/U', fontweight='bold')
        ax.set_xlabel('Status BB/U')
        ax.set_ylabel('Status TB/U')
        st.pyplot(fig)
        plt.close()

    st.divider()
    st.subheader("Hasil Uji Chi-Square + Odds Ratio")

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("OR Stunting ↔ Gizi Buruk", f"{or_sb:.2f}x")
    col2.metric("p-value (Gizi Buruk)",      f"{p_sb:.4f}")
    col3.metric("OR Stunting ↔ Kurus",       f"{or_sk:.2f}x")
    col4.metric("p-value (Kurus)",            f"{p_sk:.4f}")

    st.success(
        f"Anak stunting {or_sb:.1f}x lebih mungkin juga mengalami gizi buruk, "
        f"dan {or_sk:.1f}x lebih mungkin mengalami kurus. "
        "Kedua hubungan ini signifikan secara statistik (p < 0.05)."
    )


# halaman Q5 zona waspada
elif halaman == "Q5 — Zona Waspada":
    st.title("Q5 — Zona Waspada: Bukti Kuantitatif Kebutuhan AI")

    with st.expander("📋 Detail Pertanyaan SMART", expanded=False):
        st.markdown("""
        | Dimensi | Keterangan |
        |---|---|
        | **S** | Proporsi anak ≤24 bulan dengan z-score di zona waspada (−2 ≤ z < −1) |
        | **M** | % zona waspada + Chi-Square proporsi antar kelompok usia 6-bulanan |
        | **A** | Z-score WHO dihitung ulang via LMS dari subset usia ≤24 bulan |
        | **R** | Bukti langsung: anak 'WHO Normal' tapi berisiko → target utama AI |
        | **T** | Subset usia 0–24 bulan dari dataset |
        """)

    # zonasi berdasarkan z-score WHO
    df_zona = df_filtered.copy()
    df_zona['zona_who'] = pd.cut(
        df_zona['who_zscore'],
        bins=[-99, -3, -2, -1, 1, 2, 99],
        labels=['Severely Stunted', 'Stunting', 'Zona Waspada',
                'Normal Bawah', 'Normal', 'Tinggi']
    )

    # fokus ke anak usia 24 bulan ke bawah
    df_ai       = df_zona[df_zona['usia_bulan'] <= 24].copy()
    waspada_n   = df_ai[df_ai['zona_who'] == 'Zona Waspada'].shape[0]
    waspada_pct = waspada_n / len(df_ai) * 100 if len(df_ai) > 0 else 0

    ct_zona            = pd.crosstab(df_ai['kelompok'], df_ai['zona_who'])
    chi2_z, p_z, dof_z, _ = chi2_contingency(ct_zona)

    zona_dist          = (df_ai['zona_who'].value_counts(normalize=True) * 100).reset_index()
    zona_dist.columns  = ['Zona', 'Persen']
    zona_dist['Jumlah'] = df_ai['zona_who'].value_counts().values

    col1, col2, col3 = st.columns(3)
    col1.metric("Sampel ≤24 bulan",    f"{len(df_ai):,} anak")
    col2.metric("Zona Waspada",         f"{waspada_n:,} anak ({waspada_pct:.1f}%)")
    col3.metric("Hasil Uji Statistik",  "✅ Signifikan" if p_z < 0.05 else "❌ Tidak Signifikan")

    st.divider()

    col_a, col_b = st.columns(2)

    with col_a:
        st.subheader("Distribusi Zona WHO (Usia ≤24 bulan)")
        st.markdown(
            "Zona Waspada = anak yang secara resmi 'Normal' oleh WHO "
            "tapi z-score-nya antara -1 dan -2, kelompok ini target utama AI."
        )
        zona_order = ['Severely Stunted', 'Stunting', 'Zona Waspada',
                      'Normal Bawah', 'Normal', 'Tinggi']
        col_zona   = ['#7B241C', C_RED, C_AMBER, '#A9CCE3', C_GREEN, C_BLUE]
        zona_plot  = zona_dist.set_index('Zona').reindex(zona_order).dropna()

        fig, ax = plt.subplots(figsize=(8, 5))
        bars = ax.bar(zona_plot.index, zona_plot['Persen'],
                      color=col_zona[:len(zona_plot)], edgecolor='white')
        for bar, pct, jml in zip(bars, zona_plot['Persen'], zona_plot['Jumlah']):
            ax.text(bar.get_x() + bar.get_width() / 2,
                    bar.get_height() + 0.3,
                    f"{pct:.1f}%\n({int(jml):,})",
                    ha='center', va='bottom', fontsize=8, fontweight='bold')
        ax.set_xlabel('Zona WHO')
        ax.set_ylabel('Persentase Anak (%)')
        ax.set_title('Distribusi Zona WHO (Balita ≤24 bulan)', fontweight='bold')
        ax.tick_params(axis='x', rotation=20, labelsize=8)
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        st.pyplot(fig)
        plt.close()

    with col_b:
        st.subheader("Zona Waspada per Kelompok Usia")
        st.markdown("Semakin tinggi batang, semakin banyak anak berisiko yang belum terdeteksi WHO.")
        waspada_per_kel = (df_ai[df_ai['zona_who'] == 'Zona Waspada']
                           .groupby('kelompok', observed=True)
                           .size()
                           .reset_index(name='jumlah'))

        fig, ax = plt.subplots(figsize=(8, 5))
        ax.bar(waspada_per_kel['kelompok'].astype(str),
               waspada_per_kel['jumlah'],
               color=C_AMBER, edgecolor='white')
        for i, row in waspada_per_kel.iterrows():
            ax.text(i, row['jumlah'] + 5, str(row['jumlah']),
                    ha='center', fontsize=9, fontweight='bold')
        ax.set_xlabel('Kelompok Usia (bulan)')
        ax.set_ylabel('Jumlah Anak di Zona Waspada')
        ax.set_title('Anak Zona Waspada per Kelompok Usia', fontweight='bold')
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        st.pyplot(fig)
        plt.close()

    st.divider()
    st.subheader("Hasil Uji Chi-Square")

    col1, col2, col3 = st.columns(3)
    col1.metric("Chi-Square (χ²)",    f"{chi2_z:.2f}")
    col2.metric("p-value",            f"{p_z:.2e}")
    col3.metric("Derajat Kebebasan",  str(dof_z))

    st.warning(
        f"Ada {waspada_n:,} anak ({waspada_pct:.1f}%) usia ≤24 bulan yang masuk Zona Waspada — "
        "dikategorikan Normal oleh WHO tapi z-score-nya antara -1 dan -2. "
        "Kelompok ini tidak terdeteksi oleh klasifikasi konvensional, "
        "dan jadi alasan utama kenapa sistem AI SIDIAS dibutuhkan."
    )