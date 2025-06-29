import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cellStyle = {
  border: '1px solid #dee2e6',
  padding: '6px 8px',
  fontSize: '13px',
  textAlign: 'center',
  wordWrap: 'break-word',
  whiteSpace: 'normal',
  maxWidth: '150px',
  overflowWrap: 'break-word',
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

const labelStyle = {
  width: '40%',
  fontWeight: '600',
  textAlign: 'left',
};

const inputStyle = {
  width: '58%',
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '15px',
};

const updateButtonStyle = {
  flex: 1,
  padding: '12px',
  backgroundColor: '#007BFF',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

const cancelButtonStyle = {
  flex: 1,
  padding: '12px',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};


export default function Info() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [editOfficer, setEditOfficer] = useState(null);
  const [selectedDept, setSelectedDept] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/officer/get/all')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setOfficers(data.officers);
          const deptNames = [...new Set(data.officers.map((o) => o.departmentName).filter(Boolean))];
          setDepartments(deptNames);
        }
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);
const handleDelete = (officerId) => {
  console.log("aaaaaa",officerId)
  if (window.confirm('Are you sure you want to delete this officer?')) {
    fetch(`http://localhost:8080/api/officer/delete/${officerId}`, {
      method: 'DELETE',
    })

      .then((res) => {
        if (!res.ok) throw new Error('Delete failed');
        return res.text(); // backend may return empty body
      })
      .then(() => {
        setOfficers((prev) => prev.filter((officer) => officer.officerId !== officerId));
      })
      .catch((error) => {
        console.error('Error deleting officer:', error);
        alert('Something went wrong.');
      });
  }
};


  const handleEditClick = (officer) => {
    setEditOfficer(officer);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditOfficer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/officer/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editOfficer),
      });

      if (!response.ok) throw new Error('Failed to update officer');
      const updatedOfficer = await response.json();

      setOfficers((prev) =>
        prev.map((o) => (o.officerId === updatedOfficer.officerId ? updatedOfficer : o))
      );

      alert('Officer updated successfully!');
      setEditOfficer(null);
    } catch (error) {
      console.error(error);
      alert('Error updating officer');
    }
  };

  return (
    <div>
      {/* Sidebar */}
      <div style={{
        position: 'fixed', top: '40px', left: 0, width: '130px',
        background: '#19475e', padding: '1rem', borderRadius: '0 8px 8px 0',
        height: 'calc(100vh - 45px)', overflowY: 'auto', color: 'white', zIndex: 999,
      }}>
        <h3 style={{ textAlign: 'center' }}>Contact List</h3>
        <button style={buttonStyle} onClick={() => navigate('/')}>Dashboard</button>
        <button style={buttonStyle}>Transactional</button>
        <button style={buttonStyle}>Phone Book</button>
        <button style={buttonStyle}>Reports</button>
      </div>

      {/* Filter by Department */}
     {!editOfficer && (
  <div style={{ marginLeft: '14.7%', marginTop: '80px' }}>
    <label style={{ fontWeight: 'bold', fontSize: '14px', marginRight: '10px' }}>
      Department:
    </label>
    <select
      value={selectedDept}
      onChange={(e) => setSelectedDept(e.target.value)}
      style={{ padding: '5px', borderRadius: '5px' }}
    >
      <option value="">-- Select Department --</option>
      {departments.map((dept, idx) => (
        <option key={idx} value={dept}>{dept}</option>
      ))}
    </select>
  </div>
)}


      {/* Officer Table */}
      <div style={{ width: '1050px', marginLeft: '14.7%', marginTop: '2%' }}>
        {!editOfficer && (
          <div style={{
            height: '300px', overflow: 'auto', border: '1px solid #ccc',
            borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', padding: '10px',
            backgroundColor: '#f9f9f9',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8px', tableLayout: 'fixed' }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(to right, #0d6efd, #1BA1E2)',
                  color: 'white', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                }}>
                  {['Officer_Id', 'Name', 'Email', 'Phone No', 'Role', 'Dept Name', 'Assigned_Zone', 'Created_at', 'Action'].map((heading, idx) => (
                    <th key={idx} style={{
                      border: '1px solid #dee2e6', padding: '6px',
                      position: 'sticky', top: -10, backgroundColor: '#1BA1E2',
                      zIndex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: '15px',
                      width: idx === 7 ? '220px' : '120px',
                      ...(idx === 0 && { borderTopLeftRadius: '6px' }),
                      ...(idx === 7 && { borderTopRightRadius: '6px' }),
                    }}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {officers
                  .filter((officer) => !selectedDept || officer.departmentName === selectedDept)
                  .map((officer, index) => (
                    <tr key={officer.officerId}
                      style={{
                        backgroundColor: index % 2 === 0 ? '#f1f9ff' : '#ffffff',
                        transition: 'background-color 0.3s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d9efff')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#f1f9ff' : '#ffffff')}
                    >
                      <td style={cellStyle}>OFF{officer.officerId}</td>
                      <td style={cellStyle}>{officer.name}</td>
                      <td style={cellStyle}>{officer.email}</td>
                      <td style={cellStyle}>{officer.phoneNumber}</td>
                      <td style={cellStyle}>Role {officer.role}</td>
                      <td style={cellStyle}>{officer.departmentName}</td>
                      <td style={cellStyle}>{officer.assignedZone}</td>
                      <td style={{ ...cellStyle, whiteSpace: 'nowrap' }}>{new Date(officer.createdAt).toLocaleString()}</td>
                      <td style={{ ...cellStyle, textAlign: 'center' }}>
                        <span
                          style={{ marginRight: '8px', cursor: 'pointer', color: '#0d6efd' }}
                          title="Edit"
                          onClick={() => handleEditClick(officer)}
                        >✏️</span>
                        <span
                          style={{ cursor: 'pointer', color: 'red' }}
                          title="Delete"
                          onClick={() => handleDelete(officer.officerId)}
                        >🗑️</span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Form Modal */}
      
 {editOfficer && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    }}
  >
    <div
      style={{
        width: '550px',
        maxHeight: '80vh',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#333',
        overflowY: 'auto',
      }}
    >
      <h3 style={{ marginBottom: '20px', color: '#007BFF', textAlign: 'center' }}>
        Edit Officer: {editOfficer.name}
      </h3>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}
      >
        {/* Reusable input row */}
        {[
          { label: 'Name', name: 'name', type: 'text' },
          { label: 'Phone', name: 'phoneNumber', type: 'text' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Assigned Zone', name: 'assignedZone', type: 'text' },
          { label: 'Role', name: 'role', type: 'text' },
        ].map(({ label, name, type }) => (
          <div
            key={name}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <label style={labelStyle}>{label}:</label>
            <input
              type={type}
              name={name}
              value={editOfficer[name]}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        ))}

        {/* Department dropdown */}
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <label style={labelStyle}>Department:</label>
          <select
            name="departmentName"
            value={editOfficer.departmentName || ''}
            onChange={handleChange}
            style={{
              ...inputStyle,
              cursor: 'pointer',
              padding: '9px 12px',
            }}
          >
            <option value="">-- Select Department --</option>
            {departments.map((dept, idx) => (
              <option key={idx} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
          <button
            onClick={handleUpdate}
            style={updateButtonStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#007BFF')}
          >
            Update
          </button>

          <button
            onClick={() => setEditOfficer(null)}
            style={cancelButtonStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#565e64')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#6c757d')}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}


      </div>
    </div>
  );
}
