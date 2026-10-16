import { useState, useEffect, useCallback } from "react";
import {
  createUserFeedback,
  deleteFeedback,
  deleteMyFeedback,
  getAllFeedback,
  getMyFeedback,
  updateFeedbackAdmin,
  updateMyFeedback,
} from "../utils/api";

// =========================================================
//              QUESTION BANK (all sections)
// =========================================================

const CURRICULUM = [
  [
    "C01",
    "क्या प्रशिक्षण के उद्देश्य प्रारंभ में स्पष्ट किए गए?",
    "Were the training objectives clearly explained at the beginning?",
  ],
  [
    "C02",
    "क्या पाठ्यक्रम निर्धारित कार्यक्रम के अनुरूप था?",
    "Was the course aligned with the prescribed training programme?",
  ],
  [
    "C03",
    "क्या विषय-वस्तु उपयोगी, प्रासंगिक और अद्यतन थी?",
    "Was the content useful, relevant and up to date?",
  ],
  [
    "C04",
    "क्या अध्ययन सामग्री समय पर उपलब्ध कराई गई?",
    "Was study material provided on time?",
  ],
  [
    "C05",
    "क्या विषयों का क्रम समझने में सरल था?",
    "Was the sequence of topics easy to follow?",
  ],
  [
    "C06",
    "क्या सिद्धांत और व्यावहारिक प्रशिक्षण में उचित संतुलन था?",
    "Was there a suitable balance between theory and practical training?",
  ],
  [
    "C07",
    "क्या पर्याप्त उदाहरण, केस स्टडी और अभ्यास दिए गए?",
    "Were adequate examples, case studies and exercises provided?",
  ],
  [
    "C08",
    "क्या निर्धारित समय में पाठ्यक्रम पूरा किया गया?",
    "Was the course completed within the scheduled time?",
  ],
  [
    "C09",
    "क्या सीखने के निर्धारित उद्देश्य प्राप्त हुए?",
    "Were the learning objectives achieved?",
  ],
  [
    "C10",
    "क्या टेस्ट/मूल्यांकन से सीखने का सही आकलन हुआ?",
    "Did tests/assessment properly evaluate learning?",
  ],
];

const INSTRUCTOR = [
  [
    "F01",
    "विषय पर प्रशिक्षक का ज्ञान एवं विशेषज्ञता",
    "Instructor's subject knowledge and expertise",
  ],
  ["F02", "विषय समझाने की स्पष्टता", "Clarity of explanation"],
  [
    "F03",
    "हिंदी/अंग्रेजी भाषा का उपयुक्त प्रयोग",
    "Appropriate use of Hindi/English",
  ],
  [
    "F04",
    "उदाहरण, प्रदर्शन एवं व्यावहारिक विधियों का उपयोग",
    "Use of examples, demonstrations and practical methods",
  ],
  [
    "F05",
    "प्रश्न पूछने एवं शंकाओं के समाधान का अवसर",
    "Opportunity to ask questions and resolve doubts",
  ],
  [
    "F06",
    "प्रशिक्षु सहभागिता को प्रोत्साहन",
    "Encouragement of trainee participation",
  ],
  ["F07", "समयपालन एवं कक्षा प्रबंधन", "Punctuality and classroom management"],
  [
    "F08",
    "सम्मानजनक, निष्पक्ष एवं उचित व्यवहार",
    "Respectful, fair and appropriate conduct",
  ],
  [
    "F09",
    "प्रशिक्षु की समझ का समय-समय पर आकलन",
    "Periodic assessment of trainee understanding",
  ],
  [
    "F10",
    "प्रशिक्षक की समग्र प्रभावशीलता",
    "Overall effectiveness of the instructor",
  ],
];

const METHODOLOGY_OPTIONS = [
  "Lecture",
  "Demonstration",
  "Hands-on Exercise",
  "Case Study",
  "Role Play",
  "Simulation",
  "Field Visit",
  "Group Discussion",
  "Q&A",
  "Video/Digital Material",
  "Mock Drill",
  "Other",
];

const METHODOLOGY = [
  [
    "TM01",
    "व्याख्यान पद्धति कितनी प्रभावी रही?",
    "How effective was the lecture method?",
  ],
  [
    "TM02",
    "क्या प्रदर्शन (Demonstration) से विषय समझने में मदद मिली?",
    "Did demonstrations help you understand the subject?",
  ],
  [
    "TM03",
    "क्या व्यावहारिक अभ्यास पर्याप्त था?",
    "Was hands-on practice adequate?",
  ],
  [
    "TM04",
    "क्या केस स्टडी वास्तविक परिस्थितियों से संबंधित थीं?",
    "Were case studies relevant to real situations?",
  ],
  [
    "TM05",
    "क्या रोल प्ले / समूह चर्चा उपयोगी रही?",
    "Were role play/group discussions useful?",
  ],
  [
    "TM06",
    "क्या सिमुलेशन / मॉक ड्रिल ने कौशल संवर्धन किया?",
    "Did simulations/mock drills improve skills?",
  ],
  [
    "TM07",
    "क्या फील्ड विजिट / स्थल निरीक्षण उपयोगी रहा?",
    "Was the field visit/site exposure useful?",
  ],
  [
    "TM08",
    "क्या वीडियो / डिजिटल सामग्री उपयोगी रही?",
    "Was video/digital content useful?",
  ],
  [
    "TM09",
    "क्या प्रत्येक प्रशिक्षु को स्वयं अभ्यास करने का अवसर मिला?",
    "Did each trainee get an opportunity to practise?",
  ],
];

const CLASSROOM = [
  ["101", "कक्षा की साफ-सफाई एवं स्वच्छता", "Classroom cleanliness"],
  ["102", "बैठने की व्यवस्था एवं फर्नीचर", "Seating arrangement and furniture"],
  [
    "103",
    "प्रकाश, पंख/कूलर/AC एवं वैटिलेशन",
    "Lighting, fans/coolers/AC and ventilation",
  ],
  [
    "104",
    "क्वाइटबोर्ड, डिजिटल पोडियम, प्रोजेक्टर / इंटरैक्टिव पैनल",
    "Whiteboard, digital podium, projector/interactive panel",
  ],
  [
    "105",
    "ऑडियो सिस्टम एवं माइक्रोफोन की गुणवत्ता",
    "Audio system and microphone quality",
  ],
  [
    "106",
    "कंप्यूटर लैब एवं इंटरनेट की उपलब्धता",
    "Availability of computer lab and internet",
  ],
  [
    "107",
    "प्रैक्टिकल उपकरण / डेमो सामग्री की उपलब्धता",
    "Availability of practical equipment/demo material",
  ],
  [
    "108",
    "कक्षा का वातावरण एवं ध्यान केंद्रित करने की सुविधा",
    "Learning environment and ability to concentrate",
  ],
  [
    "109",
    "प्रशिक्षण कार्यक्रम एवं समय-सारणी का पालन",
    "Adherence to training schedule",
  ],
  [
    "110",
    "प्रशिक्षण स्थलों तक सुगम पहुँच एवं संकेतक",
    "Access to training locations and signage",
  ],
];

