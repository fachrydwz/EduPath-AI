import streamlit as st

st.title("Machine Learning Model")

st.subheader("Model")

st.info("""
Random Forest Classifier digunakan
untuk memprediksi performa siswa.
""")

col1,col2,col3 = st.columns(3)

col1.metric("Accuracy", "82.29%")
col2.metric("Train Size", "382")
col3.metric("Test Size", "96")