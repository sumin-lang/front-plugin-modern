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
  let html = '<div class="customer-data">';
  if (records.length === 0) {
    html += '<p>No records found.</p>';
  } else {
    records.forEach(record => {
      const fields = record.fields;
      html += `<p><strong>Primary Attorney:</strong> ${fields['Primary Attorney'] || 'N/A'}</p>`;
      html += `<p><strong>Primary Paralegal:</strong> ${fields['Primary Paralegal'] || 'N/A'}</p>`;
      html += `<p><strong>Primary PA:</strong> ${fields['Primary Practice Assistant'] || 'N/A'}</p>`;
      html += `<p><strong>Secondary Attorney:</strong> ${fields['Secondary Attorney'] || 'N/A'}</p>`;
      html += `<p><strong>Secondary Paralegal:</strong> ${fields['Secondary Paralegal'] || 'N/A'}</p>`;
      html += `<p><strong>Secondary PA:</strong> ${fields['Secondary Practice Assistant'] || 'N/A'}</p>`;
      html += `<p><strong>Intern:</strong> ${fields['Legal Intern'] || 'N/A'}</p>`;
      html += '<hr>';
    });
  }
  html += '</div>';
  resultsDiv.innerHTML = html;
}