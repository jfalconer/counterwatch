'use strict';

const dqs = (query) => document.querySelector(query);
const dqsa = (query) => document.querySelectorAll(query);

document.addEventListener('DOMContentLoaded', function () {
  dqsa('.left-heroes .hero-item').forEach(clickLeftHero => clickLeftHero.addEventListener('click', setLeftHero));
});
document.addEventListener('DOMContentLoaded', function () {
  dqsa('.right-heroes .hero-item').forEach(clickRightHero => clickRightHero.addEventListener('click', setRightHero));
});
document.addEventListener('DOMContentLoaded', function () {
  dqsa('#matchem-button').forEach(clickMatchem => clickMatchem.addEventListener('click', getBattletagData));
});

let leftHero = null,
    rightHero = null,
    selectedLeftHero = null,
    selectedRightHero = null,
    leftBattletagData = {},
    rightBattletagData = {},
    leftBattletag = "",
    rightBattletag = "";

function setLeftHero (e) {
  let currentHero = e.target.dataset.hero;
  if (leftHero === currentHero) {
    leftHero = null;
    e.target.classList.toggle('selected-hero');
    console.log("leftHero cleared");
    buildContent();
    return;
  }
  if (selectedLeftHero) {
    selectedLeftHero.classList.remove('selected-hero');
  }
  e.target.classList.toggle('selected-hero');
  leftHero = e.target.dataset.hero;
  console.log(`${leftHero} selected`);
  selectedLeftHero = e.target;
  buildContent();
};

function setRightHero (e) {
  let currentHero = e.target.dataset.hero;
  if (rightHero === currentHero) {
    rightHero = null;
    e.target.classList.toggle('selected-hero');
    console.log("rightHero cleared");
    buildContent();
    return;
  }
  if (selectedRightHero) {
    selectedRightHero.classList.remove('selected-hero');
  }
  e.target.classList.toggle('selected-hero');
  rightHero = e.target.dataset.hero;
  console.log(`${rightHero} selected`);
  selectedRightHero = e.target;
  buildContent();
};

function buildContent () {
  if (leftHero && rightHero) {
    printMatchupData();
  } else if (leftHero || rightHero) {
    printHeroData();
  } else {
    dqs('#info-pane').innerHTML = `<p>Select one hero for hero advice, or two for matchup advice. Battletags are optional.</p>`;
  }
};

function printMatchupData() {
  dqs('#info-pane').innerHTML = `<p>${heroMatchupInfo[leftHero][rightHero]}</p>`;
};
function printHeroData() {
  dqs('#info-pane').innerHTML = `<p>${heroMatchupInfo[leftHero || rightHero].self}</p>
                                <p><strong>Select another hero for matchup advice.</strong></p>`;
};

async function getBattletagData(e) {
  leftBattletag = document.getElementById('left-battletag').value.replace("#", "-");
  rightBattletag = document.getElementById('right-battletag').value.replace("#", "-");
  console.log(`${leftBattletag} + ${rightBattletag}`);

  if (leftBattletag && rightBattletag) {
    leftBattletagData = await loadBattletag(leftBattletag); console.log(leftBattletagData);
    rightBattletagData = await loadBattletag(rightBattletag); console.log(rightBattletagData);
  } else if (leftBattletag && !rightBattletag) {
    leftBattletagData = await loadBattletag(leftBattletag); console.log(leftBattletagData);
  } else if (!leftBattletag && rightBattletag) {
    rightBattletagData = await loadBattletag(rightBattletag); console.log(rightBattletagData);
  }
  compareBattletags();
}

function loadBattletag(battletag) {
  return axios.get(`http://localhost:4444/api/v3/u/${battletag}/blob`)
  .then(function (response) {
    console.log(response);
    return response.data;
  })
  .catch(function (error) {
    console.log(error);
    dqs('#info-pane').innerHTML = `<p>Your request for the battletag ${battletag.replace("-", "#")} failed. Make sure the battletag is correct or clear the field.</p>`;
  });
}

function compareBattletags () {
  if (!leftHero || !rightHero) {
    return false;
  }
  let leftWinrate = leftBattletagData.us.heroes.stats.competitive[leftHero].general_stats.win_percentage;
  let rightWinrate = rightBattletagData.us.heroes.stats.competitive[rightHero].general_stats.win_percentage;
  if (leftWinrate > rightWinrate) {
    dqs('#info-pane').innerHTML += `<p><strong>${leftBattletag.slice(0, -5)} wins!</strong></p>`;
    dqs('#info-pane').innerHTML += `<p>${leftBattletag.slice(0, -5)} had a win rate of ${leftWinrate} on ${heroMatchupInfo[leftHero].name}, compared to ${rightBattletag.slice(0, -5)}'s ${rightWinrate} on ${heroMatchupInfo[rightHero].name}.</p>`;
  }
  else if (rightWinrate > leftWinrate) {
    dqs('#info-pane').innerHTML += `<p><strong>${rightBattletag.slice(0, -5)} wins!</p></strong>`;
    dqs('#info-pane').innerHTML += `<p>${rightBattletag.slice(0, -5)} had a win rate of ${rightWinrate} on ${heroMatchupInfo[rightHero].name}, compared to ${leftBattletag.slice(0, -5)}'s ${leftWinrate} on ${heroMatchupInfo[leftHero].name}.</p>`;
  }
}
