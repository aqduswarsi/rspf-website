import { useState } from "react";

const initialUsers = [
  {
    id: "33893449",
    name: "POOJA",
    sponsor: "32825325",
    phone: "9336726146",
    address: "VILLAGE POST KACHANARWA PS KONE",
    class: "STEP 01 Origin and Concept Diploma",
    date: "29-May-2026",
    category: "Silver",
  },
  {
    id: "37270974",
    name: "JEETAN",
    sponsor: "32825325",
    phone: "9118382581",
    address: "VILLAGE POST KACHANARWA PS KONE",
    class: "STEP 01 Origin and Concept Diploma",
    date: "29-May-2026",
    category: "Silver",
  },
  {
    id: "36499730",
    name: "PINKI DEVI",
    sponsor: "32825325",
    phone: "7054142640",
    address: "VILLAGE HARRA POST HARRA PS KONE",
    class: "STEP 01 Origin and Concept Diploma",
    date: "29-May-2026",
    category: "Silver",
  },
  {
    id: "42104387",
    name: "VINOD KUMAR GUPTA",
    sponsor: "37270974",
    phone: "9170896391",
    address: "VILLAGE KHARAUNDHI POST KONE",
    class: "STEP 01 Origin and Concept Diploma",
    date: "29-May-2026",
    category: "Silver",
  },
  {
    id: "42384470",
    name: "VANSH TIWARI",
    sponsor: "37270974",
    phone: "7985053680",
    address: "AYODHYA",
    class: "STEP 01 Origin and Concept Diploma",
    date: "29-May-2026",
    category: "Silver",
  },
  {
    id: "37290334",
    name: "RAJIYA DEVI",
    sponsor: "33893449",
    phone: "9120451098",
    address: "VILLAGE POST KACHANARWA PS KONE",
    class: "STEP 01 Origin and Concept Diploma",
    date: "29-May-2026",
    category: "Silver",
  },
  {
    id: "38811605",
    name: "Chandramani devi",
    sponsor: "33893449",
    phone: "7007014981",
    address: "PATNA",
    class: "STEP 01 Origin and Concept Diploma",
    date: "29-May-2026",
    category: "Silver",
  },
  {
    id: "42670465",
    name: "Pankaj Kumar",
    sponsor: "37270974",
    phone: "8922950639",
    address: "Village Post Kone",
    class: "STEP 01 Diploma in Origin and Concept of Direct Selling",
    date: "29-Aug-2026",
    category: "Gold",
  },
];

export default function UsersVerified() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  const handleEdit = (user) => setEditing({ ...user });

  const handleBlock = (id) => {
    if (!window.confirm(`Block user ${id}?`)) return;
    setUsers(users.filter((u) => u.id !== id));
    alert(`User ${id} blocked`);
    // TODO: API call — POST /api/admin/users/block
  };

  const saveEdit = () => {
    setUsers(users.map((u) => (u.id === editing.id ? editing : u)));
    setEditing(null);
    alert("User updated");
    // TODO: API call — PUT /api/admin/users/:id
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.id.includes(search),
  );

  return (
    <div className="users-page">
      <div className="users-header">
        <h2>Verified Users</h2>
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-wrap">
        <table className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User Id</th>
              <th>Name</th>
              <th>Sponsor No</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Class</th>
              <th>Date</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id}>
                <td>{i + 1}</td>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.sponsor}</td>
                <td>{u.phone}</td>
                <td>{u.address}</td>
                <td>{u.class}</td>
                <td>{u.date}</td>
                <td>{u.category}</td>
                <td className="action-cell">
                  <button className="btn-edit" onClick={() => handleEdit(u)}>
                    Edit
                  </button>
                  <button
                    className="btn-block"
                    onClick={() => handleBlock(u.id)}
                  >
                    Block
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="10" className="empty-row">
                  No verified users
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Edit User #{editing.id}</h3>
            <input
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              placeholder="Name"
            />
            <input
              value={editing.phone}
              onChange={(e) =>
                setEditing({ ...editing, phone: e.target.value })
              }
              placeholder="Phone"
            />
            <input
              value={editing.address}
              onChange={(e) =>
                setEditing({ ...editing, address: e.target.value })
              }
              placeholder="Address"
            />
            <input
              value={editing.sponsor}
              onChange={(e) =>
                setEditing({ ...editing, sponsor: e.target.value })
              }
              placeholder="Sponsor No"
            />
            <div className="modal-actions">
              <button onClick={() => setEditing(null)}>Cancel</button>
              <button className="primary" onClick={saveEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