const BARRACK = [
  [
    "B01",
    "आवास की पर्याप्तता एवं कमरे में उपलब्ध स्थान",
    "Adequacy of accommodation and room space",
  ],
  [
    "B02",
    "बिस्तर, गद्दे एवं आवश्यक सुविधाएँ",
    "Beds, mattresses and essential facilities",
  ],
  ["B03", "बैरक की सफाई एवं रख-रखाव", "Barrack cleanliness and maintenance"],
  ["B04", "बाधकम एवं शौचालयों की स्थिति", "Condition of bathrooms and toilets"],
  ["B05", "पानी की पर्याप्त उपलब्धता", "Availability of water"],
  [
    "B06",
    "बिजली, प्रकाश एवं पंखे / कूलर की सुविधा",
    "Electricity, lighting and fans/coolers",
  ],
  [
    "B07",
    "नालियों एवं अपशिष्ट जल निकासी की व्यवस्था",
    "Drainage and wastewater disposal",
  ],
  [
    "B08",
    "मच्छर/कीट नियंत्रण एवं स्वच्छ वातावरण",
    "Mosquito/pest control and hygienic environment",
  ],
  [
    "B09",
    "रात्रि कालीन सुरक्षा एवं सहायता",
    "Night-time security and assistance",
  ],
  [
    "B10",
    "मरम्मत / शिकायतों पर त्वरित कार्यवाई",
    "Action on maintenance requests/complaints",
  ],
];

const FOOD = [
  ["M01", "भोजन की गुणवत्ता एवं स्वाद", "Food quality and taste"],
  ["M02", "भोजन की पौष्टिकता एवं विविधता", "Nutritional value and variety"],
  [
    "M03",
    "निर्धारित समय पर भोजन की उपलब्धता",
    "Availability of meals at scheduled times",
  ],
  [
    "M04",
    "पीने के पानी (RO) की गुणवत्ता एवं उपलब्धता",
    "Quality and availability of drinking water",
  ],
  [
    "M05",
    "मेस, रसोई एवं बर्तनों की स्वच्छता",
    "Cleanliness of mess, kitchen and utensils",
  ],
  ["M06", "भोजन परोसने की व्यवस्था", "Food serving arrangements"],
  ["M07", "भोजन की मात्रा एवं पर्याप्तता", "Quantity and adequacy of food"],
  [
    "M08",
    "भोजन संबंधी शिकायतों पर त्वरित कार्यवाई",
    "Action on food-related complaints",
  ],
];

const HYGIENE = [
  [
    "H01",
    "महिला / पुरुष शौचालयों की उपलब्धता एवं स्थिति",
    "Availability and condition of women's/men's toilets",
  ],
  [
    "H02",
    "स्नानघर, पानी एवं निजता (Privacy) की व्यवस्था",
    "Bathing facilities, water and privacy",
  ],
  [
    "H03",
    "कूड़ा निस्तारण एवं परिसर की स्वच्छता",
    "Waste disposal and campus cleanliness",
  ],
  [
    "H04",
    "प्राथमिक उपचार एवं चिकित्सा सहायता",
    "First aid and medical assistance",
  ],
  [
    "H05",
    "बीमारी / आपात स्थिति में लरित सहायता",
    "Assistance during illness/emergency",
  ],
  [
    "H06",
    "खेल मैदान, पीटी (PT) ग्राउंड एवं जिम सुविधाएँ",
    "Sports ground, PT ground and gym facilities",
  ],
  ["H07", "पुस्तकालय एवं पठन सामग्री", "Library and study materials"],
  [
    "H08",
    "कपड़े धोने / सुखाने की सुविधा (जहाँ लागू हो)",
    "Laundry/drying facilities, where applicable",
  ],
  [
    "H09",
    "विश्वाम एवं आपातकालीन सहायता व्यवस्था",
    "Rest and emergency support arrangements",
  ],
];

const ONLINE = [
  [
    "001",
    "लॉगिन / रजिस्ट्रेशन की प्रक्रिया सरल थी?",
    "Was login/registration easy?",
  ],
  [
    "002",
    "ऑनलाइन प्लेटफॉर्म तक पहुँच आसान थी?",
    "Was the online platform easy to access?",
  ],
  [
    "003",
    "आँडियो और वीडियो की गुणवत्ता कैसी थी?",
    "How was audio and video quality?",
  ],
  [
    "004",
    "प्रशिक्षक की आवाज एवं स्क्रीन सामग्री स्पष्ट थी?",
    "Were the instructor's voice and on-screen content clear?",
  ],
  [
    "005",
    "स्क्रीन शेयरिंग / प्रेजेंटेशन उपयोगी रहे?",
    "Were screen sharing and presentations useful?",
  ],
  [
    "006",
    "इंटरनेट / कनेक्टिविटी की समस्या कितनी बार हुई?",
    "How often did internet/connectivity issues occur?",
  ],
  [
    "007",
    "चैट, पोल और प्रश्नोत्तर (Q&A) सुविधाएँ उपयोगी थी?",
    "Were chat, polls and Q&A features useful?",
  ],
  [
    "008",
    "रिकॉर्डिंग / ई-लर्निंग सामग्री उपलब्ध कराई गई?",
    "Were recordings/learning materials available?",
  ],
  [
    "009",
    "ऑनलाइन टेस्ट / असाइनमेंट की प्रक्रिया सरल थी?",
    "Was the online test/assignment process easy?",
  ],
  [
    "010",
    "तकनीकी समस्या आने पर तुरंत सहायता मिली?",
    "Was technical support available when needed?",
  ],
  [
    "011",
    "ऑनलाइन माध्यम से विषय को समझना आसान था?",
    "Was the subject easy to understand online?",
  ],
  [
    "012",
    "क्या आप इस विषय के लिए ऑनलाइन प्रशिक्षण की सिफारिश करेंगे?",
    "Would you recommend online training for this subject?",
  ],
];

