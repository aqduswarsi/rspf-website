import { useState } from "react";

const initialForm = {
  // === PHOTO ===
  photo: null,
  photoPreview: "",

  // === 1-2. Identity ===
  rollNumber: "",
  rank: "",

  // === 3-8. Name & Parents ===
  nameEnglish: "",
  nameHindi: "",
  fatherNameEnglish: "",
  fatherNameHindi: "",
  motherNameEnglish: "",
  motherNameHindi: "",

  // === 9-11. Dates ===
  dateOfBirth: "",
  dateOfEnlistment: "",
  dateOfAppointment: "",

  // === 12-13. Posting ===
  presentPosting: "",
  permanentPosting: "",

  // === 14-15. ID Numbers ===
  aadharNumber: "",
  panNumber: "",

  // === 16-17. Mobile + WhatsApp ===
  mobileNumber: "",
  mobileWhatsapp: "",
  alternateMobile: "",
  alternateWhatsapp: "",

  // === 18. Guardian ===
  guardianContact: "",
  guardianName: "",
  guardianRelation: "",

  // === 19. Emergency ===
  emergencyContact: "",
  emergencyName: "",
  emergencyRelation: "",

  // === 20-22. Contact & Zone ===
  email: "",
  zone: "",
  nearestStation: "",

  // === 23-24. Identification Marks ===
  identificationMark1: "",
  identificationMark2: "",

  // === 25-28. Religion, Category, Blood ===
  religion: "",
  category: "",
  caste: "",
  allotedCategory: "",
  bloodGroup: "",

  // === 29-30. Education ===
  educationalQualification: "",

  // === 31-32. Skills ===
  professionalKnowledge: "",
  vocationalTraining: "",

  // === 33. Other Experience ===
  expSwimming: false,
  expCycling: false,
  expMotorcycle: false,
  expCar: false,
  expDrivingLicense: false,

  // === 34-35. Language ===
  languageKnown: "",
  examLanguage: "",

  // === 36. Body Measurement ===
  height: "",
  weight: "",

  // === 37-39. Address ===
  presentAddress: "",
  presentPinCode: "",
  permanentAddress: "",
  permanentPinCode: "",
  state: "",

  // === 40-43. Family ===
  maritalStatus: "",
  spouseName: "",
  childrenName: "",
  nominee: "",

  // === 44. Previous Employment ===
  previousEmployment: "",

  // === 45-47. Bank ===
  bankName: "",
  bankAccountNo: "",
  bankIFSC: "",
  bankMICR: "",
  bankBranchAddress: "",

  // === 48-49. Medical ===
  medicalHistory: "",
  medicalPlace: "",

  // === 50. Food ===
  foodVeg: false,
  foodNonVeg: false,
  foodEgg: false,
  foodFish: false,
  foodChicken: false,
  foodMutton: false,

  // === 51-52. Sizes ===
  shirtSize: "",
  trouserSize: "",
  shoesSize: "",
  slipperSize: "",

  // === 53. Reporting ===
  dateOfReporting: "",
  diaryEntryNo: "",
  reportingTime: "",

  // === 54. Any Other ===
  anyOther: "",

  // === 55. Declaration ===
  declarationAccepted: false,
};

