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
        "Mahoday, Saviiney nivedan hai ki mein [Aakpa Naam], aapki sanstha mein [Aakpa Pad/Post] ke roop mein karyarat hoon. Mujhe kuch niij aur mahatvapurn parivarik kaaryon ki wajah se agle kuch din tok sahar se bahar rehna padega. Is karanvash, main dinank [Shuru hone ki tareekh] se [Khatam hone ki tareekh] tak (kul 15 din) karyalaya mein upasthit nahi ho paunga/paungi. Mera aapse vinamra nivedan hai ki kripa muje in 15 din ke aavkash (leave) pradan karne ki kripa karen. Mere anuprastit ki dauran, main koshik karunga/karungi ki mere zimmewari wale kaam samay par poore ho jayein ya kisi sahayak ko handover kar diye jayein. Aapki ati kripa hogi.",
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
        "Mahoday, Saviiney nivedan hai ki mein [Aakpa Naam], aapki sanstha mein [Aakpa Pad/Post] ke roop mein karyarat hoon. Mujhe kuch niij aur mahatvapurn parivarik kaaryon ki wajah se agle kuch din tok sahar se bahar rehna padega. Is karanvash, main dinank [Shuru hone ki tareekh] se [Khatam hone ki tareekh] tak (kul 15 din) karyalaya mein upasthit nahi ho paunga/paungi. Mera aapse vinamra nivedan hai ki kripa muje in 15 din ke aavkash (leave) pradan karne ki kripa karen. Mere anuprastit ki dauran, main koshik karunga/karungi ki mere zimmewari wale kaam samay par poore ho jayein ya kisi sahayak ko handover kar diye jayein. Aapki ati kripa hogi.",
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
  const status = location.pathname.includes("/answered") ? "answered" : "non-answered";
  const rows = tickets[status] || tickets["non-answered"];

  return (
    <div className="support-page">
      <div className="support-header-row">
        <h1>Support Ticket Report</h1>
      </div>

      <div className="support-status-switcher" aria-label="Support ticket filters">
        <NavLink
          to="/admin/support/non-answered"
          className={({ isActive }) =>
            `support-status-tab ${isActive || status === "non-answered" ? "active" : ""}`
          }
        >
          Non Answered Ticket
        </NavLink>
        <NavLink
          to="/admin/support/answered"
          className={({ isActive }) =>
            `support-status-tab ${isActive || status === "answered" ? "active" : ""}`
          }
        >
          Answered Ticket
        </NavLink>
      </div>

      <div className="support-table-wrap">
        <table className="support-table">
          <thead>
            <tr>
              <th>Sr. No</th>
              <th>UserId</th>
              <th>Question</th>
              <th>Answer</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((ticket, index) => (
              <tr key={`${status}-${ticket.id}`}>
                <td>{index + 1}</td>
                <td>{ticket.userId}</td>
                <td>{ticket.question}</td>
                <td>{ticket.answer || "—"}</td>
                <td>{ticket.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