const PHYSICAL = [
  [
    "P01",
    "क्या अभ्यास प्रारंभ होने से पहले सुरक्षा ब्रीफिंग दी गई?",
    "Was a safety briefing given before practice?",
  ],
  [
    "P02",
    "क्या प्रशिक्षक का डिमॉन्स्ट्रेशन स्पष्ट था?",
    "Was the instructor's demonstration clear?",
  ],
  [
    "P03",
    "क्या आवश्यक उपकरण एवं प्रशिक्षण सामग्री उपलब्ध थी?",
    "Were required equipment and training materials available?",
  ],
  [
    "P04",
    "क्या प्रत्येक प्रशिक्षु को पर्याप्त अभ्यास का अवसर मिला?",
    "Did each trainee receive adequate practice?",
  ],
  [
    "P05",
    "क्या अभ्यास निर्धारित कार्यक्रम के अनुसार संचालित हुआ?",
    "Was practice conducted as scheduled?",
  ],
  [
    "P06",
    "क्या निगरानी एवं सुरक्षा व्यवस्था पुख्ता और पर्याप्त थी?",
    "Were supervision and safety arrangements adequate?",
  ],
  [
    "P07",
    "क्या गलतियों को समझाकर सुधार कराया गया?",
    "Were mistakes explained and corrected?",
  ],
  [
    "P08",
    "क्या अभ्यास से आत्मविश्वास एवं कौशल में वृद्धि हुई?",
    "Did practice improve confidence/skills?",
  ],
  [
    "P09",
    "क्या मौसम, मैदान एवं प्रशिक्षण स्थल उपयुक्त थे?",
    "Were weather, ground and training site suitable?",
  ],
  [
    "P10",
    "क्या कोई असुरक्षित स्थिति, चोट या उपकरण की कमी महसूस हुई?",
    "Was there any unsafe situation, injury or equipment shortage?",
  ],
];

const WOMEN = [
  [
    "W01",
    "क्या सुरक्षित एवं उपयुक्त आवास उपलब्ध है?",
    "Is safe and suitable accommodation available?",
  ],
  [
    "W02",
    "क्या बैरक, स्नानघर और शौचालयों में पर्याप्त निजता है?",
    "Is adequate privacy available in barracks, bathrooms and toilets?",
  ],
  [
    "W03",
    "क्या दरवाजे, पदे, लॉक एवं प्रकाश व्यवस्था दुरुस्त है?",
    "Are doors, curtains, locks and lighting adequate?",
  ],
  [
    "W04",
    "क्या आवश्यकता पड़ने पर महिला प्रशिक्षक / स्टाफ तक पहुँच संभव है?",
    "Can female instructors/staff be contacted when needed?",
  ],
  [
    "W05",
    "क्या महिला वार्डन / संबंधित अधिकारी से संपर्क सुगम है?",
    "Is it easy to contact the female warden/concerned officer?",
  ],
  [
    "W06",
    "क्या स्वास्थ्य, स्वच्छता एवं व्यक्तिगत आवश्यकताओं हेतु उचित सुविधाएँ हैं?",
    "Are health, hygiene and personal-needs facilities adequate?",
  ],
  [
    "W07",
    "क्या सुरक्षित एवं गोपनीय शिकायत निवारण माध्यम उपलब्ध है?",
    "Is a safe and confidential complaint channel available?",
  ],
  [
    "W08",
    "क्या सुरक्षा / अनुचित व्यवहार की स्थिति में सहायता प्रक्रियाओं की जानकारी है?",
    "Are support procedures known for safety/inappropriate conduct concerns?",
  ],
  [
    "W09",
    "क्या गरिमा, निष्पक्षता एवं समान अवसर प्राप्त होते हैं?",
    "Are respect, fairness and equal opportunities provided?",
  ],
  [
    "W10",
    "क्या आवास, स्वच्छता, सुरक्षा या प्रशिक्षण में सुधार की आवश्यकता है?",
    "Are improvements needed in accommodation, hygiene, safety or training?",
  ],
];

const DISCIPLINE = [
  [
    "A01",
    "क्या प्रशिक्षण समय-सारणी के अनुसार संचालित हुआ?",
    "Was training conducted according to schedule?",
  ],
  [
    "A02",
    "क्या उपस्थिति, अवकाश एवं प्रशिक्षण संबंधी नियम स्पष्ट थे?",
    "Were attendance, leave and training rules clear?",
  ],
  [
    "A03",
    "क्या प्रशिक्षुर्आं के साथ निष्पक्ष एवं सम्मानजनक व्यवहार किया गया?",
    "Were trainees treated fairly and respectfully?",
  ],
  [
    "A04",
    "क्या संबंधित अधिकारी / शाखा की जानकारी सुलभ थी?",
    "Was information about the concerned officer/branch available?",
  ],
  [
    "A05",
    "क्या शिकायत / सुझाव प्रस्तुत करने की प्रक्रिया सरल थी?",
    "Was it easy to submit a complaint/suggestion?",
  ],
  [
    "A06",
    "क्या प्रस्तुत अनुरोधों / शिकायतों पर समय पर कार्रवाई हुई?",
    "Were requests/complaints addressed in time?",
  ],
  [
    "A07",
    "क्या चिकित्सा एवं आपातकालीन सहायता की व्यवस्था स्पष्ट थी?",
    "Were medical/emergency support arrangements clear?",
  ],
  [
    "A08",
    "क्या पर्याप्त विश्वाम एवं बुनियादी सुविधाएँ उपलब्ध कराई गई?",
    "Were adequate rest and essential facilities provided?",
  ],
  [
    "A09",
    "क्या भेदभाव / उत्पीड़न / अनुचित दबाव से सुरक्षा का पूर्ण भरोसा था?",
    "Was there confidence in protection from discrimination, harassment or undue pressure?",
  ],
  [
    "A10",
    "क्या समग्र प्रशासनिक सहयोग संतोषजनक रहा?",
    "Was overall administrative support satisfactory?",
  ],
];

