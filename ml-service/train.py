import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

print("Loading dataset...")
CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'Autism.csv')
df = pd.read_csv(CSV_PATH)

print(f"Dataset shape: {df.shape}")
print(df['Class/ASD'].value_counts())

# ── Preprocessing ──────────────────────────────────────────
# Replace '?' with NaN
df.replace('?', np.nan, inplace=True)

# Fix age outlier (383 → median)
df['age'] = pd.to_numeric(df['age'], errors='coerce')
df['age'].fillna(df['age'].median(), inplace=True)
df['age'] = df['age'].clip(upper=100)

# Fill missing categoricals with mode
for col in ['ethnicity', 'relation']:
    df[col].fillna(df[col].mode()[0], inplace=True)

# Encode binary columns
df['gender'] = df['gender'].map({'m': 0, 'f': 1}).fillna(0)
df['jundice'] = df['jundice'].map({'no': 0, 'yes': 1}).fillna(0)
df['austim'] = df['austim'].map({'no': 0, 'yes': 1}).fillna(0)
df['used_app_before'] = df['used_app_before'].map({'no': 0, 'yes': 1}).fillna(0)
df['Class/ASD'] = df['Class/ASD'].map({'NO': 0, 'YES': 1})

# Encode categorical strings
le_eth = LabelEncoder()
le_rel = LabelEncoder()
le_ctr = LabelEncoder()

df['ethnicity_enc'] = le_eth.fit_transform(df['ethnicity'].astype(str))
df['relation_enc'] = le_rel.fit_transform(df['relation'].astype(str))
df['contry_enc'] = le_ctr.fit_transform(df['contry_of_res'].astype(str))

# Feature columns
FEATURE_COLS = [
    'A1_Score','A2_Score','A3_Score','A4_Score','A5_Score',
    'A6_Score','A7_Score','A8_Score','A9_Score','A10_Score',
    'age','gender','jundice','austim','used_app_before',
    'ethnicity_enc','relation_enc','contry_enc'
]

X = df[FEATURE_COLS].values
y = df['Class/ASD'].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

print("\nTraining Random Forest Classifier...")
clf = RandomForestClassifier(n_estimators=200, max_depth=None, random_state=42, class_weight='balanced')
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"\nTest Accuracy: {acc:.4f}")
print(classification_report(y_test, y_pred, target_names=['NO (Low Likelihood)', 'YES (High Likelihood)']))

# Save model + encoders
save_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
joblib.dump({
    'model': clf,
    'le_eth': le_eth,
    'le_rel': le_rel,
    'le_ctr': le_ctr,
    'feature_cols': FEATURE_COLS,
    'accuracy': acc
}, save_path)

print(f"\nModel saved to {save_path}")
