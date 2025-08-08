import { useState } from "react";
import "../styles/MimicChat.css";
import Chatbox from "./ChatBox.jsx";

export default function CloneUpload() {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [nameYouCalledThem, setNameYouCalledThem] = useState("");
  const [nameTheyCalledYou, setNameTheyCalledYou] = useState("");
  const [age, setAge] = useState("");
  const [relationshipWithThePerson, setRelationshipWithThePerson] = useState("");
  const [career, setCareer] = useState("");
  const [lastResidence, setLastResidence] = useState("");
  const [origin, setOrigin] = useState("");

  // Personality traits state
  const [trait1, setTrait1] = useState("");
  const [trait2, setTrait2] = useState("");
  const [trait3, setTrait3] = useState("");
  const [trait4, setTrait4] = useState("");
  const [trait5, setTrait5] = useState("");
  const [quote, setQuote] = useState("");
  const [personalityId, setPersonalityId] = useState("");

  {/*
        // Future support:
        // const [yearOfBirth, setYearOfBirth] = useState("");
        // const [yearOfDeath, setYearOfDeath] = useState("");
        // const [ageAtDeath, setAgeAtDeath] = useState("");
        // const [causeOfDeath, setCauseOfDeath] = useState("");
        */}

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/clone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          nickname,
          nameYouCalledThem,
          nameTheyCalledYou,
          age,
          relationshipWithThePerson,
          career,
          lastResidence,
          origin,
          trait1,
          trait2,
          trait3,
          trait4,
          trait5,
          quote,
        }),
      });

      if (!response.ok) throw new Error("Upload failed.");

      const data = await response.json();
      setPersonalityId(data.personalityId);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("❌ Upload failed. Try again.");
    }
  };

  return (
    <div className="clone-container">
      <div className="person-details-container">
        <h2 className="form-title">Clone a Person</h2>
        <input
          className="input-field"
          placeholder="Full Name of the Person"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Their Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>

      <div className="additional-info-container">
        <input
          className="input-field"
          placeholder="What You Called Them"
          value={nameYouCalledThem}
          onChange={(e) => setNameYouCalledThem(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="What They Called You"
          value={nameTheyCalledYou}
          onChange={(e) => setNameTheyCalledYou(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Who is this person to you? (e.g., friend, mentor)"
          value={relationshipWithThePerson}
          onChange={(e) => setRelationshipWithThePerson(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Their Career"
          value={career}
          onChange={(e) => setCareer(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Location of Last Residence"
          value={lastResidence}
          onChange={(e) => setLastResidence(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Originally From"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
      </div>

      <div className="personality-traits-container">
        <h3 className="subheading">Personality Traits:</h3>

        <div className="trait">
          <label className="trait-label">They were more:</label>
          <input
            type="radio"
            name="trait1"
            value="eager to try wild, new experiences."
            onChange={(e) => setTrait1(e.target.value)}
          /> Eager to try wild experiences.
          <input
            type="radio"
            name="trait1"
            value="wanting to stick with the familiar."
            onChange={(e) => setTrait1(e.target.value)}
          /> Wanting to stick with the familiar.
        </div>

        <div className="trait">
          <label className="trait-label">They were more:</label>
          <input
            type="radio"
            name="trait2"
            value="up-tight, organized, and reliable."
            onChange={(e) => setTrait2(e.target.value)}
          /> Up-tight, organized.
          <input
            type="radio"
            name="trait2"
            value="laid-back, messy, and unpredictable."
            onChange={(e) => setTrait2(e.target.value)}
          /> Laid-back, messy, and unpredictable.
        </div>

        <div className="trait">
          <label className="trait-label">They were more:</label>
          <input
            type="radio"
            name="trait3"
            value="eager to socialize, meet new people."
            onChange={(e) => setTrait3(e.target.value)}
          /> Eager to socialize.
          <input
            type="radio"
            name="trait3"
            value="preferring to stay home and pursue solitary activities."
            onChange={(e) => setTrait3(e.target.value)}
          /> Prefer staying home.
        </div>

        <div className="trait">
          <label className="trait-label">They were more:</label>
          <input
            type="radio"
            name="trait4"
            value="easy to get along with, friendly."
            onChange={(e) => setTrait4(e.target.value)}
          /> Friendly.
          <input
            type="radio"
            name="trait4"
            value="bristly, confrontational, and likely to argue."
            onChange={(e) => setTrait4(e.target.value)}
          /> Confrontational.
        </div>

        <div className="trait">
          <label className="trait-label">They were more:</label>
          <input
            type="radio"
            name="trait5"
            value="secure, confident, and stable."
            onChange={(e) => setTrait5(e.target.value)}
          /> Confident.
          <input
            type="radio"
            name="trait5"
            value="worried, nervous, and troubled."
            onChange={(e) => setTrait5(e.target.value)}
          /> Nervous.
        </div>
      </div>

      <div className="own-words-section">
        <h3 className="subheading">THEIR OWN WORDS:</h3>
        <label>Short quote from them:</label>
        <input
          className="input-field"
          placeholder="(example of their speaking/writing style)"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
        />
      </div>

      <button className="submit-btn" onClick={handleSubmit}>
        Upload and Create Clone
      </button>

      {isSubmitted && (
        <Chatbox user={name} personalityId={personalityId} />
      )}
    </div>
  );
}
