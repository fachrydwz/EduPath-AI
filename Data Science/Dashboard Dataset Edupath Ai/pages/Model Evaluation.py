import streamlit as st
import pandas as pd
import plotly.express as px

st.title("Model Evaluation")

st.markdown("""
Evaluasi model Random Forest berdasarkan hasil
pengujian pada notebook proyek Data Science.
""")

# ==================================================
# ACCURACY
# ==================================================

st.subheader("Model Accuracy")

col1, col2, col3 = st.columns(3)

col1.metric(
    "Accuracy",
    "82.29%"
)

col2.metric(
    "Algorithm",
    "Random Forest"
)

col3.metric(
    "Features",
    "16"
)

# ==================================================
# CLASSIFICATION REPORT
# ==================================================

st.subheader("Classification Report")

report_df = pd.DataFrame({
    "Precision":[0.74,0.89,0.83],
    "Recall":[0.83,0.89,0.78],
    "F1-Score":[0.78,0.89,0.80]
},
index=["Low","Medium","High"])

st.dataframe(
    report_df,
    use_container_width=True
)

# ==================================================
# VISUALIZATION
# ==================================================

st.subheader("Performance Comparison")

plot_df = report_df.reset_index()
plot_df.columns = [
    "Class",
    "Precision",
    "Recall",
    "F1-Score"
]

fig = px.bar(
    plot_df,
    x="Class",
    y=["Precision","Recall","F1-Score"],
    barmode="group",
    title="Classification Metrics by Class"
)

st.plotly_chart(
    fig,
    use_container_width=True
)

# ==================================================
# MODEL INTERPRETATION
# ==================================================

st.subheader("Model Insight")

st.success("""
Model Random Forest berhasil mencapai akurasi sebesar
82.29% pada data testing.

Kelas Medium memiliki performa terbaik dengan nilai
Precision, Recall, dan F1-Score sebesar 0.89.

Kelas Low memperoleh F1-Score sebesar 0.78,
sedangkan kelas High memperoleh F1-Score sebesar 0.80.

Hal ini menunjukkan bahwa model mampu mengklasifikasikan
performa siswa ke dalam kategori Low, Medium, dan High
dengan tingkat akurasi yang baik.
""")

# ==================================================
# CONCLUSION
# ==================================================

st.subheader("Evaluation Summary")

st.info("""
• Model menggunakan algoritma Random Forest Classifier.

• Dataset dibagi menjadi 80% data training dan 20% data testing.

• Akurasi model mencapai 82.29%.

• Kelas Medium merupakan kelas yang paling mudah diprediksi.

• Aktivitas belajar siswa terbukti menjadi faktor penting
dalam menentukan performa akademik.

• Model layak digunakan sebagai alat bantu prediksi
performa siswa.
""")