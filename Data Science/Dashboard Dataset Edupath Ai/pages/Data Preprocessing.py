import streamlit as st

st.title("Data Preprocessing")

st.markdown("""
### Tahapan Preprocessing

1. Duplicate Removal
2. Missing Value Checking
3. Label Encoding
4. Feature Selection
5. Train Test Split
""")

st.subheader("Dataset Split")

st.code("""
Training Data : 382
Testing Data  : 96
""")

st.success("Dataset berhasil dipersiapkan untuk Machine Learning.")