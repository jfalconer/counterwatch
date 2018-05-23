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
  if (matchType == `veryweak`) {
      matchupString = `<p>${heroMatchupInfo[leftHero].name} is very weak against ${heroMatchupInfo[rightHero].name}.</p>`;
  } else if (matchType == `weak`) {
    matchupString = `<p>${heroMatchupInfo[leftHero].name} is somewhat weak against ${heroMatchupInfo[rightHero].name}.</p>`;
  } else if (matchType == `neutral`) {
    matchupString = `<p>${heroMatchupInfo[leftHero].name} performs neutrally against ${heroMatchupInfo[rightHero].name}. Skill and overall team composition will decide the outcome.</p>`;
  } else if (matchType == `softcounter`) {
    matchupString = `<p>${heroMatchupInfo[leftHero].name} is a soft counter to ${heroMatchupInfo[rightHero].name}.</p>`;
  } else if (matchType == `hardcounter`) {
    matchupString = `<p>${heroMatchupInfo[leftHero].name} is a hard counter to ${heroMatchupInfo[rightHero].name}.</p>`;
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
  let leftWinrate = leftBattletagData.us.heroes.stats.competitive[leftHero].general_stats.win_percentage,
      leftGamesWon = leftBattletagData.us.heroes.stats.competitive[leftHero].general_stats.games_won,
      leftCompRank = leftBattletagData.us.stats.competitive.overall_stats.comprank,
      leftScore = Math.ceil(leftWinrate * leftCompRank / 100),
      rightWinrate = rightBattletagData.us.heroes.stats.competitive[rightHero].general_stats.win_percentage,
      rightGamesWon = rightBattletagData.us.heroes.stats.competitive[rightHero].general_stats.games_won,
      rightCompRank = rightBattletagData.us.stats.competitive.overall_stats.comprank,
      rightScore = Math.ceil(rightWinrate * rightCompRank / 100);
  if (leftScore > rightScore) {
    dqs('#info-pane').innerHTML += `<p><strong>${leftBattletag.slice(0, -5)} wins!</strong></p>`;
    dqs('#info-pane').innerHTML += `<p>${leftBattletag.slice(0, -5)} had a score of ${leftScore} on ${heroMatchupInfo[leftHero].name}, compared to ${rightBattletag.slice(0, -5)}'s ${rightScore} on ${heroMatchupInfo[rightHero].name}.</p>`;
  }
  else if (rightScore > leftScore) {
    dqs('#info-pane').innerHTML += `<p><strong>${rightBattletag.slice(0, -5)} wins!</p></strong>`;
    dqs('#info-pane').innerHTML += `<p>${rightBattletag.slice(0, -5)} had a score of ${rightScore} on ${heroMatchupInfo[rightHero].name}, compared to ${leftBattletag.slice(0, -5)}'s ${leftScore} on ${heroMatchupInfo[leftHero].name}.</p>`;
  }
  dqs('#info-pane').innerHTML += `<div class="row">
  <!-- left player stats -->
    <div class="col"></div>
    <div class="col">
      <p><strong>${leftBattletag.slice(0, -5)} as ${heroMatchupInfo[leftHero].name}</strong></p>
      <ul>
        <li>Win percentage: ${leftWinrate}</li>
        <li>Games won: ${leftGamesWon}</li>
        <li>Competitive rank: ${leftCompRank}</li>
      </ul>
    </div>
  <!-- right player stats -->
    <div class="col">
      <p><strong>${rightBattletag.slice(0, -5)} as ${heroMatchupInfo[rightHero].name}</strong></p>
      <ul>
        <li>Win percentage: ${rightWinrate}</li>
        <li>Games won: ${rightGamesWon}</li>
        <li>Competitive rank: ${rightCompRank}</li>
      </ul>
    </div>
    <div class="col"></div>
  </div>`;
}
