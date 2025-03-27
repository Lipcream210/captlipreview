
async function saveQuestionToBackend(subject, question, options, correctAnswer) {
    const response = await fetch('/.netlify/functions/saveQuestion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            subject,
            question,
            options,
            correctAnswer,
        }),
    });
    const result = await response.json();
    if (result.success) {
        alert("Question saved successfully!");
    } else {
        alert("Failed to save the question.");
    }
}


