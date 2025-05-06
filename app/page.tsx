"use client"

import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";

const HomePage = () => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const savedTimestamps = localStorage.getItem("timestamps");
    if (savedTimestamps) {
      setTimestamps(JSON.parse(savedTimestamps));
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      setIsInstallable(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', () => { });
      window.removeEventListener('appinstalled', () => { });
    };
  }, []);

  const saveTimestamps = (newTimestamps: string[]) => {
    localStorage.setItem("timestamps", JSON.stringify(newTimestamps));
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
    localStorage.removeItem("timestamps");
    setTimestamps([]);
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('No se puede instalar la aplicación ahora');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Instalación: ${outcome}`);
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return (
    <div style={{
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      padding: "20px",
      boxSizing: "border-box"
    }}>
      <h1 style={{ fontSize: "4rem", marginBottom: "20px" }}>{currentTime}</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px"
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

        {isInstallable && (
          <button
            onClick={handleInstallClick}
            style={{
              padding: "10px 20px",
              fontSize: "1.2rem",
              backgroundColor: "#9C27B0",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s",
              width: "100%",
              maxWidth: "300px",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#7B1FA2")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#9C27B0")}
          >
            Instalar aplicación
          </button>
        )}
      </div>

      <div style={{
        marginTop: "10px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        <h2>Timestamps:</h2>
        <div style={{
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: "5px",
          padding: "10px",
          flex: 1,
          backgroundColor: "#f9f9f9"
        }}>
          <ul style={{
            listStyleType: "none",
            padding: 0,
            margin: 0,
            textAlign: "left"
          }}>
            {timestamps.map((time, index) => (
              <li key={index} style={{
                padding: "8px 0",
                borderBottom: index < timestamps.length - 1 ? "1px solid #eee" : "none"
              }}>
                {time}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;