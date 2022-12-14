import { useState, useEffect } from 'react';
import '../styles/App.scss';
import callToApi from '../services/api';
import Search from './Search';
import Adalabers from './Adalabers';
import Header from './Header';

function App() {
  //States
  const [searchName, setSearchName] = useState('');
  const [searchCounselor, setSearchCounselor] = useState('');
  const [adalabers, setAdalabers] = useState([]);
  const [newAdalaber, setNewAdalaber] = useState({
    id: crypto.randomUUID(),
    name: '',
    counselor: '',
    speciality: '',
    social_networks: [],
  });

  //Effects
  useEffect(() => {
    callToApi().then((adalabers) => {
      setAdalabers(adalabers);
    });
  }, []);

  //Handlers

  const handleInput = (value) => {
    setNewAdalaber({ ...newAdalaber, [value.name]: value.value });
  };

  const handleNewAdalaber = () => {
    if (
      newAdalaber.name !== '' &&
      newAdalaber.counselor !== '' &&
      newAdalaber.speciality !== ''
    ) {
      adalabers.push(newAdalaber);
      setAdalabers([...adalabers]);
      setNewAdalaber({
        id: crypto.randomUUID(),
        name: '',
        counselor: '',
        speciality: '',
        social_networks: [],
      });
    }
  };

  const handleSearchName = (value) => {
    setSearchName(value);
  };

  const handleSearchCounselor = (value) => {
    setSearchCounselor(value);
  };

  //Render Helpers
  const renderSocialNetworks = (adalaberId) => {
    const foundAdalaber = adalabers.find(
      (eachAdalaber) => eachAdalaber.id === adalaberId
    );
    const socialNetworks = foundAdalaber.social_networks.map(
      (eachNetwork, i) => {
        if (eachNetwork.name === 'GitHub') {
          return (
            <li key={i}>
              <a href={eachNetwork.url}>
                <i class='fa-brands fa-github'></i>
              </a>
            </li>
          );
        } else if (eachNetwork.name === 'LinkedIn') {
          return (
            <li key={i}>
              <a href={eachNetwork.url}>
                <i class='fa-brands fa-linkedin'></i>
              </a>
            </li>
          );
        } else if (eachNetwork.name === 'Twitter') {
          return (
            <li key={i}>
              <a href={eachNetwork.url}>
                <i class='fa-brands fa-twitter'></i>
              </a>
            </li>
          );
        }
      }
    );
    return socialNetworks;
  };

  const renderAdalabers = () => {
    const AdalabersList = adalabers
      .filter((eachAdalaber) =>
        eachAdalaber.name.toLowerCase().includes(searchName.toLowerCase())
      )
      .filter((eachAdalaber) => {
        if (searchCounselor === '') {
          return true;
        } else {
          return (
            eachAdalaber.counselor.toLowerCase() ===
            searchCounselor.toLowerCase()
          );
        }
      })
      .map((eachAdalaber) => {
        return (
          <tr key={eachAdalaber.id} className='table__row'>
            <td className='table__column'>{eachAdalaber.name}</td>
            <td className='table__column'>{eachAdalaber.counselor}</td>
            <td className='table__column'>{eachAdalaber.speciality}</td>
            <td className='table__column'>
              <ul className='list'>{renderSocialNetworks(eachAdalaber.id)}</ul>
            </td>
          </tr>
        );
      });
    return AdalabersList;
  };

  return (
    <>
      <main className='main'>
        <Header />
        <section className='landing'>
          <Search
            searchName={searchName}
            searchCounselor={searchCounselor}
            handleSearchName={handleSearchName}
            handleSearchCounselor={handleSearchCounselor}
          />
          <Adalabers
            renderAdalabers={renderAdalabers}
            newAdalaber={newAdalaber}
            handleInput={handleInput}
            handleNewAdalaber={handleNewAdalaber}
          />
        </section>
      </main>
    </>
  );
}

export default App;
