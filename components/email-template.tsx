interface EmailTemplateProps {
  text: string;
  email: string;
  name?: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  text,
  name,
  email,
}) => (
  <div>
    <h1>Новое сообщение с Pets in Korea</h1>
    <p>Имя: {name ? name : "Не указано"}</p>
    <p>Почта: {email}</p>
    <h2>Содержание:</h2>
    <p>{text}</p>
  </div>
);
