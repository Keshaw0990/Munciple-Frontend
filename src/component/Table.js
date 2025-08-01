import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // ✅ Correct
import { FaEye } from 'react-icons/fa';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

library.add(fas);
export default function Table() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const today = new Date().toISOString().split('T')[0];
const [dateFrom, setDateFrom] = useState('');
const [dateTo, setDateTo] = useState(today);
const location = useLocation();
  const navigate = useNavigate();
  const [sortedComplaints, setSortedComplaints] = useState([]);
const [sortOrderAsc, setSortOrderAsc] = useState(false); // default: descending
const [showStaticForm, setShowStaticForm] = useState(false);
  const [category, setCategory] = useState('');
const [showModal, setShowModal] = useState(false);
const [escalations, setEscalations] = useState('');
  // New state for status
const [status, setStatus] = useState('');
const [searchTerm, setSearchTerm] = useState('');
const [tableData, setTableData] = useState([]);


const filteredComplaints = complaints.filter((item) => {
  const complaintDate = new Date(item.createdAt);
  const from = dateFrom ? new Date(dateFrom) : null;
  const to = dateTo ? new Date(`${dateTo}T23:59:59.999`) : null;

  const isInDateRange =
    (!from || complaintDate >= from) &&
    (!to || complaintDate <= to);

  const isStatusMatch =
    !status ||
    item.status === status ||
    (status === 'In_Progress' &&
      !['Resolved', 'Pending', 'Rejected'].includes(item.status));

  const isCategoryMatch = !category || item.category === category;

  const search = searchTerm.toLowerCase();

  const isSearchMatch =
    !searchTerm ||
    (item.userName && item.userName.toLowerCase().includes(search)) ||
    (item.whatsappId && item.whatsappId.toLowerCase().includes(search)) ||
    (item.lastEscalatedOfficerName && item.lastEscalatedOfficerName.toLowerCase().includes(search)) ||
    (item.lastEscalatedOfficerPhone && item.lastEscalatedOfficerPhone.toLowerCase().includes(search)) ||
    (item.category && item.category.toLowerCase().includes(search)) ||
    (item.description && item.description.toLowerCase().includes(search)) ||
    (item.status && item.status.toLowerCase().includes(search)) ||
    (item.escalationLevel && `esc_${item.escalationLevel}`.toLowerCase().includes(search));

  return isInDateRange && isStatusMatch && isCategoryMatch && isSearchMatch;
});


const handleExportToExcel = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Complaints');

  // Define headers
  const headers = [
    'Citizen Name',
    'Citizen Contact',
    'Officer Name',
    'Officer Designation',
    'Officer Contact',
    'Complaint Category',
    'Complaint Description',
    'Complaint Status',
    'Escalation Level',
    'Register Time',
    'View Details', // ⬅️ This is the dynamic column you're missing
  ];

  worksheet.addRow(headers);

  sortedComplaints.forEach(item => {
    const created = new Date(item.createdAt);
    const now = new Date();
    const diffMs = now - created;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHrs = Math.floor((diffMs / (1000 * 60 * 60)) % 24);

    let viewDetails = '';
    if (item.status === 'Rejected') {
      viewDetails = 'Rejected';
    } else if (item.status === 'Resolved') {
      viewDetails = 'Resolved';
    } else {
      viewDetails = diffDays > 0 && diffHrs > 0
        ? `${diffDays}d ${diffHrs}h`
        : diffDays > 0
        ? `${diffDays}d`
        : `${diffHrs}h`;
    }

    worksheet.addRow([
      item.userName,
      item.whatsappId,
      item.lastEscalatedOfficerName,
      item.lastEsclatedOfficerDesignation,
      item.lastEscalatedOfficerPhone,
      item.category,
      item.description,
      item.status,
      item.escalationLevel ? `Esc_${item.escalationLevel}` : 'Not Assigned',
      created.toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      viewDetails,
    ]);
  });

  // Auto-width for all columns
  worksheet.columns.forEach(column => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, cell => {
      const value = cell.value ? cell.value.toString() : '';
      maxLength = Math.max(maxLength, value.length);
    });
    column.width = maxLength + 6;
  });

  // Export file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'Complaints.xlsx');
};
useEffect(() => {
  const sorted = [...filteredComplaints].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return sortOrderAsc ? timeA - timeB : timeB - timeA;
  });
  setSortedComplaints(sorted);
}, [filteredComplaints, sortOrderAsc]);

const toggleSortOrder = () => {
  setSortOrderAsc((prev) => !prev);
};