const LEARNING = [
  [
    "L01",
    "प्रशिक्षण से विषय संबंधी ज्ञान में कितनी वृद्धि हुई?",
    "How much did subject knowledge improve?",
  ],
  [
    "L02",
    "क्या आप सीखी गई प्रक्रिया / कार्य को स्वतंत्र रूप से कर सकते हैं?",
    "Can you perform the learned task/process independently?",
  ],
  [
    "L03",
    "क्या समस्या समाधान की क्षमता में वृद्धि हुई?",
    "Did problem-solving ability improve?",
  ],
  [
    "L04",
    "क्या अर्जित ज्ञान वास्तविक ड्यूटी में उपयोगी सिद्ध होगा?",
    "Will the learning be useful in actual duty/work?",
  ],
  [
    "L05",
    "क्या प्रशिक्षण के उपरांत आत्मविश्वास में वृद्धि हुई?",
    "Did confidence improve after training?",
  ],
  [
    "L06",
    "क्या परीक्षा / प्रेक्षिकल मूल्यांकन पाठ्यक्रम के उद्देश्यों के अनुरूप था?",
    "Was test/practical assessment aligned with course objectives?",
  ],
  [
    "L07",
    "क्या कमजोरियों को दूर करने हेतु उचित मार्गदर्शन प्राप्त हुआ?",
    "Was guidance provided to improve weaknesses?",
  ],
];

// =========================================================
//              INITIAL FORM STATE
// =========================================================

const initialForm = {
  trainingCentre: "RPSF TC/2BN/GKP",
  courseMode: "",
  courseCategory: "",
  courseName: "",
  batch: "",
  fromDate: "",
  toDate: "",
  instructor: "",
  feedbackStage: "",
  courseStatus: "",
  language: "",
  traineeName: "",
  traineeId: "",
  railwayZone: "",
  curriculum: {},
  instructorRating: {},
  methodsSelected: [],
  methodology: {},
  classroom: {},
  barrack: {},
  food: {},
  hygiene: {},
  online: {},
  physical: {},
  women: {},
  discipline: {},
  learning: {},
  selfAssessment: {
    beforeTraining: "",
    afterTraining: "",
    skillImprovedMost: "",
    skillNeedsPractice: "",
  },
  overallCourseRating: "",
  mostUsefulAspect: "",
  areasRequiringImprovement: "",
  otherSuggestions: "",
  wouldRecommend: "",
  reportIssue: "",
  issueDetails: "",
  priority: "",
  adminCategory: "",
  adminPriority: "",
  assignedTo: "",
  actionTaken: "",
  adminStatus: "",
  resolutionRemarks: "",
  verifiedBy: "",
  reopened: "",
};

const FEEDBACK_RATING_SECTIONS = [
  { title: "Part 2 — Curriculum & Content", field: "curriculum", questions: CURRICULUM },
  { title: "Part 3 — Instructor / Faculty", field: "instructorRating", questions: INSTRUCTOR },
  { title: "Part 4 — Training Methodology", field: "methodology", questions: METHODOLOGY },
  { title: "Part 5 — Classroom & Digital Facilities", field: "classroom", questions: CLASSROOM },
  { title: "Part 6 — Barrack & Accommodation", field: "barrack", questions: BARRACK },
  { title: "Part 7 — Food & Mess", field: "food", questions: FOOD },
  { title: "Part 8 — Hygiene, Health & General Facilities", field: "hygiene", questions: HYGIENE },
  { title: "Part 9 — Online Training", field: "online", questions: ONLINE },
  { title: "Part 10 — Physical, Weapon & Security Training", field: "physical", questions: PHYSICAL },
  { title: "Part 11 — Women Trainees' Facilities & Dignity", field: "women", questions: WOMEN },
  { title: "Part 12 — Discipline, Welfare & Administrative Support", field: "discipline", questions: DISCIPLINE },
  { title: "Part 13 — Learning Outcomes", field: "learning", questions: LEARNING },
];

function formFromFeedback(feedback) {
  const form = Object.fromEntries(
    Object.keys(initialForm).map((key) => [
      key,
      feedback[key] ?? initialForm[key],
    ]),
  );
  form.selfAssessment = {
    ...initialForm.selfAssessment,
    ...feedback.selfAssessment,
  };
  return form;
}

const RATING_OPTIONS = ["1", "2", "3", "4", "5", "N/A"];

// =========================================================
//              RATING ROW COMPONENT
// =========================================================

