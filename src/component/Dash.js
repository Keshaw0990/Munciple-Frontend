import React, { useEffect, useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import "../styles/Dash.css";
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
  cursor: 'pointer'
};

const listItemStyle = {
  padding: '5px 10px',
  borderBottom: '1px solid #dee2e6',
  fontSize: '10px',
  backgroundColor: '#fff',
  color: '#003366' // You can change this to any color you like
};

const cellStyle = {
  border: '1px solid #dee2e6',
  padding: '6px 8px',
  fontSize: '13px',
  wordWrap: 'break-word',
  textAlign: 'center',
  whiteSpace: 'normal',
};
export default function Dash() {
  const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [showMessages, setShowMessages] = useState(false); 
  const[showTransactional, setShowTransactional]= useState(false);
  const[showPhone, setShowPhone]= useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
const [selectedPeriod, setSelectedPeriod] = useState(null); // 'month' | 'week' | 'yesterday'
const [allData, setAllData] = useState([]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const CATEGORY_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#D65DB1', '#FF6F91', '#2C73D2'];
const [selectedCategoryStatus, setSelectedCategoryStatus] = useState(null);

  const navigate = useNavigate();
  
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
const pendingCount = complaints.filter(c => c.status === 'Pending').length;

useEffect(() => {
  fetch('http://localhost:8080/api/complaints/all')
    .then(res => res.json())
    .then(data => {
      setComplaints(data);
      setAllData(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
}, []);

const CustomLegend = ({ payload }) => (
  <ul style={{ listStyle: 'none', margin: 0, padding: '10px' }}>
    {payload.map((entry, index) => (
      <li key={`item-${index}`} style={{ padding: '3px 6px', display: 'flex', alignItems: 'center' }}>
        <span
          style={{
            display: 'inline-block',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: entry.color,
            marginRight: '6px',
          }}
        />
        <span style={{ color: entry.color }}>{entry.value}</span>
      </li>
    ))}
  </ul>
);


const getStatusWiseData = (complaints) => {
  const statusCount = {};

  complaints.forEach(item => {
    const status = item.status || 'Unknown';
    statusCount[status] = (statusCount[status] || 0) + 1;
  });
const pieData = complaints.length > 0 ? getStatusWiseData(complaints) : [];
  return Object.keys(statusCount).map(status => ({
    name: status,
    value: statusCount[status]
  }));
};

const filteredComplaints = selectedStatus
  ? complaints.filter(item => item.status === selectedStatus)
  : complaints;

// Get Pie Chart Data
const pieData = useMemo(() => {
  const statusCount = {};

  complaints.forEach(item => {
    const status = item.status || 'Unknown';
    statusCount[status] = (statusCount[status] || 0) + 1;
  });

  return Object.keys(statusCount).map(status => ({
    name: status,
    value: statusCount[status]
  }));
}, [complaints]);

// Fetch data from the API

// Fetch data from the API


const now = new Date();

// Helper function to parse date safely
const parseDate = (dateString) => new Date(dateString);

// Last 30 days: items with createdAt >= now - 30 days
const last30Days = complaints.filter(item => {
  const createdAt = parseDate(item.createdAt);
  const daysAgo30 = new Date();
  daysAgo30.setDate(daysAgo30.getDate() - 30);
  return createdAt >= daysAgo30 && createdAt <= now;
});

// Last 7 days: items with createdAt >= now - 7 days
const last7Days = complaints.filter(item => {
  const createdAt = parseDate(item.createdAt);
  const daysAgo7 = new Date();
  daysAgo7.setDate(daysAgo7.getDate() - 7);
  return createdAt >= daysAgo7 && createdAt <= now;
});

// Yesterday: items with createdAt on the day before today
const yesterday = complaints.filter(item => {
  const createdAt = parseDate(item.createdAt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);  // start of today
  const yesterdayStart = new Date(today);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1); // start of yesterday
  const yesterdayEnd = new Date(today);
  yesterdayEnd.setMilliseconds(-1);  // end of yesterday (just before today starts)
  return createdAt >= yesterdayStart && createdAt <= yesterdayEnd;
});
console.log(complaints);
console.log('Last 30 days:', last30Days.length);
console.log('Last 7 days:', last7Days.length);
console.log('Yesterday:', yesterday.length);

const getStatusCounts = (data) => {
  const statusCounts = {};
  data.forEach(item => {
    let status = item.status || 'Unknown';

    // ✅ Group non-Pending/Resolved into In_Progress
    if (status !== 'Pending' && status !== 'Resolved') {
      status = 'In_Progress';
    }

    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
};


const pieDataMonth = getStatusCounts(last30Days);
const pieDataWeek = getStatusCounts(last7Days);
const pieDataYesterday = getStatusCounts(yesterday);

console.log('Pie Data Month:', pieDataMonth);
console.log('Pie Data Week:', pieDataWeek);
console.log('Pie Data Yesterday:', pieDataYesterday);

const filteredComplaintsByStatus = last30Days.filter(
  (item) => item.status === selectedStatus
);

let filteredData = [];

if (selectedStatus && selectedPeriod) {
  if (selectedPeriod === 'month') {
    filteredData = last30Days.filter((item) => item.status === selectedStatus);
  } else if (selectedPeriod === 'week') {
    filteredData = last7Days.filter((item) => item.status === selectedStatus);
  } else if (selectedPeriod === 'yesterday') {
    filteredData = yesterday.filter((item) => item.status === selectedStatus);
  }
} else {
  // Show all data by default
 filteredData = allData; 
}

const categoryWiseData = useMemo(() => {
  const categoryCount = {};
  
  complaints
    .filter(item => {
      if (!selectedCategoryStatus) return true; // Show all if no filter is selected
      return selectedCategoryStatus === 'In_Progress'
        ? item.status !== 'Resolved' && item.status !== 'Pending'
        : item.status === selectedCategoryStatus;
    })
    .forEach(item => {
      const category = item.category || 'Unknown';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

  return Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
}, [complaints, selectedCategoryStatus]);



  return (
    <div style={{ display: 'flex', padding: '2rem' }}>
      
      {/* Left Side: Contact List */}
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
        <h3 style={{ textAlign: 'center', }}>Contact List</h3>

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
        <button style={buttonStyle} onClick={() => navigate('/Info')} >Reports</button>
       
          </div>

      {/* Right Side: Dashboard Content */}
      <div style={{ flex: 1, marginTop: '1px', marginLeft: '12%' }}>
      
        <h3>Dashboard</h3>

        {/* Summary Boxes */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', height: '100px',width:'100%' }}>
         <div
  style={{
    flex: 1,
    background: '#f0f0f0',
    padding: '1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  }}
  onClick={() => navigate('/table')}
  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
>
  <p style={{ marginTop: '22px', fontSize: '22px', fontWeight: 'bold', marginLeft: '110px' }}>
    {complaints.length}
  </p>
  <div
    style={{
      background: '#0d6efd',
      height: '35px',
      padding: '1rem',
      borderRadius: '8px',
      color: 'white',
      width: '100px',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '-22%',
    }}
  >
    <h3 style={{ margin: 0 }}>Total Complaints</h3>
  </div>
</div>

 <div
  style={{
    flex: 1,
    background: '#f0f0f0',
    padding: '1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  }}
  onClick={() => navigate('/table', { state: { status: 'Resolved' } })}
  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
>
  <p style={{ marginTop: '22px', fontSize: '22px', fontWeight: 'bold', marginLeft: '110px' }}>
    {resolvedCount}
  </p>
  <div
    style={{
      background: '#0d6efd',
      height: '35px',
      padding: '1rem',
      borderRadius: '8px',
      color: 'white',
      width: '100px',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '-22%',
    }}
  >
    <h3 style={{ margin: 0 }}>Resolved Complaints</h3>
  </div>
</div>
<div
  style={{
    flex: 1,
    background: '#f0f0f0',
    padding: '1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  }}
  onClick={() => navigate('/table', { state:{status: 'Pending'}})}
  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
>
  <p style={{ marginTop: '22px', fontSize: '22px', fontWeight: 'bold', marginLeft: '110px' }}>
    {pendingCount}
  </p>
  <div
    style={{
      background: '#0d6efd',
      height: '35px',
      padding: '1rem',
      borderRadius: '8px',
      color: 'white',
      width: '100px',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '-22%',
    }}
  >
    <h3 style={{ margin: 0 }}>Pending Complaints</h3>
  </div>
</div>

          {/* <div style={{ flex: 1, background: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
 <div style={{background: '#0d6efd',height: '35px',padding: '1rem',borderRadius: '8px',color: 'white',width: '100px',fontSize: '12px',display: 'flex',alignItems: 'center',justifyContent: 'center', marginTop: '1%'}}>
    <h3 style={{ margin: 0 }}>Empty</h3>
  </div>
</div> */}

        </div>

 <div style={{ display: 'flex', gap: '100px' , fontSize: '11px', marginTop: '-10px', marginLeft: '5%' }}>
  {/* Month Wise PieChart */}
  <div style={{ textAlign: 'center' }}>
    <h2>Months Wise</h2>
 <PieChart width={250} height={250}>
  <Pie
    data={pieDataMonth}
    cx="50%"
    cy="30%"
    outerRadius={70}
    fill="#8884d8"
    dataKey="value"
    onClick={(data) => {
      setSelectedStatus(data.name);
      setSelectedPeriod('month');
    }}
  >
    {pieDataMonth.map((entry, index) => (
      <Cell key={`cell-month-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
       <Legend layout="vertical" align="right" verticalAlign="top" content={<CustomLegend />} />
</PieChart>

  </div>

  {/* Week Wise PieChart */}
  <div style={{ textAlign: 'center' }}>
    <h2>Week Wise</h2>
   <PieChart width={250} height={250}>
      <Pie
        data={pieDataWeek}
        cx="50%"
        cy="30%"
        outerRadius={70}
        fill="#8884d8"
        dataKey="value"
        onClick={(data) => {
          setSelectedStatus(data.name);
          setSelectedPeriod('week');
        }}
      >
        {pieDataWeek.map((entry, index) => (
          <Cell key={`cell-week-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend layout="vertical" align="right" verticalAlign="top" content={<CustomLegend />} />
    </PieChart>

  </div>

  {/* Yesterday Wise PieChart */}
  <div style={{ textAlign: 'center' }}>
    <h2>Yesterday Wise</h2>
   <PieChart width={250} height={250}>
  <Pie
    data={pieDataYesterday}
    cx="50%"
    cy="30%"
    outerRadius={70}
    fill="#8884d8"
    dataKey="value"
    onClick={(data) => {
      setSelectedStatus(data.name);
      setSelectedPeriod('yesterday');
    }}
  >
    {pieDataYesterday.map((entry, index) => (
      <Cell key={`cell-yesterday-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
      <Legend layout="vertical" align="right" verticalAlign="top" content={<CustomLegend />} />
</PieChart>

  </div>
</div>

<div style={{ marginTop: '2rem', marginLeft: 'auto', marginRight: 'auto', width: '100%' }}>
  <h3 style={{ textAlign: 'center' }}>Category Wise Complaints</h3>
 <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
 <button
  style={{ backgroundColor: 'green', color: 'white', padding: '8px 12px', marginRight: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
  onClick={() => setSelectedCategoryStatus('Resolved')}
>
  Resolved
</button>

<button
  style={{ backgroundColor: 'orange', color: 'white', padding: '8px 12px', marginRight: '10px', border: 'none', borderRadius: '4px' , cursor: 'pointer'}}
  onClick={() => setSelectedCategoryStatus('Pending')}
>
  Pending
</button>

<button
  style={{ backgroundColor: 'blue', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
  onClick={() => setSelectedCategoryStatus('In_Progress')}
>
  In Progress
</button>

</div>
  <ResponsiveContainer width="100%" height={460}>
    <BarChart data={categoryWiseData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" interval={0} angle={-25} textAnchor="end" height={60} />
      <YAxis />
      <Tooltip />
     <Bar dataKey="value" radius={[4, 4, 0, 0]}>
  {categoryWiseData.map((entry, index) => (
    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
  ))}
</Bar>
    </BarChart>
  </ResponsiveContainer>
</div>
<div
  style={{
    position: 'sticky',
    top: 0,
    zIndex: 10,
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '10px 20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  }}
>
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px', // space between button and filter
      marginTop: '-16%',
    }}
  >
    {/* Clear Filter Button */}
    {/* {selectedStatus && selectedPeriod && (
      <button
        onClick={() => {
          setSelectedStatus(null);
          setSelectedPeriod(null);
        }}
        style={{
          backgroundColor: '#0d6efd',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          fontSize: '14px',
          borderRadius: '6px',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = '#0b5ed7')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = '#0d6efd')
        }
      >
        All Data
      </button>
    )} */}

    {/* Filter Icon */}
    {/* <div
      onClick={() => navigate('/table')}
      style={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: '#f0f0f0',
        padding: '6px 12px',
        borderRadius: '6px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      }}
    >
      <FaFilter style={{ fontSize: '20px', marginRight: '6px' }} />
      <span style={{ fontWeight: 'bold' }}>Filter</span>
    </div> */}
  </div>
</div>


 {/* Complaints Table */}
        {/* <h4 style={{ marginTop: '2rem', marginLeft: '50%' }}>Unresolved Complaints</h4> */}
{/* <div
  style={{
    width: '1000px',
    margin: '20px auto',
    height: '300px',
    overflow: 'auto',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    padding: '10px',
    backgroundColor: '#f9f9f9',
     marginTop: '-6%'
  }}
>
  <h5 style={{ textAlign: 'center',marginTop: '1%' }}>
    {selectedStatus && selectedPeriod
      ? `Complaints with status "${selectedStatus}" (${selectedPeriod === 'month' ? 'Last 1 Month' : selectedPeriod === 'week' ? 'Last 1 Week' : 'Yesterday'})`
      : 'All Complaints'}
  </h5>

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
        {['Name', 'Category', 'Description', 'Status', 'Time', 'Phone No', 'Whats ID'].map((heading, idx) => (
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
        ))}
      </tr>
    </thead>
    <tbody>
      {filteredData.map((item, index) => (
        <tr
          key={index}
          style={{
            backgroundColor: index % 2 === 0 ? '#f1f9ff' : '#ffffff',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d9efff')}
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#f1f9ff' : '#ffffff')
          }
        >
          <td style={cellStyle}>{item.userName}</td>
          <td style={cellStyle}>{item.category}</td>
          <td style={{ ...cellStyle, maxWidth: '250px' }}>{item.description}</td>
          <td style={{ ...cellStyle, color: item.status === 'Pending' ? 'red' : 'green', fontWeight: 'bold' }}>
            {item.status}
          </td>
          <td style={{ ...cellStyle, whiteSpace: 'nowrap', minWidth: '180px', textAlign: 'left' }}>
            {new Date(item.createdAt).toLocaleString('en-IN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </td>
          <td style={cellStyle}>{item.phoneNumber}</td>
          <td style={cellStyle}>{item.whatsappId}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div> */}





 </div>
    </div>
  );
}
