interface EmailTemplateProps {
  text: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  text,
}) => (
  <div>
    <h1>{text}</h1>
  </div>
);
