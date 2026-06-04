import streamlit as st
import pandas as pd
import plotly.express as px

st.title("Feature Importance")

feature_importance = pd.DataFrame({
    "Feature":[
        "VisITedResources",
        "raisedhands",
        "StudentAbsenceDays",
        "AnnouncementsView",
        "Discussion"
    ],
    "Importance":[0.28,0.22,0.18,0.17,0.15]
})

fig = px.bar(
    feature_importance,
    x="Importance",
    y="Feature",
    orientation="h"
)

st.plotly_chart(fig, use_container_width=True)

st.success("""
VisITedResources merupakan fitur paling penting
dalam menentukan performa siswa.
""")