const fs = require('fs');

exports.handler = async (event, context) => {
    if (event.httpMethod === 'POST') {
        try {
            const { subject, question, options, correctAnswer } = JSON.parse(event.body);
            
            // Here, we're simulating saving data to a local file (for simplicity).
            // In production, you would use a database like Firebase, MongoDB, etc.
            const filePath = `./questions_${subject}.json`;
            let existingQuestions = [];
            
            if (fs.existsSync(filePath)) {
                existingQuestions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            }
            
            const newQuestion = { question, options, correctAnswer };
            existingQuestions.push(newQuestion);
            
            fs.writeFileSync(filePath, JSON.stringify(existingQuestions, null, 2));
            
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true }),
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ success: false, error: error.message }),
            };
        }
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ success: false, message: 'Method Not Allowed' }),
        };
    }
};
