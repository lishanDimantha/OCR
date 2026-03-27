"""
Comprehensive Drug Database
Common + Uncommon drug names, generics, brand names
"""
import csv
import os

# ── Brand names + Generic names ───────────────────────────
DRUG_DATABASE = {

    # ── Antibiotics ───────────────────────────────────────
    "AMOXICILLIN":      {"generic": "Amoxicillin", "class": "Antibiotic", "use": "Bacterial infections"},
    "AMOXIL":           {"generic": "Amoxicillin", "class": "Antibiotic", "use": "Bacterial infections"},
    "AUGMENTIN":        {"generic": "Amoxicillin+Clavulanate", "class": "Antibiotic", "use": "Bacterial infections"},
    "COAMOXICLAV":      {"generic": "Amoxicillin+Clavulanate", "class": "Antibiotic", "use": "Bacterial infections"},
    "CO-AMOXICLAV":     {"generic": "Amoxicillin+Clavulanate", "class": "Antibiotic", "use": "Bacterial infections"},
    "AMOXICLAVULANATE": {"generic": "Amoxicillin+Clavulanate", "class": "Antibiotic", "use": "Bacterial infections"},
    "AZITHROMYCIN":     {"generic": "Azithromycin", "class": "Antibiotic", "use": "Respiratory infections"},
    "ZITHROMAX":        {"generic": "Azithromycin", "class": "Antibiotic", "use": "Respiratory infections"},
    "AZEE":             {"generic": "Azithromycin", "class": "Antibiotic", "use": "Respiratory infections"},
    "CIPROFLOXACIN":    {"generic": "Ciprofloxacin", "class": "Antibiotic", "use": "UTI, bacterial infections"},
    "CIPRO":            {"generic": "Ciprofloxacin", "class": "Antibiotic", "use": "UTI, bacterial infections"},
    "CIPLOX":           {"generic": "Ciprofloxacin", "class": "Antibiotic", "use": "UTI, bacterial infections"},
    "METRONIDAZOLE":    {"generic": "Metronidazole", "class": "Antibiotic", "use": "Anaerobic infections"},
    "FLAGYL":           {"generic": "Metronidazole", "class": "Antibiotic", "use": "Anaerobic infections"},
    "CLINDAMYCIN":      {"generic": "Clindamycin", "class": "Antibiotic", "use": "Skin, bone infections"},
    "DOXYCYCLINE":      {"generic": "Doxycycline", "class": "Antibiotic", "use": "Respiratory, skin infections"},
    "CEPHALEXIN":       {"generic": "Cephalexin", "class": "Antibiotic", "use": "Skin, respiratory infections"},
    "CEFALEXIN":        {"generic": "Cephalexin", "class": "Antibiotic", "use": "Skin, respiratory infections"},
    "CEFUROXIME":       {"generic": "Cefuroxime", "class": "Antibiotic", "use": "Respiratory infections"},
    "CEFTRIAXONE":      {"generic": "Ceftriaxone", "class": "Antibiotic", "use": "Severe infections"},
    "LEVOFLOXACIN":     {"generic": "Levofloxacin", "class": "Antibiotic", "use": "Respiratory infections"},
    "LEVAQUIN":         {"generic": "Levofloxacin", "class": "Antibiotic", "use": "Respiratory infections"},
    "MOXIFLOXACIN":     {"generic": "Moxifloxacin", "class": "Antibiotic", "use": "Respiratory infections"},
    "TRIMETHOPRIM":     {"generic": "Trimethoprim", "class": "Antibiotic", "use": "UTI"},
    "COTRIMOXAZOLE":    {"generic": "Trimethoprim+Sulfamethoxazole", "class": "Antibiotic", "use": "UTI, infections"},
    "BACTRIM":          {"generic": "Trimethoprim+Sulfamethoxazole", "class": "Antibiotic", "use": "UTI"},
    "NITROFURANTOIN":   {"generic": "Nitrofurantoin", "class": "Antibiotic", "use": "UTI"},
    "CLARITHROMYCIN":   {"generic": "Clarithromycin", "class": "Antibiotic", "use": "Respiratory infections"},
    "KLACID":           {"generic": "Clarithromycin", "class": "Antibiotic", "use": "Respiratory infections"},
    "ERYTHROMYCIN":     {"generic": "Erythromycin", "class": "Antibiotic", "use": "Respiratory, skin infections"},
    "VANCOMYCIN":       {"generic": "Vancomycin", "class": "Antibiotic", "use": "MRSA infections"},
    "LINEZOLID":        {"generic": "Linezolid", "class": "Antibiotic", "use": "Resistant infections"},
    "MEROPENEM":        {"generic": "Meropenem", "class": "Antibiotic", "use": "Severe infections"},
    "IMIPENEM":         {"generic": "Imipenem", "class": "Antibiotic", "use": "Severe infections"},
    "PIPERACILLIN":     {"generic": "Piperacillin+Tazobactam", "class": "Antibiotic", "use": "Severe infections"},
    "TAZOBACTAM":       {"generic": "Piperacillin+Tazobactam", "class": "Antibiotic", "use": "Severe infections"},

    # ── Pain / Fever ──────────────────────────────────────
    "PARACETAMOL":      {"generic": "Paracetamol", "class": "Analgesic", "use": "Pain, fever"},
    "ACETAMINOPHEN":    {"generic": "Paracetamol", "class": "Analgesic", "use": "Pain, fever"},
    "TYLENOL":          {"generic": "Paracetamol", "class": "Analgesic", "use": "Pain, fever"},
    "CALPOL":           {"generic": "Paracetamol", "class": "Analgesic", "use": "Pain, fever"},
    "IBUPROFEN":        {"generic": "Ibuprofen", "class": "NSAID", "use": "Pain, inflammation"},
    "BRUFEN":           {"generic": "Ibuprofen", "class": "NSAID", "use": "Pain, inflammation"},
    "ADVIL":            {"generic": "Ibuprofen", "class": "NSAID", "use": "Pain, inflammation"},
    "DICLOFENAC":       {"generic": "Diclofenac", "class": "NSAID", "use": "Pain, inflammation"},
    "VOLTAREN":         {"generic": "Diclofenac", "class": "NSAID", "use": "Pain, inflammation"},
    "NAPROXEN":         {"generic": "Naproxen", "class": "NSAID", "use": "Pain, inflammation"},
    "CELECOXIB":        {"generic": "Celecoxib", "class": "NSAID", "use": "Arthritis pain"},
    "CELEBREX":         {"generic": "Celecoxib", "class": "NSAID", "use": "Arthritis pain"},
    "TRAMADOL":         {"generic": "Tramadol", "class": "Opioid analgesic", "use": "Moderate-severe pain"},
    "MORPHINE":         {"generic": "Morphine", "class": "Opioid", "use": "Severe pain"},
    "CODEINE":          {"generic": "Codeine", "class": "Opioid", "use": "Mild-moderate pain"},
    "MEFENAMIC":        {"generic": "Mefenamic acid", "class": "NSAID", "use": "Pain, dysmenorrhea"},
    "PONSTAN":          {"generic": "Mefenamic acid", "class": "NSAID", "use": "Pain, dysmenorrhea"},
    "KETOROLAC":        {"generic": "Ketorolac", "class": "NSAID", "use": "Short-term pain"},
    "ASPIRIN":          {"generic": "Aspirin", "class": "NSAID/Antiplatelet", "use": "Pain, blood clots"},
    "ASPOCID":          {"generic": "Aspirin", "class": "Antiplatelet", "use": "Heart protection"},
    "ECOSPRIN":         {"generic": "Aspirin", "class": "Antiplatelet", "use": "Heart protection"},

    # ── Heart / Blood Pressure ────────────────────────────
    "AMLODIPINE":       {"generic": "Amlodipine", "class": "CCB", "use": "Hypertension, angina"},
    "NORVASC":          {"generic": "Amlodipine", "class": "CCB", "use": "Hypertension"},
    "ATENOLOL":         {"generic": "Atenolol", "class": "Beta-blocker", "use": "Hypertension, angina"},
    "METOPROLOL":       {"generic": "Metoprolol", "class": "Beta-blocker", "use": "Hypertension, heart failure"},
    "LOPRESSOR":        {"generic": "Metoprolol", "class": "Beta-blocker", "use": "Hypertension"},
    "BISOPROLOL":       {"generic": "Bisoprolol", "class": "Beta-blocker", "use": "Hypertension, heart failure"},
    "CONCOR":           {"generic": "Bisoprolol", "class": "Beta-blocker", "use": "Heart failure"},
    "CARVEDILOL":       {"generic": "Carvedilol", "class": "Beta-blocker", "use": "Heart failure"},
    "LISINOPRIL":       {"generic": "Lisinopril", "class": "ACE inhibitor", "use": "Hypertension, heart failure"},
    "ENALAPRIL":        {"generic": "Enalapril", "class": "ACE inhibitor", "use": "Hypertension"},
    "RAMIPRIL":         {"generic": "Ramipril", "class": "ACE inhibitor", "use": "Hypertension, heart failure"},
    "CAPTOPRIL":        {"generic": "Captopril", "class": "ACE inhibitor", "use": "Hypertension"},
    "LOSARTAN":         {"generic": "Losartan", "class": "ARB", "use": "Hypertension"},
    "COZAAR":           {"generic": "Losartan", "class": "ARB", "use": "Hypertension"},
    "VALSARTAN":        {"generic": "Valsartan", "class": "ARB", "use": "Hypertension, heart failure"},
    "TELMISARTAN":      {"generic": "Telmisartan", "class": "ARB", "use": "Hypertension"},
    "IRBESARTAN":       {"generic": "Irbesartan", "class": "ARB", "use": "Hypertension"},
    "FUROSEMIDE":       {"generic": "Furosemide", "class": "Diuretic", "use": "Edema, heart failure"},
    "LASIX":            {"generic": "Furosemide", "class": "Diuretic", "use": "Edema, heart failure"},
    "HYDROCHLOROTHIAZIDE": {"generic": "Hydrochlorothiazide", "class": "Diuretic", "use": "Hypertension"},
    "HCTZ":             {"generic": "Hydrochlorothiazide", "class": "Diuretic", "use": "Hypertension"},
    "SPIRONOLACTONE":   {"generic": "Spironolactone", "class": "Diuretic", "use": "Heart failure, edema"},
    "DIGOXIN":          {"generic": "Digoxin", "class": "Cardiac glycoside", "use": "Heart failure, AF"},
    "WARFARIN":         {"generic": "Warfarin", "class": "Anticoagulant", "use": "Blood clot prevention"},
    "NICOUMALONE":      {"generic": "Acenocoumarol", "class": "Anticoagulant", "use": "Blood clot prevention"},
    "ACENOCOUMAROL":    {"generic": "Acenocoumarol", "class": "Anticoagulant", "use": "Blood clot prevention"},
    "CLOPIDOGREL":      {"generic": "Clopidogrel", "class": "Antiplatelet", "use": "Blood clot prevention"},
    "PLAVIX":           {"generic": "Clopidogrel", "class": "Antiplatelet", "use": "Blood clot prevention"},
    "TICAGRELOR":       {"generic": "Ticagrelor", "class": "Antiplatelet", "use": "ACS, blood clots"},
    "BRILINTA":         {"generic": "Ticagrelor", "class": "Antiplatelet", "use": "ACS"},
    "RIVAROXABAN":      {"generic": "Rivaroxaban", "class": "Anticoagulant", "use": "Blood clot prevention"},
    "XARELTO":          {"generic": "Rivaroxaban", "class": "Anticoagulant", "use": "Blood clot prevention"},
    "APIXABAN":         {"generic": "Apixaban", "class": "Anticoagulant", "use": "Blood clot prevention"},
    "ELIQUIS":          {"generic": "Apixaban", "class": "Anticoagulant", "use": "Blood clot prevention"},
    "DABIGATRAN":       {"generic": "Dabigatran", "class": "Anticoagulant", "use": "Blood clot prevention"},
    "NITROGLYCERIN":    {"generic": "Nitroglycerin", "class": "Nitrate", "use": "Angina"},
    "ISOSORBIDE":       {"generic": "Isosorbide dinitrate", "class": "Nitrate", "use": "Angina"},
    "AMIODARONE":       {"generic": "Amiodarone", "class": "Antiarrhythmic", "use": "Arrhythmia"},

    # ── Cholesterol ───────────────────────────────────────
    "ATORVASTATIN":     {"generic": "Atorvastatin", "class": "Statin", "use": "High cholesterol"},
    "LIPITOR":          {"generic": "Atorvastatin", "class": "Statin", "use": "High cholesterol"},
    "ATOR":             {"generic": "Atorvastatin", "class": "Statin", "use": "High cholesterol"},
    "ROSUVASTATIN":     {"generic": "Rosuvastatin", "class": "Statin", "use": "High cholesterol"},
    "CRESTOR":          {"generic": "Rosuvastatin", "class": "Statin", "use": "High cholesterol"},
    "SIMVASTATIN":      {"generic": "Simvastatin", "class": "Statin", "use": "High cholesterol"},
    "ZOCOR":            {"generic": "Simvastatin", "class": "Statin", "use": "High cholesterol"},
    "PRAVASTATIN":      {"generic": "Pravastatin", "class": "Statin", "use": "High cholesterol"},
    "FLUVASTATIN":      {"generic": "Fluvastatin", "class": "Statin", "use": "High cholesterol"},
    "EZETIMIBE":        {"generic": "Ezetimibe", "class": "Cholesterol absorb inhibitor", "use": "High cholesterol"},
    "FENOFIBRATE":      {"generic": "Fenofibrate", "class": "Fibrate", "use": "High triglycerides"},

    # ── Diabetes ──────────────────────────────────────────
    "METFORMIN":        {"generic": "Metformin", "class": "Biguanide", "use": "Type 2 diabetes"},
    "GLUCOPHAGE":       {"generic": "Metformin", "class": "Biguanide", "use": "Type 2 diabetes"},
    "GLIBENCLAMIDE":    {"generic": "Glibenclamide", "class": "Sulfonylurea", "use": "Type 2 diabetes"},
    "GLICLAZIDE":       {"generic": "Gliclazide", "class": "Sulfonylurea", "use": "Type 2 diabetes"},
    "GLIPIZIDE":        {"generic": "Glipizide", "class": "Sulfonylurea", "use": "Type 2 diabetes"},
    "GLIMEPIRIDE":      {"generic": "Glimepiride", "class": "Sulfonylurea", "use": "Type 2 diabetes"},
    "AMARYL":           {"generic": "Glimepiride", "class": "Sulfonylurea", "use": "Type 2 diabetes"},
    "SITAGLIPTIN":      {"generic": "Sitagliptin", "class": "DPP-4 inhibitor", "use": "Type 2 diabetes"},
    "JANUVIA":          {"generic": "Sitagliptin", "class": "DPP-4 inhibitor", "use": "Type 2 diabetes"},
    "EMPAGLIFLOZIN":    {"generic": "Empagliflozin", "class": "SGLT2 inhibitor", "use": "Type 2 diabetes"},
    "JARDIANCE":        {"generic": "Empagliflozin", "class": "SGLT2 inhibitor", "use": "Type 2 diabetes"},
    "DAPAGLIFLOZIN":    {"generic": "Dapagliflozin", "class": "SGLT2 inhibitor", "use": "Type 2 diabetes"},
    "FORXIGA":          {"generic": "Dapagliflozin", "class": "SGLT2 inhibitor", "use": "Type 2 diabetes"},
    "INSULIN":          {"generic": "Insulin", "class": "Hormone", "use": "Diabetes"},
    "PIOGLITAZONE":     {"generic": "Pioglitazone", "class": "Thiazolidinedione", "use": "Type 2 diabetes"},
    "ACTOS":            {"generic": "Pioglitazone", "class": "Thiazolidinedione", "use": "Type 2 diabetes"},
    "LIRAGLUTIDE":      {"generic": "Liraglutide", "class": "GLP-1 agonist", "use": "Type 2 diabetes"},
    "VICTOZA":          {"generic": "Liraglutide", "class": "GLP-1 agonist", "use": "Type 2 diabetes"},
    "SEMAGLUTIDE":      {"generic": "Semaglutide", "class": "GLP-1 agonist", "use": "Type 2 diabetes, weight"},

    # ── Gastro ────────────────────────────────────────────
    "OMEPRAZOLE":       {"generic": "Omeprazole", "class": "PPI", "use": "Acid reflux, ulcer"},
    "LOSEC":            {"generic": "Omeprazole", "class": "PPI", "use": "Acid reflux"},
    "PANTOPRAZOLE":     {"generic": "Pantoprazole", "class": "PPI", "use": "Acid reflux, ulcer"},
    "PANTOLOC":         {"generic": "Pantoprazole", "class": "PPI", "use": "Acid reflux"},
    "ESOMEPRAZOLE":     {"generic": "Esomeprazole", "class": "PPI", "use": "Acid reflux, ulcer"},
    "NEXIUM":           {"generic": "Esomeprazole", "class": "PPI", "use": "Acid reflux"},
    "LANSOPRAZOLE":     {"generic": "Lansoprazole", "class": "PPI", "use": "Acid reflux, ulcer"},
    "RABEPRAZOLE":      {"generic": "Rabeprazole", "class": "PPI", "use": "Acid reflux"},
    "RANITIDINE":       {"generic": "Ranitidine", "class": "H2 blocker", "use": "Acid reflux"},
    "FAMOTIDINE":       {"generic": "Famotidine", "class": "H2 blocker", "use": "Acid reflux"},
    "DOMPERIDONE":      {"generic": "Domperidone", "class": "Antiemetic", "use": "Nausea, vomiting"},
    "MOTILIUM":         {"generic": "Domperidone", "class": "Antiemetic", "use": "Nausea"},
    "METOCLOPRAMIDE":   {"generic": "Metoclopramide", "class": "Antiemetic", "use": "Nausea, vomiting"},
    "ONDANSETRON":      {"generic": "Ondansetron", "class": "Antiemetic", "use": "Nausea, vomiting"},
    "ZOFRAN":           {"generic": "Ondansetron", "class": "Antiemetic", "use": "Nausea"},
    "LOPERAMIDE":       {"generic": "Loperamide", "class": "Antidiarrheal", "use": "Diarrhea"},
    "IMODIUM":          {"generic": "Loperamide", "class": "Antidiarrheal", "use": "Diarrhea"},
    "LACTULOSE":        {"generic": "Lactulose", "class": "Laxative", "use": "Constipation"},
    "BISACODYL":        {"generic": "Bisacodyl", "class": "Laxative", "use": "Constipation"},
    "SUCRALFATE":       {"generic": "Sucralfate", "class": "Ulcer protectant", "use": "Peptic ulcer"},
    "ANTACID":          {"generic": "Antacid", "class": "Antacid", "use": "Heartburn"},

    # ── Respiratory ───────────────────────────────────────
    "SALBUTAMOL":       {"generic": "Salbutamol", "class": "Bronchodilator", "use": "Asthma, COPD"},
    "ALBUTEROL":        {"generic": "Salbutamol", "class": "Bronchodilator", "use": "Asthma"},
    "VENTOLIN":         {"generic": "Salbutamol", "class": "Bronchodilator", "use": "Asthma"},
    "SALMETEROL":       {"generic": "Salmeterol", "class": "LABA", "use": "Asthma, COPD"},
    "FORMOTEROL":       {"generic": "Formoterol", "class": "LABA", "use": "Asthma, COPD"},
    "TIOTROPIUM":       {"generic": "Tiotropium", "class": "LAMA", "use": "COPD"},
    "SPIRIVA":          {"generic": "Tiotropium", "class": "LAMA", "use": "COPD"},
    "BUDESONIDE":       {"generic": "Budesonide", "class": "Inhaled corticosteroid", "use": "Asthma"},
    "FLUTICASONE":      {"generic": "Fluticasone", "class": "Inhaled corticosteroid", "use": "Asthma"},
    "BECLOMETHASONE":   {"generic": "Beclomethasone", "class": "Inhaled corticosteroid", "use": "Asthma"},
    "MONTELUKAST":      {"generic": "Montelukast", "class": "Leukotriene antagonist", "use": "Asthma, allergies"},
    "SINGULAIR":        {"generic": "Montelukast", "class": "Leukotriene antagonist", "use": "Asthma"},
    "THEOPHYLLINE":     {"generic": "Theophylline", "class": "Bronchodilator", "use": "Asthma, COPD"},
    "CETIRIZINE":       {"generic": "Cetirizine", "class": "Antihistamine", "use": "Allergies"},
    "ZYRTEC":           {"generic": "Cetirizine", "class": "Antihistamine", "use": "Allergies"},
    "LORATADINE":       {"generic": "Loratadine", "class": "Antihistamine", "use": "Allergies"},
    "CLARITIN":         {"generic": "Loratadine", "class": "Antihistamine", "use": "Allergies"},
    "FEXOFENADINE":     {"generic": "Fexofenadine", "class": "Antihistamine", "use": "Allergies"},
    "ALLEGRA":          {"generic": "Fexofenadine", "class": "Antihistamine", "use": "Allergies"},
    "DEXTROMETHORPHAN": {"generic": "Dextromethorphan", "class": "Antitussive", "use": "Cough"},
    "GUAIFENESIN":      {"generic": "Guaifenesin", "class": "Expectorant", "use": "Cough, congestion"},
    "AMBROXOL":         {"generic": "Ambroxol", "class": "Mucolytic", "use": "Mucus clearance"},
    "BROMHEXINE":       {"generic": "Bromhexine", "class": "Mucolytic", "use": "Mucus clearance"},

    # ── Steroids ──────────────────────────────────────────
    "PREDNISOLONE":     {"generic": "Prednisolone", "class": "Corticosteroid", "use": "Inflammation, allergy"},
    "PREDNISONE":       {"generic": "Prednisone", "class": "Corticosteroid", "use": "Inflammation"},
    "DEXAMETHASONE":    {"generic": "Dexamethasone", "class": "Corticosteroid", "use": "Inflammation, allergy"},
    "HYDROCORTISONE":   {"generic": "Hydrocortisone", "class": "Corticosteroid", "use": "Inflammation"},
    "METHYLPREDNISOLONE": {"generic": "Methylprednisolone", "class": "Corticosteroid", "use": "Inflammation"},
    "BETAMETHASONE":    {"generic": "Betamethasone", "class": "Corticosteroid", "use": "Inflammation"},

    # ── Thyroid ───────────────────────────────────────────
    "LEVOTHYROXINE":    {"generic": "Levothyroxine", "class": "Thyroid hormone", "use": "Hypothyroidism"},
    "SYNTHROID":        {"generic": "Levothyroxine", "class": "Thyroid hormone", "use": "Hypothyroidism"},
    "ELTROXIN":         {"generic": "Levothyroxine", "class": "Thyroid hormone", "use": "Hypothyroidism"},
    "CARBIMAZOLE":      {"generic": "Carbimazole", "class": "Antithyroid", "use": "Hyperthyroidism"},
    "PROPYLTHIOURACIL": {"generic": "Propylthiouracil", "class": "Antithyroid", "use": "Hyperthyroidism"},

    # ── Neuro / Psych ─────────────────────────────────────
    "GABAPENTIN":       {"generic": "Gabapentin", "class": "Anticonvulsant", "use": "Seizures, neuropathy"},
    "PREGABALIN":       {"generic": "Pregabalin", "class": "Anticonvulsant", "use": "Seizures, neuropathy"},
    "LYRICA":           {"generic": "Pregabalin", "class": "Anticonvulsant", "use": "Neuropathy"},
    "PHENYTOIN":        {"generic": "Phenytoin", "class": "Anticonvulsant", "use": "Seizures"},
    "CARBAMAZEPINE":    {"generic": "Carbamazepine", "class": "Anticonvulsant", "use": "Seizures, bipolar"},
    "TEGRETOL":         {"generic": "Carbamazepine", "class": "Anticonvulsant", "use": "Seizures"},
    "VALPROATE":        {"generic": "Valproic acid", "class": "Anticonvulsant", "use": "Seizures, bipolar"},
    "SODIUM VALPROATE": {"generic": "Valproic acid", "class": "Anticonvulsant", "use": "Seizures"},
    "LEVETIRACETAM":    {"generic": "Levetiracetam", "class": "Anticonvulsant", "use": "Seizures"},
    "KEPPRA":           {"generic": "Levetiracetam", "class": "Anticonvulsant", "use": "Seizures"},
    "SERTRALINE":       {"generic": "Sertraline", "class": "SSRI", "use": "Depression, anxiety"},
    "ZOLOFT":           {"generic": "Sertraline", "class": "SSRI", "use": "Depression"},
    "FLUOXETINE":       {"generic": "Fluoxetine", "class": "SSRI", "use": "Depression, anxiety"},
    "PROZAC":           {"generic": "Fluoxetine", "class": "SSRI", "use": "Depression"},
    "ESCITALOPRAM":     {"generic": "Escitalopram", "class": "SSRI", "use": "Depression, anxiety"},
    "LEXAPRO":          {"generic": "Escitalopram", "class": "SSRI", "use": "Depression"},
    "CITALOPRAM":       {"generic": "Citalopram", "class": "SSRI", "use": "Depression"},
    "PAROXETINE":       {"generic": "Paroxetine", "class": "SSRI", "use": "Depression, anxiety"},
    "VENLAFAXINE":      {"generic": "Venlafaxine", "class": "SNRI", "use": "Depression, anxiety"},
    "AMITRIPTYLINE":    {"generic": "Amitriptyline", "class": "TCA", "use": "Depression, neuropathy"},
    "HALOPERIDOL":      {"generic": "Haloperidol", "class": "Antipsychotic", "use": "Schizophrenia"},
    "RISPERIDONE":      {"generic": "Risperidone", "class": "Antipsychotic", "use": "Schizophrenia"},
    "OLANZAPINE":       {"generic": "Olanzapine", "class": "Antipsychotic", "use": "Schizophrenia"},
    "QUETIAPINE":       {"generic": "Quetiapine", "class": "Antipsychotic", "use": "Schizophrenia, bipolar"},
    "DIAZEPAM":         {"generic": "Diazepam", "class": "Benzodiazepine", "use": "Anxiety, seizures"},
    "ALPRAZOLAM":       {"generic": "Alprazolam", "class": "Benzodiazepine", "use": "Anxiety"},
    "XANAX":            {"generic": "Alprazolam", "class": "Benzodiazepine", "use": "Anxiety"},
    "LORAZEPAM":        {"generic": "Lorazepam", "class": "Benzodiazepine", "use": "Anxiety, seizures"},
    "CLONAZEPAM":       {"generic": "Clonazepam", "class": "Benzodiazepine", "use": "Seizures, anxiety"},
    "ZOLPIDEM":         {"generic": "Zolpidem", "class": "Sedative", "use": "Insomnia"},
    "DONEPEZIL":        {"generic": "Donepezil", "class": "Cholinesterase inhibitor", "use": "Alzheimer's"},
    "MEMANTINE":        {"generic": "Memantine", "class": "NMDA antagonist", "use": "Alzheimer's"},
    "LEVODOPA":         {"generic": "Levodopa", "class": "Dopamine precursor", "use": "Parkinson's"},
    "CARBIDOPA":        {"generic": "Carbidopa+Levodopa", "class": "Antiparkinson", "use": "Parkinson's"},
    "SUMATRIPTAN":      {"generic": "Sumatriptan", "class": "Triptan", "use": "Migraine"},
    "TOPIRAMATE":       {"generic": "Topiramate", "class": "Anticonvulsant", "use": "Migraine, seizures"},

    # ── Vitamins / Supplements ────────────────────────────
    "VITAMIN D":        {"generic": "Cholecalciferol", "class": "Vitamin", "use": "Vitamin D deficiency"},
    "CHOLECALCIFEROL":  {"generic": "Cholecalciferol", "class": "Vitamin", "use": "Vitamin D deficiency"},
    "CALCITRIOL":       {"generic": "Calcitriol", "class": "Vitamin D", "use": "Calcium metabolism"},
    "VITAMIN B12":      {"generic": "Cyanocobalamin", "class": "Vitamin", "use": "B12 deficiency"},
    "CYANOCOBALAMIN":   {"generic": "Cyanocobalamin", "class": "Vitamin", "use": "B12 deficiency"},
    "FOLIC ACID":       {"generic": "Folic acid", "class": "Vitamin", "use": "Folate deficiency, pregnancy"},
    "FOLATE":           {"generic": "Folic acid", "class": "Vitamin", "use": "Folate deficiency"},
    "FERROUS SULPHATE": {"generic": "Iron", "class": "Mineral", "use": "Iron deficiency anemia"},
    "FERROUS SULFATE":  {"generic": "Iron", "class": "Mineral", "use": "Iron deficiency anemia"},
    "CALCIUM":          {"generic": "Calcium carbonate", "class": "Mineral", "use": "Calcium deficiency"},
    "MAGNESIUM":        {"generic": "Magnesium", "class": "Mineral", "use": "Magnesium deficiency"},
    "ZINC":             {"generic": "Zinc", "class": "Mineral", "use": "Zinc deficiency"},
    "MULTIVITAMIN":     {"generic": "Multivitamin", "class": "Supplement", "use": "General nutrition"},

    # ── Antifungal / Antiviral ────────────────────────────
    "FLUCONAZOLE":      {"generic": "Fluconazole", "class": "Antifungal", "use": "Fungal infections"},
    "DIFLUCAN":         {"generic": "Fluconazole", "class": "Antifungal", "use": "Fungal infections"},
    "ITRACONAZOLE":     {"generic": "Itraconazole", "class": "Antifungal", "use": "Fungal infections"},
    "CLOTRIMAZOLE":     {"generic": "Clotrimazole", "class": "Antifungal", "use": "Fungal skin infections"},
    "ACYCLOVIR":        {"generic": "Acyclovir", "class": "Antiviral", "use": "Herpes, chickenpox"},
    "VALACYCLOVIR":     {"generic": "Valacyclovir", "class": "Antiviral", "use": "Herpes"},
    "OSELTAMIVIR":      {"generic": "Oseltamivir", "class": "Antiviral", "use": "Influenza"},
    "TAMIFLU":          {"generic": "Oseltamivir", "class": "Antiviral", "use": "Influenza"},

    # ── Urology ───────────────────────────────────────────
    "TAMSULOSIN":       {"generic": "Tamsulosin", "class": "Alpha blocker", "use": "BPH, kidney stones"},
    "FLOMAX":           {"generic": "Tamsulosin", "class": "Alpha blocker", "use": "BPH"},
    "FINASTERIDE":      {"generic": "Finasteride", "class": "5-alpha reductase inhibitor", "use": "BPH, hair loss"},
    "SILDENAFIL":       {"generic": "Sildenafil", "class": "PDE5 inhibitor", "use": "Erectile dysfunction"},
    "VIAGRA":           {"generic": "Sildenafil", "class": "PDE5 inhibitor", "use": "Erectile dysfunction"},
    "TADALAFIL":        {"generic": "Tadalafil", "class": "PDE5 inhibitor", "use": "Erectile dysfunction, BPH"},
    "CIALIS":           {"generic": "Tadalafil", "class": "PDE5 inhibitor", "use": "Erectile dysfunction"},
    "OXYBUTYNIN":       {"generic": "Oxybutynin", "class": "Anticholinergic", "use": "Overactive bladder"},

    # ── Ophthalmology ─────────────────────────────────────
    "TIMOLOL":          {"generic": "Timolol", "class": "Beta-blocker eye drop", "use": "Glaucoma"},
    "LATANOPROST":      {"generic": "Latanoprost", "class": "Prostaglandin analog", "use": "Glaucoma"},
    "XALATAN":          {"generic": "Latanoprost", "class": "Prostaglandin analog", "use": "Glaucoma"},
    "DORZOLAMIDE":      {"generic": "Dorzolamide", "class": "Carbonic anhydrase inhibitor", "use": "Glaucoma"},

    # ── Antiparasitic ─────────────────────────────────────
    "ALBENDAZOLE":      {"generic": "Albendazole", "class": "Anthelmintic", "use": "Worm infections"},
    "MEBENDAZOLE":      {"generic": "Mebendazole", "class": "Anthelmintic", "use": "Worm infections"},
    "IVERMECTIN":       {"generic": "Ivermectin", "class": "Antiparasitic", "use": "Parasitic infections"},
    "CHLOROQUINE":      {"generic": "Chloroquine", "class": "Antimalarial", "use": "Malaria"},
    "HYDROXYCHLOROQUINE": {"generic": "Hydroxychloroquine", "class": "Antimalarial", "use": "Malaria, RA"},
    "ARTEMETHER":       {"generic": "Artemether+Lumefantrine", "class": "Antimalarial", "use": "Malaria"},
    "QUININE":          {"generic": "Quinine", "class": "Antimalarial", "use": "Malaria"},

    # ── Oncology (common) ─────────────────────────────────
    "TAMOXIFEN":        {"generic": "Tamoxifen", "class": "SERM", "use": "Breast cancer"},
    "LETROZOLE":        {"generic": "Letrozole", "class": "Aromatase inhibitor", "use": "Breast cancer"},
    "ANASTROZOLE":      {"generic": "Anastrozole", "class": "Aromatase inhibitor", "use": "Breast cancer"},
    "IMATINIB":         {"generic": "Imatinib", "class": "TKI", "use": "CML, GIST"},
    "GLEEVEC":          {"generic": "Imatinib", "class": "TKI", "use": "CML"},

    # ── Muscle relaxants ──────────────────────────────────
    "BACLOFEN":         {"generic": "Baclofen", "class": "Muscle relaxant", "use": "Spasticity"},
    "TIZANIDINE":       {"generic": "Tizanidine", "class": "Muscle relaxant", "use": "Spasticity"},
    "CYCLOBENZAPRINE":  {"generic": "Cyclobenzaprine", "class": "Muscle relaxant", "use": "Muscle spasm"},
    "METHOCARBAMOL":    {"generic": "Methocarbamol", "class": "Muscle relaxant", "use": "Muscle spasm"},

    # ── Gout ──────────────────────────────────────────────
    "ALLOPURINOL":      {"generic": "Allopurinol", "class": "Xanthine oxidase inhibitor", "use": "Gout"},
    "COLCHICINE":       {"generic": "Colchicine", "class": "Anti-gout", "use": "Gout flares"},
    "FEBUXOSTAT":       {"generic": "Febuxostat", "class": "Xanthine oxidase inhibitor", "use": "Gout"},

    # ── Osteoporosis ──────────────────────────────────────
    "ALENDRONATE":      {"generic": "Alendronate", "class": "Bisphosphonate", "use": "Osteoporosis"},
    "FOSAMAX":          {"generic": "Alendronate", "class": "Bisphosphonate", "use": "Osteoporosis"},
    "RISEDRONATE":      {"generic": "Risedronate", "class": "Bisphosphonate", "use": "Osteoporosis"},
    "ZOLEDRONIC ACID":  {"generic": "Zoledronic acid", "class": "Bisphosphonate", "use": "Osteoporosis"},
}

