import streamlit as st

st.set_page_config(
    page_title="EduPathAI Dashboard",
    page_icon="📚",
    layout="wide"
)

st.title("📚 EduPathAI Student Performance Dashboard")

st.markdown("""
### Capstone Project - Student Performance Prediction

Dashboard ini dibuat untuk menganalisis performa siswa menggunakan dataset xAPI-Edu-Data dan model Machine Learning Random Forest.

### Dataset Information

- Total Data : 478
- Total Features : 16
- Model : Random Forest Classifier
- Accuracy : 82.29%

Gunakan menu di sidebar untuk melihat setiap tahapan proyek Data Science.
""")