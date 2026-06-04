import streamlit as st
import pandas as pd
import joblib

st.title("Student Performance Prediction")

st.markdown("""
Masukkan aktivitas belajar siswa untuk memprediksi
kategori performa akademik.
""")

# =====================================
# LOAD MODEL
# =====================================

model = joblib.load("student_performance_model.pkl")

# =====================================
# INPUT
# =====================================

raisedhands = st.slider(
    "Raised Hands",
    0, 100, 50
)

visited_resources = st.slider(
    "Visited Resources",
    0, 100, 50
)

announcements = st.slider(
    "Announcements View",
    0, 100, 50
)

discussion = st.slider(
    "Discussion",
    0, 100, 50
)

absence = st.selectbox(
    "Student Absence Days",
    ["Under-7", "Above-7"]
)

# =====================================
# PREDICTION
# =====================================

if st.button("Predict Performance"):

    absence_value = 1 if absence == "Under-7" else 0

    sample = pd.DataFrame([[
        1,   # gender
        0,   # NationalITy
        0,   # PlaceofBirth
        0,   # StageID
        0,   # GradeID
        0,   # SectionID
        0,   # Topic
        0,   # Semester
        0,   # Relation
        raisedhands,
        visited_resources,
        announcements,
        discussion,
        1,   # ParentAnsweringSurvey
        1,   # ParentschoolSatisfaction
        absence_value
    ]])

    prediction = model.predict(sample)[0]

    st.subheader("Prediction Result")

    if prediction == 0:

        st.error("LOW PERFORMANCE")

        st.write("""
        Siswa diprediksi memiliki performa akademik rendah.

        Rekomendasi:
        - Tingkatkan frekuensi belajar
        - Lebih aktif bertanya di kelas
        - Tingkatkan akses ke materi pembelajaran
        - Kurangi jumlah ketidakhadiran
        """)

    elif prediction == 1:

        st.warning("MEDIUM PERFORMANCE")

        st.write("""
        Siswa diprediksi memiliki performa akademik sedang.

        Rekomendasi:
        - Tingkatkan konsistensi belajar
        - Perbanyak diskusi dan partisipasi kelas
        - Lebih aktif mengakses sumber belajar
        """)

    elif prediction == 2:

        st.success("HIGH PERFORMANCE")

        st.write("""
        Siswa diprediksi memiliki performa akademik tinggi.

        Karakteristik:
        - Aktif mengakses materi pembelajaran
        - Tinggi dalam partisipasi kelas
        - Aktif berdiskusi
        - Kehadiran yang baik
        """)