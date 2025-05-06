"use client"

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const HomePage = () => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [timestamps, setTimestamps] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const savedTimestamps = sessionStorage.getItem("timestamps");
    if (savedTimestamps) {
      setTimestamps(JSON.parse(savedTimestamps));
    }
  }, []);

  const saveTimestamps = (newTimestamps: string[]) => {
    sessionStorage.setItem("timestamps", JSON.stringify(newTimestamps));
    setTimestamps(newTimestamps);
  };

  const handleMarkTimestamp = () => {
    const now = new Date().toLocaleString();
    const updatedTimestamps = [...timestamps, now];
    saveTimestamps(updatedTimestamps);
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      timestamps.map((time, index) => ({ ID: index + 1, Timestamp: time }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Timestamps");
    XLSX.writeFile(workbook, "timestamps.xlsx");
  };

  const handleClearTimestamps = () => {
    sessionStorage.removeItem("timestamps");
    setTimestamps([]);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20%" }}>
      <h1 style={{ fontSize: "4rem", marginBottom: "20px" }}>{currentTime}</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={handleMarkTimestamp}
          style={{
            padding: "10px 20px",
            fontSize: "1.2rem",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s",
            width: "100%",
            maxWidth: "300px",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#45a049")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4CAF50")}
        >
          Marcar Timestamp
        </button>
        <button
          onClick={handleExportToExcel}
          style={{
            padding: "10px 20px",
            fontSize: "1.2rem",
            backgroundColor: "#008CBA",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s",
            width: "100%",
            maxWidth: "300px",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#007bb5")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#008CBA")}
        >
          Exportar a Excel
        </button>
        <button
          onClick={handleClearTimestamps}
          style={{
            padding: "10px 20px",
            fontSize: "1.2rem",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s",
            width: "100%",
            maxWidth: "300px",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#da190b")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f44336")}
        >
          Limpiar Timestamps
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Timestamps:</h2>
        <ul>
          {timestamps.map((time, index) => (
            <li key={index}>{time}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePage;