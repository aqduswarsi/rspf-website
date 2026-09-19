import { useState } from "react";

const initialUsers = [
  {
    id: "33893449",
    name: "POOJA",
    sponsor: "32825325",
    phone: "9336726146",
    address: "VILLAGE POST KACHANARWA PS KONE",
    class:
      "STEP 01 Origin and Concept Diploma in Direct Selling (Astra Shastra)",
    date: "29-May-2026",
    category: "Silver",
  },
  {
    id: "37270974",
    name: "JEETAN",
    sponsor: "32825325",
    phone: "9118382581",
    address: "VILLAGE POST KACHANARWA PS KONE",
    class:
      "STEP 01 Origin and Concept Diploma in Direct Selling (Astra Shastra)",
    date: "29-May-2026",
    category: "Silver",
  },
  {
    id: "36499730",
    name: "PINKI DEVI",
    sponsor: "32825325",
    phone: "7054142640",
    address: "VILLAGE HARRA POST HARRA PS KONE",
    class:
      "STEP 01 Origin and Concept Diploma in Direct Selling (Astra Shastra)",
    date: "29-May-2026",
    category: "Silver",
  },
  {
    id: "42104387",
    name: "VINOD KUMAR GUPTA",
    sponsor: "37270974",
    phone: "9170896391",
    address: "VILLAGE KHARAUNDHI POST KONE",
    class:
      "STEP 01 Origin and Concept Diploma in Direct Selling (Astra Shastra)",
    date: "29-May-2026",
    category: "Silver",
  },
  {
    id: "42384470",
    name: "VANSH TIWARI",
    sponsor: "37270974",
    phone: "7985053680",
    address: "AYODHYA",
    class:
      "STEP 01 Origin and Concept Diploma in Direct Selling (Astra Shastra)",
    date: "29-May-2026",
    category: "Silver",
  },
];

export default function UsersUnverified() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");

  const handleAccept = (id) => {
    if (!window.confirm(`Accept user ${id}?`)) return;
    setUsers(users.filter((u) => u.id !== id));
    alert(`User ${id} accepted`);
    // TODO: API call — POST /api/admin/users/accept
  };

  const handleReject = (id) => {
    if (!window.confirm(`Reject user ${id}?`)) return;
    setUsers(users.filter((u) => u.id !== id));
    alert(`User ${id} rejected`);
    // TODO: API call — POST /api/admin/users/reject
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.id.includes(search) ||
      u.phone.includes(search),
  );

  return (
    <div className="users-page">
      <div className="users-header">
        <h2>Unverified Users</h2>
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
                  <button
                    className="btn-accept"
                    onClick={() => handleAccept(u.id)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => handleReject(u.id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="10" className="empty-row">
                  No unverified users
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
