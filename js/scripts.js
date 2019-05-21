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
    leftBattletagData = null,
    rightBattletagData = null,
    leftBattletag = null,
    rightBattletag = null;

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
  compareBattletags();
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
  compareBattletags();
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
  let matchupString,
      matchType = heroMatchupInfo[leftHero][rightHero].matchup,
      matchStrategy = heroMatchupInfo[leftHero][rightHero].strategy;
  switch (matchType) {
    case `veryweak`:
      matchupString = `<p>${heroMatchupInfo[leftHero].name} is very weak against ${heroMatchupInfo[rightHero].name}.</p>`;
      break;
    case `weak`:
      matchupString = `<p>${heroMatchupInfo[leftHero].name} is somewhat weak against ${heroMatchupInfo[rightHero].name}.</p>`;
      break;
    case `neutral`:
      matchupString = `<p>${heroMatchupInfo[leftHero].name} performs neutrally against ${heroMatchupInfo[rightHero].name}.</p>`;
      break;
    case `softcounter`:
      matchupString = `<p>${heroMatchupInfo[leftHero].name} is a soft counter to ${heroMatchupInfo[rightHero].name}.</p>`;
      break;
    case `hardcounter`:
      matchupString = `<p>${heroMatchupInfo[leftHero].name} is a hard counter to ${heroMatchupInfo[rightHero].name}.</p>`;
      break;
  }
  if (matchStrategy) {
  matchupString += matchStrategy;
  }

  dqs('#info-pane').innerHTML = `<h3>${heroMatchupInfo[leftHero].name} vs ${heroMatchupInfo[rightHero].name}</h3>
  ${matchupString}`;
};
function printHeroData() {
  dqs('#info-pane').innerHTML = `<p>${heroMatchupInfo[leftHero || rightHero].self}</p>
                                <p><strong>Select another hero for matchup advice.</strong></p>`;
};