# Get the base directory (OCR system/backend)
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
# Data is in OCR system/data
DATA_DIR    = os.path.join(os.path.dirname(BACKEND_DIR), "data")

CSV_PATH = os.path.join(DATA_DIR, "medicine_dataset1.csv")

def load_csv_dataset():
    if not os.path.exists(CSV_PATH):
        return
    try:
        with open(CSV_PATH, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                name = row.get("Name", "").strip()
                if not name:
                    continue
                name_upper = name.upper()
                if name_upper not in DRUG_DATABASE:
                    DRUG_DATABASE[name_upper] = {
                        "generic": name,
                        "class": row.get("Category", ""),
                        "use": row.get("Indication", ""),
                        "classification": row.get("Classification", "")
                    }
    except Exception as e:
        print(f"Error loading CSV dataset: {e}")

CSV2_PATH = os.path.join(DATA_DIR, "drug_dataset1.csv")

def load_csv2_dataset():
    if not os.path.exists(CSV2_PATH):
        return
    try:
        with open(CSV2_PATH, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                name_full = row.get("Medicine Name", "").strip()
                if not name_full:
                    continue
                
                base_name = name_full.split()[0].upper()
                name_upper = name_full.upper()
                
                composition = row.get("Composition", "")
                side_effects = row.get("Side_effects", "")
                uses = row.get("Uses", "")
                
                for key in [base_name, name_upper]:
                    if key not in DRUG_DATABASE:
                        DRUG_DATABASE[key] = {
                            "generic": composition,
                            "class": "",
                            "use": uses,
                            "classification": "",
                            "side_effects": side_effects
                        }
                    else:
                        if side_effects:
                            DRUG_DATABASE[key]["side_effects"] = side_effects
                        if composition and not DRUG_DATABASE[key].get("generic"):
                            DRUG_DATABASE[key]["generic"] = composition
    except Exception as e:
        print(f"Error loading CSV2 dataset: {e}")

load_csv_dataset()
load_csv2_dataset()

# All drug names as a list (for fuzzy matching)
ALL_DRUG_NAMES = list(DRUG_DATABASE.keys())


def lookup_drug(name: str) -> dict:
    """Exact lookup in local database."""
    return DRUG_DATABASE.get(name.upper().strip())


def get_all_names() -> list:
    """Return all drug names for fuzzy matching."""
    return ALL_DRUG_NAMES