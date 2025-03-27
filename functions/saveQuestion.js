const fetch = require("node-fetch");
const { Octokit } = require("@octokit/rest");

// GitHub Repository Details
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Set this in Netlify environment variables
const REPO_OWNER = "Lipcream210"; // Your GitHub username
const REPO_NAME = "captlipreview"; // Your repo name
const FILE_PATH = "questions.json"; // File to store questions

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { subject, question, options, correct } = JSON.parse(event.body);

    if (!subject || !question || !options || !correct) {
        return { statusCode: 400, body: "Missing data fields" };
    }

    try {
        const octokit = new Octokit({ auth: GITHUB_TOKEN });

        // Fetch existing questions.json from GitHub
        const { data } = await octokit.repos.getContent({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: FILE_PATH,
        });

        const content = Buffer.from(data.content, "base64").toString("utf8");
        const questions = JSON.parse(content);

        // Add the new question
        if (!questions[subject]) questions[subject] = [];
        questions[subject].push({ question, options, correct });

        // Update GitHub file
        const response = await octokit.repos.createOrUpdateFileContents({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: FILE_PATH,
            message: "Updated questions.json",
            content: Buffer.from(JSON.stringify(questions, null, 2)).toString("base64"),
            sha: data.sha,
        });

        return { statusCode: 200, body: JSON.stringify({ message: "Question saved" }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
