const IDENTIFIER = `my-cool-bucket-01`;

const resultLast = document.getElementById('result-last');
const resultAll = document.getElementById('result-all');

async function loadData() {
  const resLast = await fetch(
    `https://bitsy-nosql-bucket.herokuapp.com/api/buckets/${IDENTIFIER}/last`,
  );

  const resAll = await fetch(
    `https://bitsy-nosql-bucket.herokuapp.com/api/buckets/${IDENTIFIER}/items`,
  );

  resultLast.innerText = JSON.stringify(await resLast.json(), null, 2);
  resultAll.innerText = JSON.stringify(await resAll.json(), null, 2);
}

async function resetData() {
  await fetch(
    `https://bitsy-nosql-bucket.herokuapp.com/api/buckets/${IDENTIFIER}`,
    { method: 'DELETE' },
  );

  await loadData();
}

async function sendData(event) {
  event.preventDefault();

  const message = document.forms[0].elements.message.value;

  if (!message) {
    return;
  }

  await fetch(
    `https://bitsy-nosql-bucket.herokuapp.com/api/buckets/${IDENTIFIER}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    },
  );

  await loadData();
}

document.getElementById('message-form').addEventListener('submit', sendData);
document.getElementById('refresh-button').addEventListener('click', loadData);
document.getElementById('reset-button').addEventListener('click', resetData);

loadData();