function RatingRow({ code, hindi, english, value, onChange }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "60px 1fr auto",
        gap: "12px",
        alignItems: "center",
        padding: "12px 14px",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          color: "var(--navy)",
          fontSize: "13px",
          fontFamily: "'Rajdhani', sans-serif",
        }}
      >
        {code}
      </div>
      <div>
        <div
          style={{ fontSize: "13px", color: "var(--ink)", marginBottom: "2px" }}
        >
          {hindi}
        </div>
        <div
          style={{
            fontSize: "11.5px",
            color: "var(--muted)",
            fontStyle: "italic",
          }}
        >
          {english}
        </div>
      </div>
      <div style={{ display: "flex", gap: "4px", flexWrap: "nowrap" }}>
        {RATING_OPTIONS.map((opt) => {
          const active = value === opt;
          const isNA = opt === "N/A";
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              style={{
                minWidth: isNA ? "42px" : "30px",
                padding: "5px 8px",
                borderRadius: "6px",
                border: `1px solid ${active ? (isNA ? "#94a3b8" : "#C2410C") : "var(--line)"}`,
                background: active ? (isNA ? "#f1f5f9" : "#FFF7ED") : "#FFFFFF",
                color: active ? (isNA ? "#475569" : "#C2410C") : "var(--ink)",
                fontSize: isNA ? "11px" : "13px",
                fontWeight: active ? 700 : 500,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// =========================================================
//              SECTION COMPONENT
// =========================================================

function RatingSection({ title, hindi, english, questions, values, onChange }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid var(--line)",
        borderRadius: "10px",
        marginBottom: "20px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 18px",
          background: "linear-gradient(90deg, #0f2350 0%, #1e3a8a 100%)",
          color: "white",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "15px",
            fontFamily: "'Rajdhani', sans-serif",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          {title}
        </h3>
        <p style={{ margin: "2px 0 0", fontSize: "11px", opacity: 0.85 }}>
          {hindi} / {english}
        </p>
      </div>
      <div>
        {questions.map(([code, hi, en]) => (
          <RatingRow
            key={code}
            code={code}
            hindi={hi}
            english={en}
            value={values[code] || ""}
            onChange={(v) => onChange(code, v)}
          />
        ))}
      </div>
    </div>
  );
}

// =========================================================
//              MAIN COMPONENT
// =========================================================

export default function AdminFeedback({ userMode = false }) {
  const isAdmin = !userMode;
  const [form, setForm] = useState(initialForm);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = userMode ? await getMyFeedback() : await getAllFeedback();
      setFeedbacks(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }, [userMode]);

  useEffect(() => {
    load();
  }, [load]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleRating = (section, code, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [code]: value },
    }));
  };

  const handleSelfAssess = (field, value) => {
    setForm((prev) => ({
      ...prev,
      selfAssessment: { ...prev.selfAssessment, [field]: value },
    }));
  };

  const handleMethodToggle = (method) => {
    setForm((prev) => ({
      ...prev,
      methodsSelected: prev.methodsSelected.includes(method)
        ? prev.methodsSelected.filter((m) => m !== method)
        : [...prev.methodsSelected, method],
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setMessage("");
    setShowAdmin(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.courseName.trim()) {
      setMessage("Course name is required");
      return;
    }
    try {
      setSaving(true);
      setMessage("");
      if (editingId) {
        if (userMode) {
          await updateMyFeedback(editingId, form);
        } else {
          await updateFeedbackAdmin(editingId, form);
        }
        setMessage("Feedback updated successfully");
      } else {
        await createUserFeedback(form);
      }
      resetForm();
      setShowForm(false);
      await load();
      setMessage(
        editingId ? "Feedback updated successfully" : "Feedback submitted successfully",
      );
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feedback submission?")) return;
    try {
      if (userMode) {
        await deleteMyFeedback(id);
      } else {
        await deleteFeedback(id);
      }
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (feedback) => {
    setForm(formFromFeedback(feedback));
    setEditingId(feedback._id);
    setShowForm(true);
    setShowAdmin(isAdmin);
    setMessage("");
    setPreviewData(null);
  };

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    background: "#FFFFFF",
    border: "1px solid var(--line)",
    borderRadius: "6px",
    color: "var(--ink)",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle = {
    color: "var(--navy)",
    fontSize: "12px",
    fontWeight: 600,
    marginBottom: "6px",
    display: "block",
    letterSpacing: "0.5px",
  };
  const grid3 = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  };

  return (
    <section className="education-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Training Feedback</p>
          <h2>
            {isAdmin ? "Feedback Responses" : "Master Training Feedback Proforma"}
          </h2>
          <p>
            RPSF Training Centre, Gorakhpur (TC/2BN/GKP) — Online, On-Campus,
            Hybrid, Guest Lecture, Practical &amp; Specialised Training
          </p>
        </div>
        {!isAdmin && (
          <button
            type="button"
            className="primary"
            onClick={() => {
              if (showForm) {
                resetForm();
                setShowForm(false);
              } else {
                setShowForm(true);
              }
            }}
            style={{ padding: "10px 24px" }}
          >
            {showForm ? "Close Form" : "New Feedback"}
          </button>
        )}
      </div>

      {message && (
        <p
          style={{
            padding: "12px",
            background: message.toLowerCase().includes("success")
              ? "#f0f8f1"
              : "#FEF2F2",
            border: `1px solid ${message.toLowerCase().includes("success") ? "#a7ddb2" : "#FECACA"}`,
            color: message.toLowerCase().includes("success")
              ? "#15803D"
              : "#B91C1C",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          {message}
        </p>
      )}

      {/* ==================== FORM ==================== */}
      {showForm && (!isAdmin || editingId) && (
        <form
          onSubmit={handleSubmit}
          className="education-panel"
          style={{ padding: "20px", marginBottom: "24px" }}
        >
          <h3 style={{ margin: "0 0 16px", color: "var(--navy)" }}>
            {editingId ? "Edit Feedback" : "Submit Training Feedback"}
          </h3>
          {/* Rating Scale Reference */}
          <div
            style={{
              padding: "12px 16px",
              background: "#F8F7F4",
              border: "1px solid var(--line)",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "12px",
            }}
          >
            <strong style={{ color: "var(--navy)" }}>Rating Scale:</strong>{" "}
            1=Poor, 2=Needs Improvement, 3=Satisfactory, 4=Good, 5=Excellent,
            N/A=Not Applicable. (N/A excluded from average)
          </div>

          {/* ============ PART 1 ============ */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid var(--line)",
              borderRadius: "10px",
              marginBottom: "20px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "14px 18px",
                background: "linear-gradient(90deg, #0f2350 0%, #1e3a8a 100%)",
                color: "white",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "15px",
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Part 1 — Training &amp; Trainee Details
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: "11px", opacity: 0.85 }}>
                प्रशिक्षण एवं प्रशिक्षु की जानकारी
              </p>
            </div>
            <div style={{ padding: "18px" }}>
              <div style={grid3}>
                <div>
                  <label style={labelStyle}>Training Centre</label>
                  <input
                    name="trainingCentre"
                    value={form.trainingCentre}
                    onChange={handleChange}
                    style={inputStyle}
                    readOnly
                  />
                </div>
                <div>
                  <label style={labelStyle}>Course Mode</label>
                  <select
                    name="courseMode"
                    value={form.courseMode}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="">-- Select --</option>
                    <option>On-Campus</option>
                    <option>Online</option>
                    <option>Hybrid</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Course Category</label>
                  <select
                    name="courseCategory"
                    value={form.courseCategory}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="">-- Select --</option>
                    <option>Initial Training</option>
                    <option>Refresher</option>
                    <option>IT &amp; Digital</option>
                    <option>Weapon/Physical</option>
                    <option>Guest Lecture</option>
                    <option>Workshop/Seminar</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Course / Subject Name</label>
                  <input
                    name="courseName"
                    value={form.courseName}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Batch / Course ID</label>
                  <input
                    name="batch"
                    value={form.batch}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>From</label>
                  <input
                    type="date"
                    name="fromDate"
                    value={form.fromDate}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>To</label>
                  <input
                    type="date"
                    name="toDate"
                    value={form.toDate}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Instructor / Guest Speaker</label>
                  <input
                    name="instructor"
                    value={form.instructor}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Feedback Stage</label>
                  <select
                    name="feedbackStage"
                    value={form.feedbackStage}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="">-- Select --</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>After Module</option>
                    <option>End of Course</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Course Status</label>
                  <select
                    name="courseStatus"
                    value={form.courseStatus}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="">-- Select --</option>
                    <option>Completed</option>
                    <option>In Progress</option>
                    <option>Discontinued</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Language</label>
                  <select
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="">-- Select --</option>
                    <option>Hindi</option>
                    <option>English</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Trainee Name (optional)</label>
                  <input
                    name="traineeName"
                    value={form.traineeName}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="For confidential feedback — leave blank"
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    Trainee ID / HRMS ID (optional)
                  </label>
                  <input
                    name="traineeId"
                    value={form.traineeId}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    Railway Zone / Unit / Battalion / Coy / Post
                  </label>
                  <input
                    name="railwayZone"
                    value={form.railwayZone}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ============ PARTS 2-13 RATING SECTIONS ============ */}
          <RatingSection
            title="Part 2 — Curriculum & Training Material"
            hindi="पाठ्यक्रम एवं प्रशिक्षण सामग्री"
            english="Curriculum and training material"
            questions={CURRICULUM}
            values={form.curriculum}
            onChange={(code, v) => handleRating("curriculum", code, v)}
          />

          <RatingSection
            title="Part 3 — Instructor / Guest Speaker"
            hindi="प्रशिक्षक / अतिथि वक्ता"
            english="Instructor / Guest Speaker"
            questions={INSTRUCTOR}
            values={form.instructorRating}
            onChange={(code, v) => handleRating("instructorRating", code, v)}
          />

          {/* Part 4 - Methodology (with method selection) */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid var(--line)",
              borderRadius: "10px",
              marginBottom: "20px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "14px 18px",
                background: "linear-gradient(90deg, #0f2350 0%, #1e3a8a 100%)",
                color: "white",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "15px",
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Part 4 — Training Methodology
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: "11px", opacity: 0.85 }}>
                प्रशिक्षण पद्धति
              </p>
            </div>

            {/* Methods used */}
            <div
              style={{
                padding: "14px 18px",
                borderBottom: "1px solid var(--line)",
                background: "#FAFAF8",
              }}
            >
              <label style={labelStyle}>Select Methods Used</label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                {METHODOLOGY_OPTIONS.map((m) => {
                  const active = form.methodsSelected.includes(m);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleMethodToggle(m)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "20px",
                        border: `1px solid ${active ? "#C2410C" : "var(--line)"}`,
                        background: active ? "#FFF7ED" : "#FFFFFF",
                        color: active ? "#C2410C" : "var(--ink)",
                        fontSize: "12px",
                        fontWeight: active ? 700 : 500,
                        cursor: "pointer",
                      }}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>

            {METHODOLOGY.map(([code, hi, en]) => (
              <RatingRow
                key={code}
                code={code}
                hindi={hi}
                english={en}
                value={form.methodology[code] || ""}
                onChange={(v) => handleRating("methodology", code, v)}
              />
            ))}
          </div>

          <RatingSection
            title="Part 5 — Classroom & Digital Facilities"
            hindi="कक्षा एवं डिजिटल सुविधाएँ"
            english="Classroom and digital facilities"
            questions={CLASSROOM}
            values={form.classroom}
            onChange={(code, v) => handleRating("classroom", code, v)}
          />

          <RatingSection
            title="Part 6 — Barrack & Accommodation"
            hindi="बैरक एवं आवास"
            english="Barrack and accommodation"
            questions={BARRACK}
            values={form.barrack}
            onChange={(code, v) => handleRating("barrack", code, v)}
          />

          <RatingSection
            title="Part 7 — Food & Mess"
            hindi="भोजन एवं मेस"
            english="Food and mess"
            questions={FOOD}
            values={form.food}
            onChange={(code, v) => handleRating("food", code, v)}
          />

          <RatingSection
            title="Part 8 — Hygiene, Health & General Facilities"
            hindi="स्वच्छता, स्वास्थ्य एवं सामान्य सुविधाएँ"
            english="Hygiene, health and general facilities"
            questions={HYGIENE}
            values={form.hygiene}
            onChange={(code, v) => handleRating("hygiene", code, v)}
          />

          <RatingSection
            title="Part 9 — Online Training"
            hindi="ऑनलाइन प्रशिक्षण"
            english="Online training"
            questions={ONLINE}
            values={form.online}
            onChange={(code, v) => handleRating("online", code, v)}
          />

          <RatingSection
            title="Part 10 — Physical, Weapon & Security Training"
            hindi="शारीरिक, हथियार एवं सुरक्षा प्रशिक्षण"
            english="Physical, weapon and security training"
            questions={PHYSICAL}
            values={form.physical}
            onChange={(code, v) => handleRating("physical", code, v)}
          />

          <RatingSection
            title="Part 11 — Women Trainees' Facilities & Dignity"
            hindi="महिला प्रशिक्षुर्आं की सुविधाएँ एवं गरिमा"
            english="Women trainees' facilities and dignity"
            questions={WOMEN}
            values={form.women}
            onChange={(code, v) => handleRating("women", code, v)}
          />

          <RatingSection
            title="Part 12 — Discipline, Welfare & Administrative Support"
            hindi="अनुशासन, कल्याण एवं प्रशासनिक सहायता"
            english="Discipline, welfare and administrative support"
            questions={DISCIPLINE}
            values={form.discipline}
            onChange={(code, v) => handleRating("discipline", code, v)}
          />

          <RatingSection
            title="Part 13 — Learning Outcomes"
            hindi="सीखने के परिणाम"
            english="Learning outcomes"
            questions={LEARNING}
            values={form.learning}
            onChange={(code, v) => handleRating("learning", code, v)}
          />

          {/* Self-Assessment */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid var(--line)",
              borderRadius: "10px",
              marginBottom: "20px",
              padding: "18px",
            }}
          >
            <h4
              style={{
                color: "var(--navy)",
                margin: "0 0 14px",
                fontSize: "14px",
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Trainee Self-Assessment
            </h4>
            <div style={grid3}>
              <div>
                <label style={labelStyle}>Before Training (1-5)</label>
                <select
                  value={form.selfAssessment.beforeTraining}
                  onChange={(e) =>
                    handleSelfAssess("beforeTraining", e.target.value)
                  }
                  style={inputStyle}
                >
                  <option value="">-- Select --</option>
                  {["1", "2", "3", "4", "5"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>After Training (1-5)</label>
                <select
                  value={form.selfAssessment.afterTraining}
                  onChange={(e) =>
                    handleSelfAssess("afterTraining", e.target.value)
                  }
                  style={inputStyle}
                >
                  <option value="">-- Select --</option>
                  {["1", "2", "3", "4", "5"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Which skill improved most?</label>
                <input
                  value={form.selfAssessment.skillImprovedMost}
                  onChange={(e) =>
                    handleSelfAssess("skillImprovedMost", e.target.value)
                  }
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Which skill needs more practice?
                </label>
                <input
                  value={form.selfAssessment.skillNeedsPractice}
                  onChange={(e) =>
                    handleSelfAssess("skillNeedsPractice", e.target.value)
                  }
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* ============ PART 14 — OVERALL ============ */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid var(--line)",
              borderRadius: "10px",
              marginBottom: "20px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "14px 18px",
                background: "linear-gradient(90deg, #0f2350 0%, #1e3a8a 100%)",
                color: "white",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "15px",
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Part 14 — Overall Feedback &amp; Suggestions
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: "11px", opacity: 0.85 }}>
                समग्र फीडबैक एवं सुझाव
              </p>
            </div>
            <div style={{ padding: "18px" }}>
              <div style={grid3}>
                <div>
                  <label style={labelStyle}>Overall Course Rating (1-5)</label>
                  <select
                    name="overallCourseRating"
                    value={form.overallCourseRating}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="">-- Select --</option>
                    <option value="1">1 — Poor</option>
                    <option value="2">2 — Needs Improvement</option>
                    <option value="3">3 — Satisfactory</option>
                    <option value="4">4 — Good</option>
                    <option value="5">5 — Excellent</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>
                    Would you recommend this course?
                  </label>
                  <select
                    name="wouldRecommend"
                    value={form.wouldRecommend}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="">-- Select --</option>
                    <option>Yes</option>
                    <option>Partly</option>
                    <option>No</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Priority</label>
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="">-- Select --</option>
                    <option>Normal</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>
                    Do you wish to report an issue/complaint?
                  </label>
                  <select
                    name="reportIssue"
                    value={form.reportIssue}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="">-- Select --</option>
                    <option>No</option>
                    <option>Suggestion</option>
                    <option>Complaint</option>
                    <option>Safety Concern</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: "14px", display: "grid", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>
                    Most useful aspect of the training
                  </label>
                  <textarea
                    name="mostUsefulAspect"
                    value={form.mostUsefulAspect}
                    onChange={handleChange}
                    rows="2"
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Areas requiring improvement</label>
                  <textarea
                    name="areasRequiringImprovement"
                    value={form.areasRequiringImprovement}
                    onChange={handleChange}
                    rows="2"
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Other valuable suggestions</label>
                  <textarea
                    name="otherSuggestions"
                    value={form.otherSuggestions}
                    onChange={handleChange}
                    rows="2"
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    Issue / Complaint details (if applicable)
                  </label>
                  <textarea
                    name="issueDetails"
                    value={form.issueDetails}
                    onChange={handleChange}
                    rows="3"
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {isAdmin && (
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--line)",
                borderRadius: "10px",
                marginBottom: "20px",
                overflow: "hidden",
              }}
            >
            <button
              type="button"
              onClick={() => setShowAdmin(!showAdmin)}
              style={{
                width: "100%",
                padding: "14px 18px",
                background: "#F8F7F4",
                border: "none",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "14px",
                color: "var(--navy)",
                fontWeight: 700,
              }}
            >
              <span>
                Part 15 — Administrative Action (Authorised Officers Only)
              </span>
              <span>{showAdmin ? "−" : "+"}</span>
            </button>
            {showAdmin && (
              <div style={{ padding: "18px" }}>
                <div style={grid3}>
                  <div>
                    <label style={labelStyle}>Category</label>
                    <select
                      name="adminCategory"
                      value={form.adminCategory}
                      onChange={handleChange}
                      style={inputStyle}
                    >
                      <option value="">-- Select --</option>
                      <option>Faculty/Course</option>
                      <option>Facility</option>
                      <option>IT</option>
                      <option>Safety</option>
                      <option>Complaint</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Priority</label>
                    <select
                      name="adminPriority"
                      value={form.adminPriority}
                      onChange={handleChange}
                      style={inputStyle}
                    >
                      <option value="">-- Select --</option>
                      <option>Normal</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Assigned To</label>
                    <input
                      name="assignedTo"
                      value={form.assignedTo}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Status</label>
                    <select
                      name="adminStatus"
                      value={form.adminStatus}
                      onChange={handleChange}
                      style={inputStyle}
                    >
                      <option value="">-- Select --</option>
                      <option>New</option>
                      <option>Under Review</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                      <option>Closed</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Verified By</label>
                    <input
                      name="verifiedBy"
                      value={form.verifiedBy}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Reopened?</label>
                    <select
                      name="reopened"
                      value={form.reopened}
                      onChange={handleChange}
                      style={inputStyle}
                    >
                      <option value="">-- Select --</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                </div>
                <div
                  style={{ marginTop: "14px", display: "grid", gap: "12px" }}
                >
                  <div>
                    <label style={labelStyle}>Action Taken</label>
                    <textarea
                      name="actionTaken"
                      value={form.actionTaken}
                      onChange={handleChange}
                      rows="2"
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Resolution Remarks</label>
                    <textarea
                      name="resolutionRemarks"
                      value={form.resolutionRemarks}
                      onChange={handleChange}
                      rows="2"
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                  </div>
                </div>
              </div>
            )}
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              type="submit"
              className="primary"
              disabled={saving}
              style={{ padding: "10px 30px" }}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Save Changes"
                  : "Submit Feedback"}
            </button>
            <button
              type="button"
              className="table-action"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ==================== TABLE ==================== */}
      <div className="education-panel">
        <div className="panel-heading">
          <h3>
            {isAdmin ? "All Feedback Submissions" : "My Feedback Submissions"} (
            {feedbacks.length})
          </h3>
        </div>
        <div className="education-table-wrap">
          {loading ? (
            <p style={{ padding: "20px", color: "var(--gold)" }}>Loading...</p>
          ) : feedbacks.length === 0 ? (
            <p style={{ padding: "20px", color: "var(--muted)" }}>
              No feedback yet.
            </p>
          ) : (
            <table className="education-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Course</th>
                  <th>Batch</th>
                  <th>Mode</th>
                  <th>Category</th>
                  <th>Avg Rating</th>
                  <th>Submitted</th>
                  {isAdmin && <th>Review Status</th>}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((f, i) => (
                  <tr key={f._id}>
                    <td>{i + 1}</td>
                    <td style={{ color: "var(--navy)", fontWeight: 600 }}>
                      {f.courseName || "-"}
                    </td>
                    <td>{f.batch || "-"}</td>
                    <td>{f.courseMode || "-"}</td>
                    <td>{f.courseCategory || "-"}</td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          color:
                            f.averageRating >= 4
                              ? "#15803D"
                              : f.averageRating >= 3
                                ? "#B45309"
                                : "#B91C1C",
                        }}
                      >
                        {f.averageRating || 0}
                      </span>
                    </td>
                    <td>{formatDate(f.createdAt)}</td>
                    {isAdmin && (
                      <td>{f.adminReviewed ? "Reviewed" : "Pending review"}</td>
                    )}
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => setPreviewData(f)}
                      >
                        View
                      </button>{" "}
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => handleEdit(f)}
                      >
                        Edit
                      </button>{" "}
                      <button
                        type="button"
                        className="table-action danger"
                        onClick={() => handleDelete(f._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ==================== VIEW MODAL ==================== */}
      {previewData && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            zIndex: 1000,
            overflowY: "auto",
            padding: "40px 20px",
          }}
          onClick={() => setPreviewData(null)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              maxWidth: "800px",
              margin: "0 auto",
              padding: "28px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, color: "var(--navy)" }}>
              Feedback Details
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "13px" }}>
              Average Rating:{" "}
              <strong>{previewData.averageRating || 0} / 5</strong>
            </p>

            <h3 style={{ color: "var(--navy)", marginTop: "24px" }}>
              Part 1 — Training &amp; Trainee Details
            </h3>
            <div style={{ display: "grid", gap: "10px", fontSize: "13px" }}>
              {[
                ["Training Centre", previewData.trainingCentre],
                ["Course", previewData.courseName],
                ["Batch", previewData.batch],
                ["Mode", previewData.courseMode],
                ["Category", previewData.courseCategory],
                ["Instructor", previewData.instructor],
                ["From", previewData.fromDate],
                ["To", previewData.toDate],
                ["Feedback Stage", previewData.feedbackStage],
                ["Course Status", previewData.courseStatus],
                ["Language", previewData.language],
                ["Trainee", previewData.traineeName || "(Anonymous)"],
                ["Trainee ID", previewData.traineeId],
                ["Zone/Unit", previewData.railwayZone],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", gap: "12px" }}>
                  <span style={{ color: "var(--muted)", minWidth: "120px" }}>
                    {label}:
                  </span>
                  <span style={{ color: "var(--ink)" }}>{value || "-"}</span>
                </div>
              ))}
            </div>

            {FEEDBACK_RATING_SECTIONS.map(({ title, field, questions }) => (
              <section key={field}>
                <h3
                  style={{
                    color: "var(--navy)",
                    marginTop: "24px",
                    marginBottom: "10px",
                    fontSize: "15px",
                  }}
                >
                  {title}
                </h3>
                {field === "methodology" && (
                  <p style={{ fontSize: "13px" }}>
                    <strong>Methods used:</strong>{" "}
                    {previewData.methodsSelected?.join(", ") || "-"}
                  </p>
                )}
                <div style={{ display: "grid", gap: "8px", fontSize: "13px" }}>
                  {questions.map(([code, hindi, english]) => (
                    <div
                      key={code}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "55px 1fr auto",
                        gap: "10px",
                        borderBottom: "1px solid var(--line)",
                        paddingBottom: "8px",
                      }}
                    >
                      <strong>{code}</strong>
                      <span>
                        {hindi}
                        <br />
                        <span style={{ color: "var(--muted)" }}>{english}</span>
                      </span>
                      <strong>{previewData[field]?.[code] || "-"}</strong>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            <h3
              style={{
                color: "var(--navy)",
                marginTop: "24px",
                marginBottom: "10px",
                fontSize: "15px",
              }}
            >
              Part 13 — Trainee Self-Assessment
            </h3>
            <div style={{ display: "grid", gap: "8px", fontSize: "13px" }}>
              {[
                ["Before Training", previewData.selfAssessment?.beforeTraining],
                ["After Training", previewData.selfAssessment?.afterTraining],
                ["Skill improved most", previewData.selfAssessment?.skillImprovedMost],
                ["Skill needing more practice", previewData.selfAssessment?.skillNeedsPractice],
              ].map(([label, value]) => (
                <p key={label} style={{ margin: 0 }}>
                  <strong>{label}:</strong> {value || "-"}
                </p>
              ))}
            </div>

            <h3
              style={{
                color: "var(--navy)",
                marginTop: "24px",
                marginBottom: "10px",
                fontSize: "15px",
              }}
            >
              Part 14 — Overall Feedback &amp; Suggestions
            </h3>
            <div style={{ fontSize: "13px", display: "grid", gap: "6px" }}>
              <p>
                <strong>Overall Rating:</strong>{" "}
                {previewData.overallCourseRating || "-"}
              </p>
              <p>
                <strong>Would Recommend:</strong>{" "}
                {previewData.wouldRecommend || "-"}
              </p>
              <p>
                <strong>Most Useful Aspect:</strong>{" "}
                {previewData.mostUsefulAspect || "-"}
              </p>
              <p>
                <strong>Improvement Areas:</strong>{" "}
                {previewData.areasRequiringImprovement || "-"}
              </p>
              <p>
                <strong>Other Suggestions:</strong>{" "}
                {previewData.otherSuggestions || "-"}
              </p>
              <p>
                <strong>Issue/Complaint:</strong>{" "}
                {previewData.reportIssue || "-"}
              </p>
              <p>
                <strong>Details:</strong> {previewData.issueDetails || "-"}
              </p>
              <p>
                <strong>Priority:</strong> {previewData.priority || "-"}
              </p>
            </div>

            {isAdmin && (
              <>
                <h3
                  style={{
                    color: "var(--navy)",
                    marginTop: "24px",
                    marginBottom: "10px",
                    fontSize: "15px",
                  }}
                >
                  Part 15 — Administrative Action
                </h3>
                <div style={{ fontSize: "13px", display: "grid", gap: "6px" }}>
                  {[
                    ["Category", previewData.adminCategory],
                    ["Priority", previewData.adminPriority],
                    ["Assigned To", previewData.assignedTo],
                    ["Status", previewData.adminStatus],
                    ["Action Taken", previewData.actionTaken],
                    ["Resolution Remarks", previewData.resolutionRemarks],
                    ["Verified By", previewData.verifiedBy],
                    ["Reopened", previewData.reopened],
                    ["Reviewed By", previewData.adminReviewedBy],
                    [
                      "Reviewed At",
                      previewData.adminReviewedAt
                        ? formatDate(previewData.adminReviewedAt)
                        : "",
                    ],
                  ].map(([label, value]) => (
                    <p key={label} style={{ margin: 0 }}>
                      <strong>{label}:</strong> {value || "-"}
                    </p>
                  ))}
                </div>
              </>
            )}

            <button
              type="button"
              className="table-action"
              onClick={() => setPreviewData(null)}
              style={{ marginTop: "20px", padding: "10px 20px" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
