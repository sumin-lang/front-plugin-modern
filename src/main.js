import Front from '@frontapp/plugin-sdk';
import './style.css'; // Vite can import CSS too!

const resultsDiv = document.getElementById('results');

console.log('Plugin initialized.');

// Listen for context updates with the new SDK
Front.contextUpdates.subscribe(context => {
  console.log('Conversation context received:', context);

  switch (context.type) {
    case 'singleConversation':
      const inboxId = context.conversation.inboxes[0].id;
      if (inboxId) {
        fetchAirtableData(inboxId);
      }
      break;
    default:
      console.log('Context is not a conversation, ignoring.');
      break;
  }
});

// This function calls our secure proxy API route
async function fetchAirtableData(inboxId) {
  resultsDiv.innerHTML = '<p>Searching Airtable...</p>';
  try {
    const response = await fetch(`/api/getData?inboxId=${encodeURIComponent(inboxId)}`);
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    const data = await response.json();
    displayData(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    resultsDiv.innerHTML = '<p class="error">Could not connect to the Airtable API.</p>';
  }
}


// This function displays the data and is unchanged
function displayData(records) {
  if (records.length === 0) {
    resultsDiv.innerHTML = '<p>No records found for this inbox.</p>';
    return;
  }

  const fields = records[0].fields;
  let html = ''; // Start with an empty string

  const fieldsToDisplay1 = [
    { label: 'Attorney', value: fields['Primary Attorney'] },
    { label: 'Paralegal', value: fields['Primary Paralegal'] },
    { label: 'PA', value: fields['Primary Practice Assistant'] },
  ];

  const fieldsToDisplay2 = [
    { label: 'Attorney', value: fields['Secondary Attorney'] },
    { label: 'Paralegal', value: fields['Secondary Paralegal'] },
    { label: 'PA', value: fields['Secondary Practice Assistant'] },
    { label: 'Intern', value: fields['Legal Intern'] },
  ];

  // --- Primary Team ---
  html += '<h4>Primary Team</h4>';
  html += '<div class="customer-data">'; // Start the first grid
  fieldsToDisplay1.forEach(item => {
    html += `<div class="data-label">${item.label}:</div>`;
    html += `<div class="data-value">${item.value || 'N/A'}</div>`;
  });
  html += '</div>'; // End the first grid

  // --- Secondary Team ---
  html += '<h4>Secondary Team</h4>';
  html += '<div class="customer-data">'; // Start the second grid
  fieldsToDisplay2.forEach(item => {
    html += `<div class="data-label">${item.label}:</div>`;
    html += `<div class="data-value">${item.value || 'N/A'}</div>`;
  });
  html += '</div>'; // End the second grid

  resultsDiv.innerHTML = html;
}