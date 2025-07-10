import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';


export default function Table() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const today = new Date().toISOString().split('T')[0];
const [dateFrom, setDateFrom] = useState('');
const [dateTo, setDateTo] = useState(today);
const location = useLocation();
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
const [showModal, setShowModal] = useState(false);
const [escalations, setEscalations] = useState(null);
  // New state for status
const [status, setStatus] = useState('');

const filteredComplaints = complaints.filter((item) => {
  const complaintDate = new Date(item.createdAt);
  const from = dateFrom ? new Date(dateFrom) : null;
  const to = dateTo ? new Date(`${dateTo}T23:59:59.999`) : null;
  // Check date range
  const isInDateRange =
    (!from || complaintDate >= from) &&
    (!to || complaintDate <= to);

  // Check status
  const isStatusMatch =
  !status ||
  item.status === status ||
  (status === 'In_Progress' &&
   ! ['Resolved', 'Pending'].includes(item.status));


  // Check category
  const isCategoryMatch = !category || item.category === category;

  return isInDateRange && isStatusMatch && isCategoryMatch;
});

useEffect(() => {
  if (location.state && location.state.status) {
    setStatus(location.state.status);
  }
}, [location.state]);

  useEffect(() => {
    fetch('http://localhost:8080/api/complaints/all')
      .then(response => {
        if (!response.ok) {
          console.error('Response not OK:', response.status, response.statusText);
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        setComplaints(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleViewDetails = (id) => {
  fetch(`http://localhost:8080/api/complaints/get/${id}/escalations`)
    .then(response => response.json())
    .then(data => {
      setEscalations(data);
      setShowModal(true);
    })
    .catch(error => {
      console.error("Error fetching escalation:", error);
    });
};


const tableHeaderStyle = {
  border: '1px solid #dee2e6',
  padding: '10px',
  textAlign: 'center',
  fontWeight: 'bold',
  backgroundColor: '#e9ecef',
  fontSize: '14px',
};

const tableCellStyle = {
  border: '1px solid #dee2e6',
  padding: '8px',
  textAlign: 'center',
  fontSize: '14px',
};

  const buttonStyle = {
    display: 'block',
    width: '100%',
    padding: '5px 10px',
    marginBottom: '10px',
    backgroundColor: '#0d6efd',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
  };


  return (
    <div style={{ display: 'flex', padding: '2rem' }}>
      {/* Sidebar */}
      <div
        style={{
    position: 'fixed',        // 👈 Fixes the sidebar
    top: '40px',              // 👈 Pushes it below the fixed navbar
    left: 0,
    width: '130px',
    background: '#19475e',
    padding: '1rem',
    borderRadius: '0 8px 8px 0',
    height: 'calc(100vh - 45px)', // 👈 Full height minus navbar
    overflowY: 'auto',
    color: 'white',
    zIndex: 999,
        }}
      >
        <h3 style={{ textAlign: 'center' }}>Contact List</h3>
        <button style={buttonStyle} onClick={() => navigate('/')}>
          Dashboard
        </button>
        <button style={buttonStyle}>Transactional</button>
        <button style={buttonStyle}>Phone Book</button>
       <button style={buttonStyle} onClick={() => navigate('/Info')} >Reports</button>
      </div>

      {/* Main content */}
      <div>
        {/* Date filter - moved to top right */}
<div
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: '#4a235a',
    fontSize: '18px',
    marginBottom: '15px',
    gap: '13px',
    flexWrap: 'wrap',
    marginRight: '-12%',
    marginTop:'50px'
  }}
>
  <label style={{ fontWeight: 'bold' }}>Date:</label>
  <input
    type="date"
    id="dateFrom"
    value={dateFrom}
    onChange={(e) => setDateFrom(e.target.value)}
    style={{ width: '150px',padding: '4px 8px' ,fontSize: '15px' }}
  />
  <span style={{ fontWeight: 'bold' }}>To</span>
  <input
    type="date"
    id="dateTo"
    value={dateTo}
    onChange={(e) => setDateTo(e.target.value)}
    style={{ width: '150px',padding: '4px 8px' ,fontSize: '15px' }}
  />
  <label style={{ fontWeight: 'bold' }}>Status:</label>
<select
  id="status"
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  style={{ width: '150px', padding: '4px 8px', fontSize: '15px' }}
>
  <option value="">Select Status</option>
  <option value="Resolved">Resolved</option>
  <option value="Pending">Pending</option>
  <option value="In_Progress">In_Progress</option>
</select>



<label style={{ fontWeight: 'bold' }}>Category:</label>
<select
  id="category"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  style={{ width: '150px', padding: '4px 8px' ,fontSize: '15px'}}
>
  <option value="">Select Category</option>
  {[...new Set(complaints.map(item => item.category))].map((categoryOption, index) => (
    <option key={index} value={categoryOption}>
      {categoryOption}
    </option>
  ))}
</select>
</div>
  {/* Table */}
   <div
  style={{
    width: '1000px',
    marginLeft: '17.5%',
    height: '300px',
    overflow: 'auto',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    marginTop: '4%',
  }}
>
  <table
  style={{
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '8px',
    tableLayout: 'fixed',
  }}
>
  <thead>
    <tr
      style={{
        background: 'linear-gradient(to right, #0d6efd, #1BA1E2)',
        color: 'white',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      {['Name', 'Category', 'Description','OfficerName','OfficerContact', 'Status','Esclation', 'Time', 'Phone No', 'View Details',' Complaints Details'].map(
        (heading, idx) => (
          <th
            key={idx}
            style={{
              border: '1px solid #dee2e6',
              padding: '6px',
              position: 'sticky',
              top: -10,
              backgroundColor: '#1BA1E2',
              zIndex: 1,
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '15px',
              width: '120px',
              ...(idx === 0 && { borderTopLeftRadius: '6px' }),
              ...(idx === 6 && { borderTopRightRadius: '6px' }),
            }}
          >
            {heading}
          </th>
        )
      )}
    </tr>
  </thead>

  <tbody>
    {filteredComplaints.length === 0 ? (
      <tr>
        <td
          colSpan="8"
          style={{
            textAlign: 'center',
            padding: '16px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'red',
          }}
        >
         {status} Status is not available
        </td>
      </tr>
    ) : (
      filteredComplaints.map((item, index) => (
        <tr
          key={index}
          style={{
            backgroundColor: index % 2 === 0 ? '#f1f9ff' : '#ffffff',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = '#d9efff')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor =
              index % 2 === 0 ? '#f1f9ff' : '#ffffff')
          }
        >
          <td
            style={{
              border: '1px solid #dee2e6',
              padding: '6px 8px',
              fontSize: '13px',
              textAlign: 'center',
            }}
          >
            {item.userName}
          </td>
          <td
            style={{
              border: '1px solid #dee2e6',
              padding: '6px 8px',
              fontSize: '13px',
              wordWrap: 'break-word',
              whiteSpace: 'normal',
              maxWidth: '150px',
              overflowWrap: 'break-word',
              textAlign: 'center',
            }}
          >
            {item.category}
          </td>
          <td
            style={{
              border: '1px solid #dee2e6',
              padding: '6px 8px',
              fontSize: '13px',
              wordWrap: 'break-word',
              whiteSpace: 'normal',
              maxWidth: '250px',
              overflowWrap: 'break-word',
              textAlign: 'center',
            }}
          >
            {item.description}
          </td>
          <td
            style={{
              border: '1px solid #dee2e6',
              padding: '6px 8px',
              fontSize: '13px',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              minWidth: '180px',
            }}
          >
       {item.lastEscalatedOfficerName}
          </td>
          <td
            style={{
              border: '1px solid #dee2e6',
              padding: '6px 8px',
              fontSize: '13px',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              minWidth: '180px',
            }}
          >
     {item.lastEscalatedOfficerPhone}
          </td>
          <td
  style={{
    border: '1px solid #dee2e6',
    padding: '6px 8px',
    fontWeight: 'bold',
    fontSize: '13px',
    textAlign: 'center',
    color:
      item.status === 'Pending'
        ? 'red'
        : item.status === 'Resolved'
        ? 'green'
        : '#0d6efd', // blue for other statuses
  }}
>
  {item.status === 'Resolved'
    ? 'Resolved'
    : item.status === 'Pending'
    ? 'Pending'
    : 'In_Progress'}
</td>

            <td
  style={{
    border: '1px solid #dee2e6',
    padding: '6px 8px',
    fontSize: '13px',
    wordWrap: 'break-word',
    whiteSpace: 'normal',
    maxWidth: '250px',
    overflowWrap: 'break-word',
    textAlign: 'center',
  }}
>
  {item.escalationLevel
    ? `Esc_${item.escalationLevel}`
    : 'Not Assigned'}
</td>
          <td
            style={{
              border: '1px solid #dee2e6',
              padding: '6px 8px',
              fontSize: '13px',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              minWidth: '180px',
            }}
          >
            {new Date(item.createdAt).toLocaleString('en-IN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </td>
          <td
            style={{
              border: '1px solid #dee2e6',
              padding: '6px 8px',
              fontSize: '13px',
              textAlign: 'center',
            }}
          >
            {item.whatsappId}
          </td>
        
 <td
  style={{
    border: '1px solid #dee2e6',
    padding: '6px 8px',
    fontWeight: 'bold',
    fontSize: '13px',
    color: (() => {
      const created = new Date(item.createdAt);
      const now = new Date();
      const diffHrsTotal = Math.floor((now - created) / (1000 * 60 * 60));
      
      if (item.status === 'Resolved') return 'green';
      return diffHrsTotal < 24 ? 'green' : 'red'; // ⬅️ Green if < 24h, else red
    })(),
    textAlign: 'center',
  }}
>
  {(() => {
    if (item.status === 'Resolved') return 'Resolved';

    const created = new Date(item.createdAt);
    const now = new Date();
    const diffMs = now - created;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHrs = Math.floor((diffMs / (1000 * 60 * 60)) % 24);

    if (diffDays > 0 && diffHrs > 0) return `${diffDays}d ${diffHrs}h`;
    if (diffDays > 0) return `${diffDays}d`;
    return `${diffHrs}h`;
  })()}
</td>

<td
  style={{
    border: '1px solid #dee2e6',
    padding: '6px 8px',
    fontSize: '13px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    minWidth: '180px',
    cursor: 'pointer',
  }}
  onClick={() => handleViewDetails(item.id)}
  title="View Escalation Details"
>
  <FaEye style={{ color: '#0d6efd' }} />
</td>
        </tr>
      ))
    )}
  </tbody>
</table>
{showModal && escalations && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    }}
  >
    <div
      style={{
        backgroundColor: '#fff',
        padding: '25px 30px',
        borderRadius: '12px',
        width: '600px',
        maxHeight: '85vh',
        overflowY: 'auto',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      }}
    >
      <h2 style={{ color: '#0d6efd', marginBottom: '20px', textAlign: 'center' }}>
        Escalation Details
      </h2>

      <div
  style={{
    fontSize: '15px',
    marginBottom: '20px',
    padding: '15px 20px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    alignItems: 'center',
  }}
>
  <span>📂 <strong>Department:</strong> {escalations.departmentName}</span>
  <span>📝 <strong>Description:</strong> {escalations.description}</span>
  <span>📍 <strong>Ward Number:</strong> {escalations.wardNumber}</span>
  <span>👤 <strong>Citizen Name:</strong> {escalations.citizenName}</span>
  <span>📞 <strong>Contact:</strong> {escalations.citizenContact}</span>
</div>


      <h3 style={{ marginTop: '20px', color: '#1BA1E2' }}>Escalation History</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
  <thead>
    <tr style={{ backgroundColor: '#f1f1f1' }}>
      <th style={tableHeaderStyle}>Escalation Level</th>
      <th style={tableHeaderStyle}>Officer Name</th>
      <th style={tableHeaderStyle}>Contact No</th>
      <th style={tableHeaderStyle}>Time</th>
      <th style={tableHeaderStyle}>Duration</th>
    </tr>
  </thead>
  <tbody>
    {escalations.escalationHistory.map((item, index) => {
      const current = item.escalationTime;
      const next = escalations.escalationHistory[index + 1]?.escalationTime;
      const isLast = index === escalations.escalationHistory.length - 1;
      let endTime = !isLast ? next : escalations.resolvedDate || new Date().toISOString();

      const diffMs = new Date(endTime) - new Date(current);
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      let duration = '';
if (days > 0) duration += `${days}d `;
if (hours > 0) duration += `${hours}h`;
duration = duration.trim();

// Optional: If both are 0, show "Less than 1h" instead
if (!duration) duration = 'Less than 1h';


      let color = '#000';
      const totalHours = diffMs / (1000 * 60 * 60);
      if (escalations.resolvedDate && isLast) {
        color = 'green';
      } else if (totalHours > 24) {
        color = 'red';
      }

      return (
        <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
          <td style={tableCellStyle}>Escalation Level {item.escalationLevel}</td>
          <td style={tableCellStyle}>{item.officerName}</td>
          <td style={tableCellStyle}>{item.officerContact}</td>
          <td style={tableCellStyle}>{new Date(item.escalationTime).toLocaleString('en-IN')}</td>
          <td style={{ ...tableCellStyle, color }}>{duration}</td>
        </tr>
      );
    })}
  </tbody>
</table>


      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button
          onClick={() => setShowModal(false)}
          style={{
            padding: '8px 20px',
            backgroundColor: '#0d6efd',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '15px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


</div>

      </div>
    </div>
  );
}