export default function AddUser() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // ==================== PHOTO UPLOAD ====================
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPG, PNG, WEBP)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setForm({
        ...form,
        photo: file,
        photoPreview: event.target.result,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemovePhoto = () => {
    setForm({ ...form, photo: null, photoPreview: "" });
  };

  // ==================== SUBMIT ====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.declarationAccepted) {
      alert(
        "Please accept the Declaration / Undertaking before submitting.",
      );
      return;
    }
    setSubmitting(true);
    console.log("Full BIO Data:", form);
    // TODO: API call — POST /api/admin/users
    setTimeout(() => {
      alert("BIO Data submitted successfully!");
      setForm(initialForm);
      setSubmitting(false);
    }, 800);
  };

  const handleReset = () => {
    if (window.confirm("Reset entire form?")) setForm(initialForm);
  };

  return (
    <div className="form-page bio-form-page">
      <div className="bio-form-header">
        <h2>BIO - DATA</h2>
        <p>RPSF / TC / GKP — Recruitment 2026</p>
      </div>

      <form onSubmit={handleSubmit} className="bio-form">
        {/* ==================== PHOTO UPLOAD ==================== */}
        <div className="bio-section photo-upload-section">
          <h3>Candidate Photo</h3>
          <div className="photo-upload-wrap">
            {form.photoPreview ? (
              <div className="photo-preview-box">
                <img
                  src={form.photoPreview}
                  alt="Candidate"
                  className="photo-preview"
                />
                <button
                  type="button"
                  className="photo-remove-btn"
                  onClick={handleRemovePhoto}
                  title="Remove photo"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="photo-dropzone">
                <div className="photo-drop-icon">PHOTO</div>
                <span className="photo-drop-text">Click to Upload Photo</span>
                <small>JPG, PNG, WEBP — Max 2MB</small>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  hidden
                />
              </label>
            )}
            <div className="photo-info">
              <p>
                <strong>Photo Guidelines</strong>
              </p>
              <ul>
                <li>Passport size photo (35mm × 45mm)</li>
                <li>Recent, clear, front-facing</li>
                <li>Plain / light background</li>
                <li>Max file size: 2MB</li>
                <li>Format: JPG, PNG, or WEBP</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ==================== 1-2. IDENTITY ==================== */}
        <div className="bio-section">
          <h3>Identity</h3>
          <div className="bio-grid">
            <div className="form-field">
              <label>1. Roll Number / UIN / PF No.</label>
              <input
                name="rollNumber"
                value={form.rollNumber}
                onChange={handleChange}
                placeholder="Enter roll number / UIN / PF no."
              />
            </div>
            <div className="form-field">
              <label>2. Rank</label>
              <input
                name="rank"
                value={form.rank}
                onChange={handleChange}
                placeholder="Enter rank"
              />
            </div>
          </div>
        </div>

        {/* ==================== 3-8. NAME & PARENTS ==================== */}
        <div className="bio-section">
          <h3>Name &amp; Parents</h3>
          <div className="bio-grid">
            <div className="form-field">
              <label>3. Name — In English</label>
              <input
                name="nameEnglish"
                value={form.nameEnglish}
                onChange={handleChange}
                placeholder="Full name in English"
                required
              />
            </div>
            <div className="form-field">
              <label>4. Name — हिंदी में</label>
              <input
                name="nameHindi"
                value={form.nameHindi}
                onChange={handleChange}
                placeholder="हिंदी में नाम"
              />
            </div>
            <div className="form-field">
              <label>5. Father's Name — English</label>
              <input
                name="fatherNameEnglish"
                value={form.fatherNameEnglish}
                onChange={handleChange}
                placeholder="Father's name in English"
              />
            </div>
            <div className="form-field">
              <label>6. Father's Name — हिंदी में</label>
              <input
                name="fatherNameHindi"
                value={form.fatherNameHindi}
                onChange={handleChange}
                placeholder="पिता का नाम"
              />
            </div>
            <div className="form-field">
              <label>7. Mother's Name — English</label>
              <input
                name="motherNameEnglish"
                value={form.motherNameEnglish}
                onChange={handleChange}
                placeholder="Mother's name in English"
              />
            </div>
            <div className="form-field">
              <label>8. Mother's Name — हिंदी में</label>
              <input
                name="motherNameHindi"
                value={form.motherNameHindi}
                onChange={handleChange}
                placeholder="माता का नाम"
              />
            </div>
          </div>
        </div>

        {/* ==================== 9-11. DATES ==================== */}
        <div className="bio-section">
          <h3>Important Dates</h3>
          <div className="bio-grid">
            <div className="form-field">
              <label>9. Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label>10. Date of Enlistment</label>
              <input
                type="date"
                name="dateOfEnlistment"
                value={form.dateOfEnlistment}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label>11. Date of Appointment</label>
              <input
                type="date"
                name="dateOfAppointment"
                value={form.dateOfAppointment}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* ==================== 12-13. POSTING ==================== */}
        <div className="bio-section">
          <h3>Posting Details</h3>
          <div className="bio-grid">
            <div className="form-field full-width">
              <label>
                12. Present Posting Details (Outpost) — (Post/Coy, Div/BN,
                Zone/RPSF/PU)
              </label>
              <input
                name="presentPosting"
                value={form.presentPosting}
                onChange={handleChange}
                placeholder="Enter present posting details"
              />
            </div>
            <div className="form-field full-width">
              <label>
                13. Permanent Posting Details — (Post/Coy, Div/BN, Zone/RPSF/PU)
              </label>
              <input
                name="permanentPosting"
                value={form.permanentPosting}
                onChange={handleChange}
                placeholder="Enter permanent posting details"
              />
            </div>
          </div>
        </div>

        {/* ==================== 14-15. ID NUMBERS ==================== */}
        <div className="bio-section">
          <h3>ID Numbers</h3>
          <div className="bio-grid">
            <div className="form-field">
              <label>14. Aadhar Number</label>
              <input
                name="aadharNumber"
                value={form.aadharNumber}
                onChange={handleChange}
                placeholder="XXXX XXXX XXXX"
                maxLength={14}
              />
            </div>
            <div className="form-field">
              <label>15. PAN Number</label>
              <input
                name="panNumber"
                value={form.panNumber}
                onChange={handleChange}
                placeholder="ABCDE1234F"
                maxLength={10}
              />
            </div>
          </div>
        </div>

        {/* ==================== 16-20. CONTACT ==================== */}
        <div className="bio-section">
          <h3>Contact Information</h3>
          <div className="bio-grid">
            <div className="form-field">
              <label>16. Mobile Number</label>
              <input
                name="mobileNumber"
                value={form.mobileNumber}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
              />
              <div className="whatsapp-radio">
                <span>WhatsApp:</span>
                <label className="inline-check">
                  <input
                    type="radio"
                    name="mobileWhatsapp"
                    value="Y"
                    checked={form.mobileWhatsapp === "Y"}
                    onChange={handleChange}
                  />{" "}
                  Y
                </label>
                <label className="inline-check">
                  <input
                    type="radio"
                    name="mobileWhatsapp"
                    value="N"
                    checked={form.mobileWhatsapp === "N"}
                    onChange={handleChange}
                  />{" "}
                  N
                </label>
              </div>
            </div>
            <div className="form-field">
              <label>17. Alternate Mobile No.</label>
              <input
                name="alternateMobile"
                value={form.alternateMobile}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
              />
              <div className="whatsapp-radio">
                <span>WhatsApp:</span>
                <label className="inline-check">
                  <input
                    type="radio"
                    name="alternateWhatsapp"
                    value="Y"
                    checked={form.alternateWhatsapp === "Y"}
                    onChange={handleChange}
                  />{" "}
                  Y
                </label>
                <label className="inline-check">
                  <input
                    type="radio"
                    name="alternateWhatsapp"
                    value="N"
                    checked={form.alternateWhatsapp === "N"}
                    onChange={handleChange}
                  />{" "}
                  N
                </label>
              </div>
            </div>
            <div className="form-field">
              <label>18. Guardian Contact No.</label>
              <input
                name="guardianContact"
                value={form.guardianContact}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            <div className="form-field">
              <label>Guardian Name</label>
              <input
                name="guardianName"
                value={form.guardianName}
                onChange={handleChange}
                placeholder="Guardian's name"
              />
            </div>
            <div className="form-field">
              <label>Relation</label>
              <input
                name="guardianRelation"
                value={form.guardianRelation}
                onChange={handleChange}
                placeholder="Relation with guardian"
              />
            </div>
            <div className="form-field">
              <label>19. Emergency Contact No. (Other than Guardian)</label>
              <input
                name="emergencyContact"
                value={form.emergencyContact}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            <div className="form-field">
              <label>Emergency Contact Name</label>
              <input
                name="emergencyName"
                value={form.emergencyName}
                onChange={handleChange}
                placeholder="Name"
              />
            </div>
            <div className="form-field">
              <label>Emergency Contact Relation</label>
              <input
                name="emergencyRelation"
                value={form.emergencyRelation}
                onChange={handleChange}
                placeholder="Relation"
              />
            </div>
            <div className="form-field full-width">
              <label>20. Email ID</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
              />
            </div>
          </div>
        </div>

        {/* ==================== 21-22. ZONE ==================== */}
        <div className="bio-section">
          <h3>Zone &amp; Location</h3>
          <div className="bio-grid">
            <div className="form-field">
              <label>21. Zone</label>
              <select name="zone" value={form.zone} onChange={handleChange}>
                <option value="">Select Zone</option>
                <option>NR</option>
                <option>NCR</option>
                <option>NER</option>
                <option>NFR</option>
                <option>NWR</option>
                <option>CR</option>
                <option>WR</option>
                <option>WCR</option>
                <option>SR</option>
                <option>SCR</option>
                <option>SER</option>
                <option>SECR</option>
                <option>SWR</option>
                <option>ER</option>
                <option>ECR</option>
                <option>ECOR</option>
                <option>Metro</option>
                <option>RPSF</option>
              </select>
            </div>
            <div className="form-field">
              <label>22. Nearest Rly Station</label>
              <input
                name="nearestStation"
                value={form.nearestStation}
                onChange={handleChange}
                placeholder="Nearest railway station"
              />
            </div>
          </div>
        </div>

        {/* ==================== 23-28. IDENTIFICATION & CATEGORY ==================== */}
        <div className="bio-section">
          <h3>Identification &amp; Category</h3>
          <div className="bio-grid">
            <div className="form-field">
              <label>23. Identification Mark 1</label>
              <input
                name="identificationMark1"
                value={form.identificationMark1}
                onChange={handleChange}
                placeholder="First identification mark"
              />
            </div>
            <div className="form-field">
              <label>24. Identification Mark 2</label>
              <input
                name="identificationMark2"
                value={form.identificationMark2}
                onChange={handleChange}
                placeholder="Second identification mark"
              />
            </div>
            <div className="form-field">
              <label>25. Religion</label>
              <input
                name="religion"
                value={form.religion}
                onChange={handleChange}
                placeholder="Religion"
              />
            </div>
            <div className="form-field">
              <label>26. Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                <option>General</option>
                <option>OBC</option>
                <option>SC</option>
                <option>ST</option>
                <option>EWS</option>
              </select>
            </div>
            <div className="form-field">
              <label>Cast</label>
              <input
                name="caste"
                value={form.caste}
                onChange={handleChange}
                placeholder="Caste"
              />
            </div>
            <div className="form-field">
              <label>27. Alloted Category</label>
              <input
                name="allotedCategory"
                value={form.allotedCategory}
                onChange={handleChange}
                placeholder="Alloted category"
              />
            </div>
            <div className="form-field">
              <label>28. Blood Group</label>
              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
              >
                <option value="">Select Blood Group</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>O+</option>
                <option>O-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
            </div>
          </div>
        </div>

        {/* ==================== 29-32. EDUCATION & SKILLS ==================== */}
        <div className="bio-section">
          <h3>Education &amp; Skills</h3>
          <div className="bio-grid">
            <div className="form-field full-width">
              <label>29-30. Educational Qualification</label>
              <textarea
                name="educationalQualification"
                value={form.educationalQualification}
                onChange={handleChange}
                rows="3"
                placeholder="List all educational qualifications..."
              />
            </div>
            <div className="form-field full-width">
              <label>31. Professional Knowledge, if any — Computer</label>
              <textarea
                name="professionalKnowledge"
                value={form.professionalKnowledge}
                onChange={handleChange}
                rows="2"
                placeholder="e.g., MS Office, Tally, Programming..."
              />
            </div>
            <div className="form-field full-width">
              <label>32. Vocational Training, if any</label>
              <textarea
                name="vocationalTraining"
                value={form.vocationalTraining}
                onChange={handleChange}
                rows="2"
                placeholder="Vocational training details..."
              />
            </div>
          </div>
        </div>

        {/* ==================== 33. OTHER EXPERIENCE ==================== */}
        <div className="bio-section">
          <h3>33. Other Experience</h3>
          <div className="checkbox-group">
            <label className="inline-check">
              <input
                type="checkbox"
                name="expSwimming"
                checked={form.expSwimming}
                onChange={handleChange}
              />{" "}
              Swimming
            </label>
            <label className="inline-check">
              <input
                type="checkbox"
                name="expCycling"
                checked={form.expCycling}
                onChange={handleChange}
              />{" "}
              Cycling
            </label>
            <label className="inline-check">
              <input
                type="checkbox"
                name="expMotorcycle"
                checked={form.expMotorcycle}
                onChange={handleChange}
              />{" "}
              Motorcycle
            </label>
            <label className="inline-check">
              <input
                type="checkbox"
                name="expCar"
                checked={form.expCar}
                onChange={handleChange}
              />{" "}
              CAR
            </label>
            <label className="inline-check">
              <input
                type="checkbox"
                name="expDrivingLicense"
                checked={form.expDrivingLicense}
                onChange={handleChange}
              />{" "}
              Driving License
            </label>
          </div>
        </div>

        {/* ==================== 34-35. LANGUAGE ==================== */}
        <div className="bio-section">
          <h3>Language</h3>
          <div className="bio-grid">
            <div className="form-field">
              <label>34. Language Known</label>
              <input
                name="languageKnown"
                value={form.languageKnown}
                onChange={handleChange}
                placeholder="e.g., Hindi, English, Bhojpuri"
              />
            </div>
            <div className="form-field">
              <label>35. Exam Language</label>
              <input
                name="examLanguage"
                value={form.examLanguage}
                onChange={handleChange}
                placeholder="Language for exam"
              />
            </div>
          </div>
        </div>

        {/* ==================== 36. BODY MEASUREMENT ==================== */}
        <div className="bio-section">
          <h3>36. Body Measurement</h3>
          <div className="bio-grid">
            <div className="form-field">
              <label>Height (cm)</label>
              <input
                name="height"
                value={form.height}
                onChange={handleChange}
                placeholder="e.g., 175"
              />
            </div>
            <div className="form-field">
              <label>Weight (kg)</label>
              <input
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder="e.g., 70"
              />
            </div>
          </div>
        </div>

        {/* ==================== 37-39. ADDRESS ==================== */}
        <div className="bio-section">
          <h3>Address</h3>
          <div className="bio-grid">
            <div className="form-field full-width">
              <label>37. Present Address</label>
              <textarea
                name="presentAddress"
                value={form.presentAddress}
                onChange={handleChange}
                rows="2"
                placeholder="Current residential address..."
              />
            </div>
            <div className="form-field">
              <label>Present Pin Code</label>
              <input
                name="presentPinCode"
                value={form.presentPinCode}
                onChange={handleChange}
                placeholder="XXXXXX"
                maxLength={6}
              />
            </div>
            <div className="form-field full-width">
              <label>38. Permanent Address</label>
              <textarea
                name="permanentAddress"
                value={form.permanentAddress}
                onChange={handleChange}
                rows="2"
                placeholder="Permanent home address..."
              />
            </div>
            <div className="form-field">
              <label>Permanent Pin Code</label>
              <input
                name="permanentPinCode"
                value={form.permanentPinCode}
                onChange={handleChange}
                placeholder="XXXXXX"
                maxLength={6}
              />
            </div>
            <div className="form-field">
              <label>39. State</label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
              />
            </div>
          </div>
        </div>

        {/* ==================== 40-43. FAMILY ==================== */}
        <div className="bio-section">
          <h3>Family Details</h3>
          <div className="bio-grid">
            <div className="form-field">
              <label>40. Marital Status</label>
              <select
                name="maritalStatus"
                value={form.maritalStatus}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>Single</option>
                <option>Married</option>
                <option>Divorced</option>
                <option>Widowed</option>
              </select>
            </div>
            <div className="form-field">
              <label>41. Spouse Name, if any</label>
              <input
                name="spouseName"
                value={form.spouseName}
                onChange={handleChange}
                placeholder="Spouse's name"
              />
            </div>
            <div className="form-field full-width">
              <label>42. Name of Children, if any</label>
              <input
                name="childrenName"
                value={form.childrenName}
                onChange={handleChange}
                placeholder="Children names (separate with comma)"
              />
            </div>
            <div className="form-field full-width">
              <label>43. Nominee</label>
              <input
                name="nominee"
                value={form.nominee}
                onChange={handleChange}
                placeholder="Nominee name"
              />
            </div>
          </div>
        </div>

        {/* ==================== 44. PREVIOUS EMPLOYMENT ==================== */}
        <div className="bio-section">
          <h3>44. Previous Employment, if any</h3>
          <textarea
            name="previousEmployment"
            value={form.previousEmployment}
            onChange={handleChange}
            rows="3"
            placeholder="Previous employment details..."
          />
        </div>

        {/* ==================== 45-47. BANK ==================== */}
        <div className="bio-section">
          <h3>Bank Details</h3>
          <div className="bio-grid">
            <div className="form-field">
              <label>45. Bank Name</label>
              <input
                name="bankName"
                value={form.bankName}
                onChange={handleChange}
                placeholder="Bank name"
              />
            </div>
            <div className="form-field">
              <label>Account Number (A/C)</label>
              <input
                name="bankAccountNo"
                value={form.bankAccountNo}
                onChange={handleChange}
                placeholder="Account number"
              />
            </div>
            <div className="form-field">
              <label>46. IFSC Code</label>
              <input
                name="bankIFSC"
                value={form.bankIFSC}
                onChange={handleChange}
                placeholder="IFSC code"
              />
            </div>
            <div className="form-field">
              <label>MICR Code</label>
              <input
                name="bankMICR"
                value={form.bankMICR}
                onChange={handleChange}
                placeholder="MICR code"
              />
            </div>
            <div className="form-field full-width">
              <label>47. Bank Branch Address</label>
              <textarea
                name="bankBranchAddress"
                value={form.bankBranchAddress}
                onChange={handleChange}
                rows="2"
                placeholder="Branch full address..."
              />
            </div>
          </div>
        </div>

        {/* ==================== 48-49. MEDICAL ==================== */}
        <div className="bio-section">
          <h3>Medical Information</h3>
          <div className="bio-grid">
            <div className="form-field full-width">
              <label>48. Medical History, if any</label>
              <textarea
                name="medicalHistory"
                value={form.medicalHistory}
                onChange={handleChange}
                rows="2"
                placeholder="Any past medical history..."
              />
            </div>
            <div className="form-field full-width">
              <label>49. Medical Place</label>
              <input
                name="medicalPlace"
                value={form.medicalPlace}
                onChange={handleChange}
                placeholder="Medical place"
              />
            </div>
          </div>
        </div>

        {/* ==================== 50. FOOD PREFERENCE ==================== */}
        <div className="bio-section">
          <h3>50. Vegetarian / Non-Vegetarian</h3>
          <div className="checkbox-group">
            <label className="inline-check">
              <input
                type="checkbox"
                name="foodVeg"
                checked={form.foodVeg}
                onChange={handleChange}
              />{" "}
              Veg
            </label>
            <label className="inline-check">
              <input
                type="checkbox"
                name="foodNonVeg"
                checked={form.foodNonVeg}
                onChange={handleChange}
              />{" "}
              Non Veg
            </label>
            <label className="inline-check">
              <input
                type="checkbox"
                name="foodEgg"
                checked={form.foodEgg}
                onChange={handleChange}
              />{" "}
              Egg
            </label>
            <label className="inline-check">
              <input
                type="checkbox"
                name="foodFish"
                checked={form.foodFish}
                onChange={handleChange}
              />{" "}
              Fish
            </label>
            <label className="inline-check">
              <input
                type="checkbox"
                name="foodChicken"
                checked={form.foodChicken}
                onChange={handleChange}
              />{" "}
              Chicken
            </label>
            <label className="inline-check">
              <input
                type="checkbox"
                name="foodMutton"
                checked={form.foodMutton}
                onChange={handleChange}
              />{" "}
              Mutton
            </label>
          </div>
        </div>

        {/* ==================== 51-52. SIZES ==================== */}
        <div className="bio-section">
          <h3>Cloth &amp; Footwear Size</h3>
          <div className="bio-grid">
            <div className="form-field">
              <label>51. Shirt Size</label>
              <input
                name="shirtSize"
                value={form.shirtSize}
                onChange={handleChange}
                placeholder="e.g., 40"
              />
            </div>
            <div className="form-field">
              <label>Trouser Size</label>
              <input
                name="trouserSize"
                value={form.trouserSize}
                onChange={handleChange}
                placeholder="e.g., 32"
              />
            </div>
            <div className="form-field">
              <label>52. Shoes Size</label>
              <input
                name="shoesSize"
                value={form.shoesSize}
                onChange={handleChange}
                placeholder="e.g., 9"
              />
            </div>
            <div className="form-field">
              <label>Slipper Size</label>
              <input
                name="slipperSize"
                value={form.slipperSize}
                onChange={handleChange}
                placeholder="e.g., 9"
              />
            </div>
          </div>
        </div>

        {/* ==================== 53. REPORTING ==================== */}
        <div className="bio-section">
          <h3>53. Date of Reporting at RPSF / TC / GKP</h3>
          <div className="bio-grid">
            <div className="form-field">
              <label>Date</label>
              <input
                type="date"
                name="dateOfReporting"
                value={form.dateOfReporting}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label>Diary Entry No.</label>
              <input
                name="diaryEntryNo"
                value={form.diaryEntryNo}
                onChange={handleChange}
                placeholder="Diary entry number"
              />
            </div>
            <div className="form-field">
              <label>Time</label>
              <input
                type="time"
                name="reportingTime"
                value={form.reportingTime}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* ==================== 54. ANY OTHER ==================== */}
        <div className="bio-section">
          <h3>54. Any Other</h3>
          <textarea
            name="anyOther"
            value={form.anyOther}
            onChange={handleChange}
            rows="3"
            placeholder="Any other information..."
          />
        </div>

        {/* ==================== 55. DECLARATION ==================== */}
        <div className="bio-section declaration-section">
          <h3>55. Declaration / Undertaking</h3>
          <p className="declaration-text">
            "I solemnly declare that the particulars furnished above are true,
            complete, and correct. In the event of any statement or information
            being found false, fabricated, or suppressed, my
            candidature/training may be cancelled, and I shall be subject to
            disciplinary and penal action under the relevant Force Rules and
            law."
          </p>
          <label className="inline-check declaration-check">
            <input
              type="checkbox"
              name="declarationAccepted"
              checked={form.declarationAccepted}
              onChange={handleChange}
              required
            />
            I accept the above Declaration / Undertaking
          </label>
        </div>

        {/* ==================== ACTIONS ==================== */}
        <div className="bio-form-actions">
          <button type="button" className="btn-reset" onClick={handleReset}>
            Reset Form
          </button>
          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit BIO Data"}
          </button>
        </div>
      </form>
    </div>
  );
}
