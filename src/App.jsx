import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    date: '',
    participants: '',
    location: '',
    answers: {},
    comments: {}
  });
  const [riskScore, setRiskScore] = useState(0);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      answers: { ...formData.answers, [name]: value }
    });
  };

  const handleCommentChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      comments: { ...formData.comments, [name]: value }
    });
  };

  const calculateRiskScore = () => {
    const answers = Object.values(formData.answers);
    const total = answers.length;
    const red = answers.filter(a => a === 'Nei').length;
    const yellow = answers.filter(a => a === 'Delvis').length;
    const score = ((red * 2 + yellow) / (total * 2)) * 100;
    setRiskScore(score);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    calculateRiskScore();

    try {
      const response = await fetch('/.netlify/functions/send-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, riskScore }),
      });

      if (response.ok) {
        alert('Rapporten ble generert og sendt til e-post!');
      } else {
        throw new Error('Server responded with an error');
      }
    } catch (error) {
      console.error('Feil ved sending av rapport:', error);
      alert('Ein feil oppstod ved lagring av rapporten.');
    }
  };

  const sections = [
    {
      title: "PSYKOSOSIALT ARBEIDSMILJØ",
      questions: [
        { id: 'culture', text: 'Ein positiv kultur: Korleis opplever du kulturen på arbeidsplassen? Er det eit positivt miljø?' },
        { id: 'workload', text: 'Arbeidsbelastning: Opplever du arbeidsbelastninga som akseptabel, eller er ho svært høg og belastande?' },
        { id: 'communication', text: 'God kommunikasjon med kollegaer: Korleis fungerer kommunikasjonen med kollegaene dine?' },
        { id: 'leadership', text: 'Støttande leiarskap: Opplever du at leiinga er støttande og tilgjengeleg når du treng hjelp?' },
        { id: 'recognition', text: 'Anerkjenning: Føler du deg verdsett for arbeidet du gjer på arbeidsplassen?' },
        { id: 'participation', text: 'Medverknad: Har du moglegheit til å påverke avgjersler som vedkjem deg i arbeidssituasjonen?' },
        { id: 'collaboration', text: 'Samarbeid: Korleis fungerer samarbeidet med kollegaene? Er det rom for effektivt samarbeid i teamet?' },
      ]
    },
    {
      title: "FYSISK ARBEIDSMILJØ",
      questions: [
        { id: 'lighting', text: 'Belysning: Er belysninga på kontoret god nok til å sikre komfort og produktivitet?' },
        { id: 'sunlight_shielding', text: 'Skjerming mot sollys: Er det tilstrekkeleg skjerming mot direkte sollys?' },
        { id: 'air_quality', text: 'Luftkvalitet/belufting: Er luftkvaliteten på kontoret god, og er ventilasjonen tilstrekkeleg?' },
        { id: 'noise', text: 'Lyd/støy: Er lydnivået og støynivået på kontoret akseptabelt?' },
        { id: 'desk', text: 'Hev-senk-arbeidsbord: Har du tilgang til eit hev-senk-arbeidsbord, og fungerer det godt for deg?' },
        { id: 'chair', text: 'Kontorstol: Er kontorstolen din ergonomisk og komfortabel for langvarig bruk?' },
        { id: 'screen', text: 'God skjermkvalitet og storleik: Er skjermen din av god kvalitet og stor nok til å sikre komfortabelt arbeid?' },
      ]
    },
    {
      title: "BRANNVERN",
      questions: [
        { id: 'fire_theory', text: 'Teoretisk brannvernteori: Har du god kunnskap om brannsikkerheitsteori og kva du skal gjere i tilfelle brann?' },
        { id: 'fire_drill', text: 'Praktisk brannvernøving: Har du deltatt i praktiske øvingar som brannøvingar eller evakueringsøvingar?' },
      ]
    },
    {
      title: "FELLESOMRÅDE",
      questions: [
        { id: 'storage', text: 'Lager: Er lagerområda ryddige og trygge, utan unødvendige hinder eller farar?' },
        { id: 'hallway', text: 'Gang: Er gangareala frie for hinder og trygge å ferdast i?' },
        { id: 'toilet', text: 'Toalett: Er toalettfasilitetane reine, hygieniske og tilstrekkeleg utstyrte?' },
        { id: 'stairs', text: 'Trapper: Er trappene trygge å bruke, med god belysning og sklisikre trinn?' },
        { id: 'canteen', text: 'Kantine: Er kantineområdet reint og godt vedlikehalde? Er det tilstrekkeleg hygiene og plass?' },
      ]
    },
  ];

  return (
    <div className="App">
      <h1>VERNERUNDE SJEKKLISTE</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Dato for vernerunde:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="participants">Deltakere:</label>
          <input
            type="text"
            id="participants"
            name="participants"
            value={formData.participants}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="location">Sted for vernerunde:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </div>

        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="section">
            <h2>{section.title}</h2>
            {section.questions.map((question, index) => (
              <div key={question.id} className="question">
                <p>{question.text}</p>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name={question.id}
                      value="Ja"
                      onChange={handleRadioChange}
                      required
                    />
                    <span></span>
                    Ja
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={question.id}
                      value="Delvis"
                      onChange={handleRadioChange}
                    />
                    <span></span>
                    Delvis
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={question.id}
                      value="Nei"
                      onChange={handleRadioChange}
                    />
                    <span></span>
                    Nei
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={question.id}
                      value="Ønskjer ikkje å svare"
                      onChange={handleRadioChange}
                    />
                    <span></span>
                    Ønskjer ikkje å svare
                  </label>
                </div>
                <textarea
                  name={question.id}
                  placeholder="Kommentar"
                  onChange={handleCommentChange}
                ></textarea>
              </div>
            ))}
          </div>
        ))}

        <button type="submit">Lagre og send rapport</button>
      </form>
      {riskScore > 0 && (
        <div className="risk-score">
          <h2>Risikoscore: {riskScore.toFixed(2)}%</h2>
        </div>
      )}
      <div className="footer">
        <p>© 2024 Varde Digital Solutions AS</p>
        <a href="https://vardedigital.com" target="_blank" rel="noopener noreferrer">vardedigital.com</a>
      </div>
    </div>
  );
}

export default App;