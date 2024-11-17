import React, { useState, useEffect } from "react";
import "./Calendario.css";

const CalendarComponent = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Hacer la solicitud al backend
    fetch("http://localhost:5001/api/data")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cargar los datos");
        }
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => setError(error.message)); // Manejo de error
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Función para obtener el nombre del mes y el año de un timestamp
  const getMonthYear = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      console.error(`Invalid date: ${timestamp}`);
      return null;
    }

    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const monthName = months[date.getMonth()];
    const year = date.getFullYear();

    return `${monthName} ${year}`;
  };

  // Organizar los datos por mes
  const organizedData = data.reduce((acc, item) => {
    const monthYear = getMonthYear(item.timestamp);
    if (monthYear) {
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(item);
    }
    return acc;
  }, {});

  // Función para obtener la clase correspondiente al AQI
  const getAQIClass = () => {
    const classes = ["good", "moderate", "unhealthy-sensitive", "unhealthy", "very-unhealthy", "hazardous"];
    return classes[Math.floor(Math.random() * classes.length)];
  };

  const generateCalendar = (monthYear) => {
    // Extraer el nombre del mes y el año
    const [monthName, year] = monthYear.split(" ");
    const monthIndex = new Date(`${monthName} 1`).getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate(); // Obtener el número de días en el mes
    const firstDayOfMonth = new Date(year, monthIndex, 1).getDay(); // Día de la semana del primer día del mes

    const weeks = [];
    let days = [];

    // Llenar los días vacíos antes del primer día del mes
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Llenar los días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    // Dividir los días en semanas (7 días por semana)
    while (days.length) {
      weeks.push(days.splice(0, 7));
    }

    return (
      <div className="month-container" key={monthYear}>
        <h2>{monthName} {year}</h2> {/* Mostrar el nombre del mes y el año */}
        <div className="calendar-grid">
          {weeks.map((week, weekIndex) => (
            <div className="week" key={weekIndex}>
              {week.map((day, dayIndex) => {
                const dayData = organizedData[monthYear]?.find(
                  (item) => new Date(item.timestamp).getDate() === day
                );
                const aqiClass = getAQIClass(); // Asignar un color aleatorio de AQI
                return (
                  <div
                    key={dayIndex}
                    className={`day ${day ? "filled" : "empty"} ${aqiClass}`}
                  >
                    {day}
                    {dayData && (
                      <div className="aqi-indicator">
                        {dayData.aqi}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="calendario-container">
      <h1>Calendario de AQI</h1>
      <div className="aqi-bar">
        <div className="aqi-section good">0-50</div>
        <div className="aqi-section moderate">51-100</div>
        <div className="aqi-section unhealthy-sensitive">101-150</div>
        <div className="aqi-section unhealthy">151-200</div>
        <div className="aqi-section very-unhealthy">201-300</div>
        <div className="aqi-section hazardous">301-500</div>
      </div>
      {Object.keys(organizedData).map((monthYear) => generateCalendar(monthYear))}
    </div>
  );
};

export default CalendarComponent;
