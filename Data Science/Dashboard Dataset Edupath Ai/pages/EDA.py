import streamlit as st
import pandas as pd
import plotly.express as px

st.title("Exploratory Data Analysis")

df = pd.read_csv("cleaned_student_data.csv")

st.subheader("Dataset Preview")
st.dataframe(df.head())

st.subheader("Student Performance Distribution")

class_counts = (
    df["Class"]
    .value_counts()
    .reset_index()
)

class_counts.columns = ["Class", "Count"]

fig = px.bar(
    class_counts,
    x="Class",
    y="Count",
    text="Count",
    color="Class",
    title="Student Performance Distribution"
)

fig.update_traces(
    textposition="outside"
)

fig.update_layout(
    xaxis_title="Performance Class",
    yaxis_title="Number of Students"
)

st.plotly_chart(
    fig,
    use_container_width=True
)

st.subheader("Gender vs Class")

fig = px.histogram(
    df,
    x="gender",
    color="Class",
    barmode="group"
)

st.plotly_chart(fig, use_container_width=True)

st.subheader("Topic vs Class")

topic_class = (
    df.groupby(["Topic", "Class"])
      .size()
      .reset_index(name="Count")
)

fig = px.bar(
    topic_class,
    x="Topic",
    y="Count",
    color="Class",
    barmode="group",
    title="Topic vs Class"
)

st.plotly_chart(fig, use_container_width=True)