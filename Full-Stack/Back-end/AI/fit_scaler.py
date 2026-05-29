import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib

def main():
    # Path dataset clean
    dataset_path = '../../data_science/data/processed/dataset_stunting_clean.csv'
    
    if not os.path.exists(dataset_path):
        # Fallback if path relative is different (e.g. executed from project root)
        dataset_path = 'data_science/data/processed/dataset_stunting_clean.csv'
        
    print(f"Loading dataset from: {dataset_path}")
    df = pd.read_csv(dataset_path)
    
    # 1. Feature Creation
    df['imt'] = df['berat_badan'] / ((df['tinggi_badan'] / 100) ** 2)
    df['tinggi_per_usia'] = df['tinggi_badan'] / (df['usia_bulan'] + 1)
    
    # 2. Encoding
    le_jk = LabelEncoder()
    df['jenis_kelamin_encoded'] = le_jk.fit_transform(df['jenis_kelamin'])
    
    le_target = LabelEncoder()
    df['status_tb_u_encoded'] = le_target.fit_transform(df['status_tb_u'])
    
    # 3. Features selection
    fitur_pilihan = ['usia_bulan', 'jenis_kelamin_encoded', 'tinggi_badan', 'berat_badan', 'imt', 'tinggi_per_usia']
    X = df[fitur_pilihan]
    y = df['status_tb_u_encoded']
    
    # 4. Train-Test Split (80:20, stratify, random_state=42)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # 5. Fit Scaler
    print("Fitting StandardScaler on X_train...")
    scaler = StandardScaler()
    scaler.fit(X_train)
    
    # 6. Save Scaler
    output_dir = 'Full-Stack/Back-End/AI'
    if not os.path.exists(output_dir):
        output_dir = 'AI'  # If running inside Back-End folder
        
    os.makedirs(output_dir, exist_ok=True)
    scaler_path = os.path.join(output_dir, 'scaler.pkl')
    joblib.dump(scaler, scaler_path)
    print(f"StandardScaler fit successfully and saved to: {scaler_path}")

if __name__ == '__main__':
    main()
