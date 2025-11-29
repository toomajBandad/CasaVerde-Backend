// templates/welcomeEmail.ts
export const welcomeEmail = (username: string) => `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 30px; border-radius: 8px;">
    <h1 style="color: #01796f;">Hello ${username} 👋</h1>
    <p>Welcome aboard!</p>
    <p>Thanks for signing up—your journey with us starts now.</p>
    <ul>
      <li>🔒 Member-only features</li>
      <li>📢 News and updates</li>
      <li>💬 Personalized support</li>
    </ul>
    <p style="margin-top: 20px;">Cheers,<br><strong>The Team 🚀</strong></p>
    <small style="color: #888;">You received this email because you signed up for our service.</small>
  </div>
`;