useEffect(() => {
  if (location.state && location.state.status) {
    setStatus(location.state.status);
  }
}, [location.state]);

  useEffect(() => {
    fetch('http://45.114.143.153:8080/api/complaints/all')
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
  fetch(`http://45.114.143.153:8080/api/complaints/get/${id}/escalations`)
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
  <div style={{ position: 'absolute', top: '60px', right: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
  <h4 style={{ margin: 0 }}>Search..</h4>
  <input
    type='text'
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{ padding: '6px', width: '300px',  }}
    placeholder="Search by name, phone, category, status, etc."
  />
</div>


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
    marginTop:'80px'
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
   <option value="Rejected">Rejected</option>
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
<button
  onClick={handleExportToExcel}
  style={{ width: '150px', padding: '4px 8px' ,fontSize: '15px'}}
 
>
  Export to Excel
</button>


</div>

  {/* Table */}
   <div
  style={{
    width: '1050px',
    marginLeft: '14%',
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
    {[
      'Citizen Name',
      'Citizen Contact',
      'Officer Name',
      'Officer Contact',
      ' Complaint Category',
      ' Complaint Description',
      ' Complaint Status',
      'Esclation Level',
      'Register Time',
      'View Details',
      ' Complaints Details',
    ].map((heading, idx) => (
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
          width: '140px',
          ...(idx === 0 && { borderTopLeftRadius: '6px' }),
          ...(idx === 6 && { borderTopRightRadius: '6px' }),
        }}
      >
        {heading === 'Register Time' ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{heading}</span>
            <FontAwesomeIcon
              icon={['fas', 'sort']}
              style={{ cursor: 'pointer' }}
              onClick={toggleSortOrder}
              title={`Sort by Register Time (${sortOrderAsc ? 'Ascending' : 'Descending'})`}
            />
          </div>
        ) : (
          heading
        )}
      </th>
    ))}
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
              {status} No complaints found for the selected filters.

            </td>
          </tr>
        ) : (
          sortedComplaints.map((item, index) => (
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
                  textAlign: 'center',
                }}
              >
                {item.whatsappId}
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
  <div>
    {item.lastEscalatedOfficerName}
  </div>
  <div style={{ fontSize: '9px', color: '#555' }}>
    ({item.lastEsclatedOfficerDesignation})
  </div>
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
                  fontWeight: 'bold',
                  fontSize: '13px',
                  textAlign: 'center',
                  color:
                    item.status === 'Pending'
                      ? 'red'
                      : item.status === 'Resolved'
                      ? 'green'
                      : item.status === 'Rejected'
                      ? 'black'
                      : '#0d6efd',
                }}
              >
                {item.status === 'Resolved'
                  ? 'Resolved'
                  : item.status === 'Pending'
                  ? 'Pending'
                  : item.status === 'Rejected'
                  ? 'Rejected'
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
                  fontWeight: 'bold',
                  fontSize: '13px',
                  color: (() => {
                    const created = new Date(item.createdAt);
                    const now = new Date();
                    const diffHrsTotal = Math.floor(
                      (now - created) / (1000 * 60 * 60)
                    );

                    if (item.status === 'Resolved') return 'green';
                    if (item.status === 'Rejected') return 'black';
                    return diffHrsTotal < 24 ? 'green' : 'red';
                  })(),
                  textAlign: 'center',
                }}
              >
                {(() => {
                  if (item.status === 'Rejected') return 'Rejected';
                  if (item.status === 'Resolved') return 'Resolved';

                  const created = new Date(item.createdAt);
                  const now = new Date();

                  const diffMs = now - created;
                  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                  const diffHrs = Math.floor(
                    (diffMs / (1000 * 60 * 60)) % 24
                  );

                  if (diffDays > 0 && diffHrs > 0)
                    return `${diffDays}d ${diffHrs}h`;
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
<div style={{ position: 'relative' }}>
  <button
    onClick={() => setShowStaticForm(true)}
    style={{
      position: 'absolute',  // 👈 floats the button
      top: -70,
      right: 0,
      padding: '8px 8px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '9px',
      fontSize: '12px',
      cursor: 'pointer',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
      transition: 'background-color 0.3s ease',
    }}
    onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
    onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
  >
    View Photo
  </button>
</div>
 



{showStaticForm && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}
  >
    <div
      style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '10px',
        width: '1100px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        position: 'relative',
      }}
    >
      <h2 style={{ marginBottom: '20px', color: '#1BA1E2' }}>Complaint Details</h2>

    {/* Complaint Image */}
{/* Complaint and Resolved Images side by side */}
<div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
  {/* Complaint Image */}
  <div style={{ flex: 1 }}>
  <p><strong>Complaint Image:</strong></p>
  {escalations.complaintImageUrl ? (
    <img
      src={escalations.complaintImageUrl}
      alt="Complaint"
     style={{
  width: '600px',          // 👈 increase image width
  height: 'auto',          // 👈 auto-adjust height to maintain aspect ratio
  objectFit: 'contain',
  borderRadius: '6px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  backgroundColor: '#f8f8f8',
  maxWidth: '100%'         // 👈 prevents overflow if screen is smaller
}}
    />
  ) : (
    <p style={{ color: 'gray', fontStyle: 'italic' }}>Image not available</p>
  )}
</div>

<div style={{ flex: 1 }}>
  <p><strong>Resolved Image:</strong></p>
  {escalations.resolvedImageUrl ? (
    <img
      src={escalations.resolvedImageUrl}
      alt="Resolved"
    style={{
  width: '600px',          // 👈 increase image width
  height: 'auto',          // 👈 auto-adjust height to maintain aspect ratio
  objectFit: 'contain',
  borderRadius: '6px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  backgroundColor: '#f8f8f8',
  maxWidth: '100%'         // 👈 prevents overflow if screen is smaller
}}
    />
  ) : (
    <p style={{ color: 'gray', fontStyle: 'italic' }}>Image not available</p>
  )}
</div>

</div>



      {/* Google Maps Location */}
      <div style={{ marginBottom: '15px' }}>
        <p><strong>Location:</strong></p>
        <a
          href={escalations.locationUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#0d6efd',
            textDecoration: 'underline',
          }}
        >
          Open Location in Google Maps
        </a>
      </div>

      {/* Close Button */}
      <button
        onClick={() => setShowStaticForm(false)}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          border: 'none',
          background: 'transparent',
          fontSize: '18px',
          cursor: 'pointer',
        }}
      >
        ❌
      </button>
    </div>
  </div>
)}

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
