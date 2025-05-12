import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
const buttonStyle = {
  display: 'block',
  width: '100%',
  padding: '10px 15px',
  marginBottom: '10px',
  backgroundColor: '#0d6efd',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '22px',
  cursor: 'pointer'
};

const listItemStyle = {
  padding: '12px 16px',
  borderBottom: '1px solid #dee2e6',
  fontSize: '22px',
  backgroundColor: '#fff',
  color: '#003366' // You can change this to any color you like
};


export default function Dash() {
  const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [showMessages, setShowMessages] = useState(false); 
  const[showTransactional, setShowTransactional]= useState(false);
  const[showPhone, setShowPhone]= useState(false);
  const[showReport, setShowReport]= useState(false);
  const COLORS = ['#FF8042', '#00C49F', '#FFBB28'];
const pieData = [
  { name: 'Pending', value: complaints.length },  // Dynamic
  { name: 'Resolved', value: 5 },
  { name: 'Other', value: 3 },
];
// Fetch data from the API

// Fetch data from the API
useEffect(() => {
  fetch('http://localhost:8080/api/complaints/unresolved')
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



  return (
    <div style={{ display: 'flex', padding: '2rem' }}>
      
      {/* Left Side: Contact List */}
      <div
        style={{
          width: '300px',
          marginLeft: '-1.5%',
          marginRight: '2rem',
          background: '#19475e',
          padding: '1rem',
          borderRadius: '8px',
          height: '100vh',
          overflowY: 'auto',
          color: 'white'
        }}
      >
        <h2 style={{ textAlign: 'center' }}>Contact List</h2>
<button style={buttonStyle} onClick={() => setShowMessages(!showMessages)}>Message</button>

{showMessages && (
  <div style={{ marginTop: '1rem', maxWidth: '400px', margin: '1rem auto' }}>
    <ul style={{
      listStyle: 'none',
      padding: 0,
      margin: 0,
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    }}>
      <li style={listItemStyle}> Message 1:</li>
      <li style={listItemStyle}> Message 2:</li>
      <li style={listItemStyle}> Message 3:</li>
    </ul>
  </div>
)}
    
        <button style={buttonStyle} onClick={()=>setShowTransactional(!showTransactional)}>Transactional</button>
        {showTransactional &&(
          <div  style={{ marginTop: '1rem', maxWidth: '400px', margin: '1rem auto' }}>
          <ul style={{
      listStyle: 'none',
      padding: 0,
      margin: 0,
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    }}>
            <li style={listItemStyle}>Complete</li>
            <li style={listItemStyle}>Pending</li>
            <li style={listItemStyle}>Fail</li>
          </ul>
          </div>
        )
        
        }
        <button style={buttonStyle} onClick={() =>setShowPhone (!showPhone)}>Phone Book</button>
        {
          showPhone &&
          (
            <div  style={{ marginTop: '1rem', maxWidth: '400px', margin: '1rem auto' }}>
            <ul style={{
      listStyle: 'none',
      padding: 0,
      margin: 0,
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    }}>
              <li style={listItemStyle}>Successfully Book</li>
              <li style={listItemStyle}>Pending</li>
              <li style={listItemStyle}>Not Book</li>
            </ul>
            </div>
          )
        }
        <button style={buttonStyle} onClick={() => setShowReport(!showReport)}>Reports</button>
        {
          showReport &&
          ( <div  style={{ marginTop: '1rem', maxWidth: '400px', margin: '1rem auto' }}>
            <ul style={{
      listStyle: 'none',
      padding: 0,
      margin: 0,
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    }}>
              <li style={listItemStyle}>First Report</li>
              <li style={listItemStyle}>Second Report</li>
              <li style={listItemStyle}>Third Report</li>
            </ul>
            </div>
          )
        }
          </div>

      {/* Right Side: Dashboard Content */}
      <div style={{ flex: 1, marginTop: '-10px' }}>
        <h1>Dashboard</h1>

        {/* Summary Boxes */}
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', height: '150px' }}>
          <div style={{ flex: 1, background: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
        
<p style={{ marginTop: '42px', fontSize: '30px', fontWeight: 'bold' }}>
   {complaints.length}
</p>

            <div style={{ background: '#0d6efd', height: '85px', width: '170px', padding: '1rem', borderRadius: '8px', color: 'white',marginTop: '-110px' }}>
              <h3>Pending Complaints</h3>
            </div>
          </div>
          <div style={{ flex: 1, background: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ background: '#0d6efd', height: '85px', padding: '1rem', borderRadius: '8px', color: 'white', width: '170px' }}>
              <h3>Resolve</h3>
            </div>
          </div>
          <div style={{ flex: 1, background: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ background: '#0d6efd', height: '85px', padding: '1rem', borderRadius: '8px', color: 'white', width: '170px' }}>
              <h3>Highest</h3>
            </div>
          </div>
        </div>
        <PieChart width={300} height={250}>
  <Pie
    data={pieData}
    cx="50%"
    cy="50%"
    innerRadius={50}
    outerRadius={90}  // Increased from 50 to 100
    fill="#8884d8"
    paddingAngle={5}
    dataKey="value"
    label
  >
    {pieData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
</PieChart>

     

        {/* Complaints Table */}
        <h2 style={{ marginTop: '2rem' }}>Unresolved Complaints</h2>
        <div style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'auto' }}>
  <table style={{ 
    width: '100%', 
    borderCollapse: 'collapse', 
    fontFamily: 'Arial, sans-serif', 
    fontSize: '14px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' 
  }}>
    <thead>
      <tr style={{ backgroundColor: '#0d6efd', color: 'white' }}>
        {['Name', 'Category', 'Description', 'Status', 'Time', 'Phone No', 'Whats ID'].map((heading, idx) => (
          <th key={idx} style={{
            border: '1px solid #dee2e6',
            padding: '10px',
            position: 'sticky',
            top: 0,
            backgroundColor: '#1BA1E2',
            zIndex: 1,
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
          }}>
            {heading}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {complaints.map((item, index) => (
        <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff', fontSize: '18px' }}>
          <td style={{ border: '1px solid #dee2e6', padding: '10px' }}>{item.userName}</td>
          <td style={{ border: '1px solid #dee2e6', padding: '10px' }}>{item.category}</td>
          <td style={{ border: '1px solid #dee2e6', padding: '10px' }}>{item.description}</td>
          <td style={{ 
            border: '1px solid #dee2e6', 
            padding: '10px', 
            fontWeight: 'bold', 
            color: item.status === 'Pending' ? 'red' : 'green' 
          }}>
            {item.status}
          </td>
          <td style={{ border: '1px solid #dee2e6', padding: '10px' }}>{item.createdAt}</td>
          <td style={{ border: '1px solid #dee2e6', padding: '10px' }}>{item.phoneNumber}</td>
          <td style={{ border: '1px solid #dee2e6', padding: '10px' }}>{item.whatsappId}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      </div>
    </div>
  );
}
