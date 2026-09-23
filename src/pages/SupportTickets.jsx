import { NavLink, useLocation } from "react-router-dom";

const tickets = {
  "non-answered": [
    {
      id: 1,
      userId: "33893449",
      question: "Hello! You have done a great job by launching this website.",
      answer: "",
      date: "29-May-2026",
    },
    {
      id: 2,
      userId: "33893449",
      question:
        "Mahoday, Saviiney nivedan hai ki mein [Aapka Naam], aapki sanstha mein [Aapka Pad/Post] ke roop mein karyarat hoon. Mujhe kuch niji aur mahatvapurn parivarik kaaryon ki wajah se agle kuch din tak sahar se bahar rehna padega. Is karanvash, main dinank [Shuru hone ki tareekh] se [Khatam hone ki tareekh] tak (kul 15 din) karyalaya mein upasthit nahi ho paunga/paungi. Mera aapse vinamra nivedan hai ki kripa mujhe in 15 din ke aavkash (leave) pradan karne ki kripa karen. Mere anupasthiti ke dauran, main koshish karunga/karungi ki mere zimmewari wale kaam samay par poore ho jayein ya kisi sahayak ko handover kar diye jayein. Aapki ati kripa hogi.",
      answer: "",
      date: "21-Mar-2026",
    },
    {
      id: 3,
      userId: "37270974",
      question: "hello sir",
      answer: "",
      date: "19-Mar-2026",
    },
    {
      id: 4,
      userId: "33893449",
      question: "पेट डिप्रेशन सर",
      answer: "",
      date: "15-Mar-2026",
    },
  ],
  answered: [
    {
      id: 1,
      userId: "33893449",
      question: "Hello! You have done a great job by launching this website.",
      answer: "Hello! It felt wonderful that you remembered us.",
      date: "29-May-2026",
    },
    {
      id: 2,
      userId: "33893449",
      question:
        "Mahoday, Saviiney nivedan hai ki mein [Aapka Naam], aapki sanstha mein [Aapka Pad/Post] ke roop mein karyarat hoon. Mujhe kuch niji aur mahatvapurn parivarik kaaryon ki wajah se agle kuch din tak sahar se bahar rehna padega. Is karanvash, main dinank [Shuru hone ki tareekh] se [Khatam hone ki tareekh] tak (kul 15 din) karyalaya mein upasthit nahi ho paunga/paungi. Mera aapse vinamra nivedan hai ki kripa mujhe in 15 din ke aavkash (leave) pradan karne ki kripa karen. Mere anupasthiti ke dauran, main koshish karunga/karungi ki mere zimmewari wale kaam samay par poore ho jayein ya kisi sahayak ko handover kar diye jayein. Aapki ati kripa hogi.",
      answer: "PERMISSION GUARANTEED",
      date: "21-Mar-2026",
    },
    {
      id: 3,
      userId: "37270974",
      question: "hello sir",
      answer: "Hello! It felt wonderful that you remembered us.",
      date: "19-Mar-2026",
    },
    {
      id: 4,
      userId: "33893449",
      question: "पेट स्प्रिंग सर",
      answer: "पेट दर्द नहीं",
      date: "15-Mar-2026",
    },
  ],
};

export default function SupportTickets() {
  const location = useLocation();
  const status = location.pathname.includes("/answered")
    ? "answered"
    : "non-answered";
  const rows = tickets[status] || tickets["non-answered"];

  return (
    <div className="users-page support-page">
      {/* ============ Header ============ */}
      <div className="users-header">
        <h2>Support Ticket Report</h2>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
          {rows.length} tickets
        </span>
      </div>

      {/* ============ Tabs ============ */}
      <div className="support-tabs">
        <NavLink
          to="/admin/support/non-answered"
          className={`support-tab ${status === "non-answered" ? "active" : ""}`}
        >
          Non Answered Ticket
          <span className="tab-count">{tickets["non-answered"].length}</span>
        </NavLink>
        <NavLink
          to="/admin/support/answered"
          className={`support-tab ${status === "answered" ? "active" : ""}`}
        >
          Answered Ticket
          <span className="tab-count">{tickets["answered"].length}</span>
        </NavLink>
      </div>

      {/* ============ Table ============ */}
      <div className="table-wrap">
        <table className="users-table support-table">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>Sr. No</th>
              <th style={{ width: "120px" }}>UserId</th>
              <th>Question</th>
              <th style={{ width: "260px" }}>Answer</th>
              <th style={{ width: "120px" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((ticket, index) => (
              <tr key={`${status}-${ticket.id}`}>
                <td
                  style={{
                    textAlign: "center",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  {index + 1}
                </td>
                <td
                  style={{
                    color: "var(--gold)",
                    fontWeight: 600,
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  {ticket.userId}
                </td>
                <td style={{ lineHeight: 1.7 }}>{ticket.question}</td>
                <td style={{ lineHeight: 1.7 }}>
                  {ticket.answer ? (
                    <span style={{ color: "#4ade80" }}>{ticket.answer}</span>
                  ) : (
                    <span
                      style={{
                        color: "rgba(255,255,255,0.3)",
                        fontStyle: "italic",
                        fontSize: "12px",
                      }}
                    >
                      — Not answered yet —
                    </span>
                  )}
                </td>
                <td
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    whiteSpace: "nowrap",
                    fontSize: "12.5px",
                  }}
                >
                  {ticket.date}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-row">
                  No tickets found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
