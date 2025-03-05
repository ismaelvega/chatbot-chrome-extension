let currentQuestions = [];

document.getElementById('generateQuestions').addEventListener('click', generateQuestions);
document.getElementById('checkAnswers').addEventListener('click', checkAnswers);

async function generateQuestions() {
  // Get current tab's content
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const response = await chrome.tabs.sendMessage(tab.id, { action: "getPageContent" });
  
  // Call OpenAI API to generate questions
  const questions = await generateQuestionsFromContent(response.content);
  displayQuestions(questions);
}

async function generateQuestionsFromContent(content) {
  // Replace with your OpenAI API endpoint and key
  const API_KEY = 'your-api-key';
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "Generate 3 multiple-choice questions to test reading comprehension of the following text. Format as JSON array with questions, options, and correct answers."
      }, {
        role: "user",
        content: content
      }]
    })
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

function displayQuestions(questions) {
  currentQuestions = questions;
  const container = document.getElementById('questions-container');
  container.innerHTML = '';

  questions.forEach((q, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.innerHTML = `
      <p>${index + 1}. ${q.question}</p>
      ${q.options.map((option, i) => `
        <label>
          <input type="radio" name="q${index}" value="${i}">
          ${option}
        </label>
      `).join('<br>')}
    `;
    container.appendChild(questionDiv);
  });
}

function checkAnswers() {
  let score = 0;
  currentQuestions.forEach((q, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    if (selected && parseInt(selected.value) === q.correctAnswer) {
      score++;
    }
  });
  
  document.getElementById('score').textContent = 
    `Score: ${score}/${currentQuestions.length}`;
} 