interface EmailTemplateProps {
  text: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  text,
}) => (
  <div>
    <h1>Welcome, {text}!</h1>
  </div>
);
