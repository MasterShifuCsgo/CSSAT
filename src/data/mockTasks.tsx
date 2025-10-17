// src/data/mockTasks.ts

export const mockTasks = {
  network_security: {
    multiple_choice: {
      data: {
        title: "Which of the following best describes phishing?",
        options: [
          "A type of malware that deletes system files",
          "An attack where users are tricked into revealing information",
          "Software that encrypts files for ransom",
          "A physical security breach",
        ],
      },
    },
    drag_and_drop: {
      items: ["Phishing", "DDoS", "Malware", "SQL Injection"],
      containers: ["Network Attacks", "Social Engineering", "Malware"],
    },
    scenario: {
      data: {      
        description:
          "Suddenly, you receive an urgent email from your company’s CEO asking you to verify your login credentials to 'avoid account suspension.' The email looks official, with the company logo and signature.",
        blocks: ["Open the link", "Report the email", "Ignore it"],
      },
    },
  },
};
